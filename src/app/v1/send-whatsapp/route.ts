// app/v1/send-whatsapp/route.ts

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Global browser instance to maintain session
let globalBrowser: any = null;
let globalPage: any = null;
let isInitialized = false;
let isInitializing = false;

// Utility function for delays (compatible with all Puppeteer versions)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Server-side WhatsApp automation class
class WhatsAppAutomationServer {
  private sessionPath: string;

  constructor() {
    this.sessionPath = path.join(process.cwd(), "whatsapp-session.json");
  }

  async initialize() {
    // Prevent multiple initializations
    if (isInitializing) {
      // Wait for current initialization to complete
      while (isInitializing) {
        await delay(1000);
      }
      return;
    }

    if (isInitialized && globalBrowser && globalPage) {
      try {
        // Check if page is still active
        await globalPage.evaluate(() => window.location.href);
        return; // Already initialized and working
      } catch (error) {
        console.log("Existing session is dead, reinitializing...");
        isInitialized = false;
        globalBrowser = null;
        globalPage = null;
      }
    }

    isInitializing = true;

    let puppeteer;
    try {
      puppeteer = require("puppeteer");
    } catch (error) {
      isInitializing = false;
      throw new Error("Puppeteer is not installed. Run: npm install puppeteer");
    }

    try {
      console.log("Initializing WhatsApp Web...");

      globalBrowser = await puppeteer.launch({
        headless: false, // Keep false for debugging and QR code scanning
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
          "--disable-web-security",
          "--disable-features=VizDisplayCompositor",
          "--user-data-dir=/tmp/puppeteer-whatsapp", // Separate profile
        ],
      });

      globalPage = await globalBrowser.newPage();

      // Set viewport and user agent
      await globalPage.setViewport({ width: 1366, height: 768 });
      await globalPage.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      );

      // Load saved session if exists
      await this.loadSession();

      console.log("Navigating to WhatsApp Web...");
      await globalPage.goto("https://web.whatsapp.com", {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      // Wait for page to load
      await delay(3000);

      // Check if already logged in by looking for chat list or QR code
      console.log("Checking login status...");

      try {
        // Try to find chat list (logged in state)
        await globalPage.waitForSelector('div[data-testid="chat-list"]', {
          timeout: 5000,
        });
        console.log("WhatsApp Web: Already logged in");
        await this.saveSession();
        isInitialized = true;
        isInitializing = false;
        return;
      } catch (e) {
        console.log("Not logged in, checking for QR code...");
      }

      // Look for QR code
      try {
        const qrSelector =
          'canvas[aria-label="Scan me!"], div[data-testid="qr-code"]';
        await globalPage.waitForSelector(qrSelector, { timeout: 10000 });
        console.log("WhatsApp Web: QR code detected, waiting for scan...");

        // Wait for login (QR code scan) with longer timeout
        await globalPage.waitForSelector('div[data-testid="chat-list"]', {
          timeout: 120000, // 2 minutes
        });

        console.log("WhatsApp Web: Login successful after QR scan");
      } catch (qrError) {
        console.log("QR code timeout, trying alternative login detection...");

        // Alternative: wait for any indication of successful login
        const loginSelectors = [
          'div[data-testid="chat-list"]',
          'div[title="Chat list"]',
          'div[aria-label="Chat list"]',
        ];

        let loginFound = false;
        for (const selector of loginSelectors) {
          try {
            await globalPage.waitForSelector(selector, { timeout: 10000 });
            loginFound = true;
            console.log(`Login detected with selector: ${selector}`);
            break;
          } catch (e) {
            continue;
          }
        }

        if (!loginFound) {
          throw new Error(
            "Unable to detect successful WhatsApp login. Please ensure QR code is scanned."
          );
        }
      }

      // Additional wait to ensure everything is loaded
      await delay(5000);

      await this.saveSession();
      isInitialized = true;
      console.log("WhatsApp Web initialization completed successfully");
    } catch (error) {
      console.error("WhatsApp initialization error:", error);

      if (globalBrowser) {
        try {
          await globalBrowser.close();
        } catch (e) {
          console.error("Error closing browser:", e);
        }
        globalBrowser = null;
        globalPage = null;
      }

      throw new Error(
        `WhatsApp Web initialization failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      isInitializing = false;
    }
  }

  async saveSession() {
    try {
      if (!globalPage) return;

      const cookies = await globalPage.cookies();
      const localStorage = await globalPage.evaluate(() => {
        const items: any = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            items[key] = localStorage.getItem(key);
          }
        }
        return items;
      });

      const sessionData = {
        cookies,
        localStorage,
        timestamp: Date.now(),
      };

      fs.writeFileSync(this.sessionPath, JSON.stringify(sessionData, null, 2));
      console.log("Session saved successfully");
    } catch (error) {
      console.error("Failed to save session:", error);
    }
  }

  async loadSession() {
    try {
      if (fs.existsSync(this.sessionPath)) {
        const sessionData = JSON.parse(
          fs.readFileSync(this.sessionPath, "utf8")
        );

        // Check if session is not too old (24 hours)
        const isExpired =
          Date.now() - sessionData.timestamp > 24 * 60 * 60 * 1000;
        if (isExpired) {
          console.log("Session expired, removing...");
          fs.unlinkSync(this.sessionPath);
          return;
        }

        // Set cookies
        if (sessionData.cookies && sessionData.cookies.length > 0) {
          await globalPage.setCookie(...sessionData.cookies);
        }

        // Set localStorage
        if (sessionData.localStorage) {
          await globalPage.evaluateOnNewDocument((localStorageData: any) => {
            for (const key in localStorageData) {
              if (localStorageData[key] !== null) {
                localStorage.setItem(key, localStorageData[key]);
              }
            }
          }, sessionData.localStorage);
        }

        console.log("Session loaded successfully");
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    }
  }

  async sendMessage(phoneNumber: string, message: string) {
    if (!globalPage) {
      throw new Error("WhatsApp not initialized");
    }

    try {
      // Clean the phone number
      const formattedNumber = phoneNumber.replace(/[\s\-\+]/g, "");
      console.log(`Sending message to: ${formattedNumber}`);

      // Use the direct WhatsApp Web URL format
      const chatUrl = `https://web.whatsapp.com/send?phone=${formattedNumber}`;

      await globalPage.goto(chatUrl, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      // Wait for the page to load
      await delay(3000);

      // Check if we're still on WhatsApp and logged in
      const currentUrl = await globalPage.url();
      if (!currentUrl.includes("web.whatsapp.com")) {
        throw new Error("Navigation failed - not on WhatsApp Web");
      }

      // Look for error messages first
      try {
        const errorDialog = await globalPage.waitForSelector(
          'div[data-animate-modal-popup="true"]',
          { timeout: 3000 }
        );
        if (errorDialog) {
          const errorText = await globalPage.evaluate(
            (el: any) => el.textContent,
            errorDialog
          );
          throw new Error(`WhatsApp error: ${errorText}`);
        }
      } catch (e) {
        // No error dialog found, continue
      }

      // Look for the message input box with multiple possible selectors
      const inputSelectors = [
        'div[data-testid="conversation-compose-box-input"]',
        'div[contenteditable="true"][data-tab="10"]',
        'div[contenteditable="true"][role="textbox"]',
        'div[title="Type a message"]',
        'div[data-testid="compose-btn-send"]', // Sometimes this appears first
        'footer div[contenteditable="true"]',
      ];

      let messageBox = null;
      for (const selector of inputSelectors) {
        try {
          await globalPage.waitForSelector(selector, { timeout: 8000 });
          messageBox = await globalPage.$(selector);
          if (messageBox) {
            console.log(`Found message box with selector: ${selector}`);
            break;
          }
        } catch (e) {
          console.log(`Selector ${selector} not found, trying next...`);
          continue;
        }
      }

      if (!messageBox) {
        // Try alternative approach - click on the compose area
        try {
          const composeArea = await globalPage.$(
            'div[data-testid="compose-btn-send"]'
          );
          if (composeArea) {
            await composeArea.click();
            await delay(1000);

            // Try to find message box again
            messageBox = await globalPage.$(
              'div[data-testid="conversation-compose-box-input"]'
            );
          }
        } catch (e) {
          console.log("Alternative compose approach failed");
        }
      }

      if (!messageBox) {
        throw new Error(
          "Message input box not found - contact may not exist or WhatsApp Web needs refresh"
        );
      }

      // Click on the message box and wait
      await messageBox.click();
      await delay(1000);

      // Focus and clear any existing text
      await messageBox.focus();
      await delay(500);

      // Select all and delete
      await globalPage.keyboard.down("Control");
      await globalPage.keyboard.press("A");
      await globalPage.keyboard.up("Control");
      await delay(300);
      await globalPage.keyboard.press("Delete");
      await delay(300);

      // Type the new message
      await messageBox.type(message, { delay: 50 });
      await delay(1000);

      // Send the message
      await globalPage.keyboard.press("Enter");
      await delay(3000);

      // Verify message was sent by checking for a sent message
      try {
        const sentMessageSelector =
          'span[data-testid="msg-time"], div[data-testid="tail-out"]';
        await globalPage.waitForSelector(sentMessageSelector, {
          timeout: 5000,
        });
        console.log("Message sent successfully - delivery confirmed");
      } catch (e) {
        console.log(
          "Could not verify message delivery visually, but send command executed"
        );
      }

      // Save session after successful message
      await this.saveSession();

      return {
        success: true,
        phoneNumber: formattedNumber,
        message,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Send message error:", error);
      return {
        success: false,
        phoneNumber,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error sending message",
      };
    }
  }

  async close() {
    if (globalBrowser) {
      try {
        await globalBrowser.close();
        console.log("Browser closed successfully");
      } catch (error) {
        console.error("Error closing browser:", error);
      }
      globalBrowser = null;
      globalPage = null;
      isInitialized = false;
    }
  }
}

// Authorized numbers list
const AUTHORIZED_NUMBERS = ["+2347066324306", "+2348068855515"];

const isNumberAuthorized = (phoneNumber: string): boolean => {
  const normalizedInput = phoneNumber.replace(/[\s\-]/g, "");
  return AUTHORIZED_NUMBERS.some((authorizedNumber) => {
    const normalizedAuthorized = authorizedNumber.replace(/[\s\-]/g, "");
    return normalizedInput === normalizedAuthorized;
  });
};

// Create a singleton instance
const whatsappInstance = new WhatsAppAutomationServer();

// POST handler for App Router
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, message } = body;

    console.log("Received WhatsApp send request:", {
      phoneNumber,
      messageLength: message?.length,
      messagePreview: message?.substring(0, 50) + "...",
    });

    // Validation
    if (!phoneNumber || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Phone number and message are required",
        },
        { status: 400 }
      );
    }

    // Check if number is authorized
    if (!isNumberAuthorized(phoneNumber)) {
      console.log("Unauthorized number attempted:", phoneNumber);
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized phone number",
        },
        { status: 403 }
      );
    }

    try {
      // Initialize if not already done
      console.log("Checking initialization status...");
      await whatsappInstance.initialize();

      console.log("Sending message...");
      const result = await whatsappInstance.sendMessage(phoneNumber, message);

      if (result.success) {
        console.log("Message sent successfully:", result);
        return NextResponse.json(result, { status: 200 });
      } else {
        console.error("Message sending failed:", result);
        return NextResponse.json(result, { status: 500 });
      }
    } catch (error) {
      console.error("WhatsApp operation error:", error);
      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error ? error.message : "WhatsApp service error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Request parsing error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request body",
      },
      { status: 400 }
    );
  }
}

// GET handler for checking status
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: "WhatsApp API endpoint",
      initialized: isInitialized,
      initializing: isInitializing,
      methods: ["POST", "GET"],
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

// Cleanup on process exit
process.on("SIGINT", async () => {
  console.log("Shutting down WhatsApp service...");
  await whatsappInstance.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down WhatsApp service...");
  await whatsappInstance.close();
  process.exit(0);
});

// // app/v1/send-whatsapp/route.ts
// import { NextRequest, NextResponse } from "next/server";

// // WhatsApp Graph API Configuration
// const WHATSAPP_CONFIG = {
//   phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!, // Your Phone Number ID
//   accessToken: process.env.WHATSAPP_ACCESS_TOKEN!, // Your Access Token
//   version: "v18.0", // API version
//   verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || "your-verify-token", // For webhook verification
// };

// // Authorized numbers list
// const AUTHORIZED_NUMBERS = ["+2347066324306", "+2348068855515"];

// const isNumberAuthorized = (phoneNumber: string): boolean => {
//   const normalizedInput = phoneNumber.replace(/[\s\-]/g, "");
//   return AUTHORIZED_NUMBERS.some((authorizedNumber) => {
//     const normalizedAuthorized = authorizedNumber.replace(/[\s\-]/g, "");
//     return normalizedInput === normalizedAuthorized;
//   });
// };

// // Format phone number for WhatsApp API (remove + and ensure proper format)
// const formatPhoneNumber = (phoneNumber: string): string => {
//   return phoneNumber.replace(/[\s\-\+]/g, "");
// };

// // WhatsApp Graph API Service
// class WhatsAppGraphAPI {
//   private baseUrl: string;
//   private phoneNumberId: string;
//   private accessToken: string;

//   constructor() {
//     this.phoneNumberId = WHATSAPP_CONFIG.phoneNumberId;
//     this.accessToken = WHATSAPP_CONFIG.accessToken;
//     this.baseUrl = `https://graph.facebook.com/${WHATSAPP_CONFIG.version}/${this.phoneNumberId}`;
//   }

//   // Send a text message
//   async sendTextMessage(phoneNumber: string, message: string) {
//     const formattedNumber = formatPhoneNumber(phoneNumber);

//     const payload = {
//       messaging_product: "whatsapp",
//       to: formattedNumber,
//       type: "text",
//       text: {
//         body: message,
//       },
//     };

//     try {
//       const response = await fetch(`${this.baseUrl}/messages`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           `WhatsApp API Error: ${
//             responseData.error?.message || "Unknown error"
//           }`
//         );
//       }

//       return {
//         success: true,
//         messageId: responseData.messages[0].id,
//         phoneNumber: formattedNumber,
//         message,
//         timestamp: new Date().toISOString(),
//         response: responseData,
//       };
//     } catch (error) {
//       console.error("WhatsApp API Error:", error);
//       return {
//         success: false,
//         phoneNumber: formattedNumber,
//         error:
//           error instanceof Error
//             ? error.message
//             : "Unknown error sending message",
//       };
//     }
//   }

//   // Send a template message (for verification codes, etc.)
//   async sendTemplateMessage(
//     phoneNumber: string,
//     templateName: string,
//     parameters: string[]
//   ) {
//     const formattedNumber = formatPhoneNumber(phoneNumber);

//     const payload = {
//       messaging_product: "whatsapp",
//       to: formattedNumber,
//       type: "template",
//       template: {
//         name: templateName,
//         language: {
//           code: "en_US", // Change based on your template language
//         },
//         components: [
//           {
//             type: "body",
//             parameters: parameters.map((param) => ({
//               type: "text",
//               text: param,
//             })),
//           },
//         ],
//       },
//     };

//     try {
//       const response = await fetch(`${this.baseUrl}/messages`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${this.accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const responseData = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           `WhatsApp API Error: ${
//             responseData.error?.message || "Unknown error"
//           }`
//         );
//       }

//       return {
//         success: true,
//         messageId: responseData.messages[0].id,
//         phoneNumber: formattedNumber,
//         templateName,
//         parameters,
//         timestamp: new Date().toISOString(),
//         response: responseData,
//       };
//     } catch (error) {
//       console.error("WhatsApp Template API Error:", error);
//       return {
//         success: false,
//         phoneNumber: formattedNumber,
//         error:
//           error instanceof Error
//             ? error.message
//             : "Unknown error sending template",
//       };
//     }
//   }

//   // Get message status
//   async getMessageStatus(messageId: string) {
//     try {
//       const response = await fetch(
//         `https://graph.facebook.com/${WHATSAPP_CONFIG.version}/${messageId}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${this.accessToken}`,
//           },
//         }
//       );

//       const responseData = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           `WhatsApp API Error: ${
//             responseData.error?.message || "Unknown error"
//           }`
//         );
//       }

//       return {
//         success: true,
//         status: responseData,
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error:
//           error instanceof Error
//             ? error.message
//             : "Unknown error getting status",
//       };
//     }
//   }
// }

// // Create instance
// const whatsappAPI = new WhatsAppGraphAPI();

// // POST handler for sending messages
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const {
//       phoneNumber,
//       message,
//       templateName,
//       parameters,
//       type = "text",
//     } = body;

//     console.log("Received WhatsApp send request:", {
//       phoneNumber,
//       type,
//       messageLength: message?.length,
//       templateName,
//       parametersCount: parameters?.length,
//     });

//     // Validation
//     if (!phoneNumber) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Phone number is required",
//         },
//         { status: 400 }
//       );
//     }

//     if (type === "text" && !message) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Message is required for text type",
//         },
//         { status: 400 }
//       );
//     }

//     if (type === "template" && (!templateName || !parameters)) {
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Template name and parameters are required for template type",
//         },
//         { status: 400 }
//       );
//     }

//     // Check if number is authorized
//     if (!isNumberAuthorized(phoneNumber)) {
//       console.log("Unauthorized number attempted:", phoneNumber);
//       return NextResponse.json(
//         {
//           success: false,
//           error: "Unauthorized phone number",
//         },
//         { status: 403 }
//       );
//     }

//     try {
//       let result;

//       if (type === "template") {
//         console.log(`Sending template message: ${templateName}`);
//         result = await whatsappAPI.sendTemplateMessage(
//           phoneNumber,
//           templateName,
//           parameters
//         );
//       } else {
//         console.log("Sending text message");
//         result = await whatsappAPI.sendTextMessage(phoneNumber, message);
//       }

//       if (result.success) {
//         console.log("Message sent successfully:", result);
//         return NextResponse.json(result, { status: 200 });
//       } else {
//         console.error("Message sending failed:", result);
//         return NextResponse.json(result, { status: 500 });
//       }
//     } catch (error) {
//       console.error("WhatsApp operation error:", error);
//       return NextResponse.json(
//         {
//           success: false,
//           error:
//             error instanceof Error ? error.message : "WhatsApp service error",
//         },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("Request parsing error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: "Invalid request body",
//       },
//       { status: 400 }
//     );
//   }
// }

// // GET handler for webhook verification and status
// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);

//   // Webhook verification
//   const mode = searchParams.get("hub.mode");
//   const token = searchParams.get("hub.verify_token");
//   const challenge = searchParams.get("hub.challenge");

//   if (mode === "subscribe" && token === WHATSAPP_CONFIG.verifyToken) {
//     console.log("Webhook verified successfully");
//     return new NextResponse(challenge, { status: 200 });
//   }

//   // Status endpoint
//   return NextResponse.json(
//     {
//       message: "WhatsApp Graph API endpoint",
//       phoneNumberId: WHATSAPP_CONFIG.phoneNumberId,
//       version: WHATSAPP_CONFIG.version,
//       methods: ["POST", "GET"],
//       supportedTypes: ["text", "template"],
//       timestamp: new Date().toISOString(),
//     },
//     { status: 200 }
//   );
// }

// // POST handler for webhook (incoming messages)
// export async function PATCH(request: NextRequest) {
//   try {
//     const body = await request.json();

//     console.log("Received webhook:", JSON.stringify(body, null, 2));

//     // Process incoming messages/status updates
//     if (body.object === "whatsapp_business_account") {
//       body.entry?.forEach((entry: any) => {
//         entry.changes?.forEach((change: any) => {
//           if (change.field === "messages") {
//             const messages = change.value.messages;
//             const statuses = change.value.statuses;

//             // Handle incoming messages
//             if (messages) {
//               messages.forEach((message: any) => {
//                 console.log("Incoming message:", message);
//                 // Handle incoming message logic here
//               });
//             }

//             // Handle message status updates
//             if (statuses) {
//               statuses.forEach((status: any) => {
//                 console.log("Message status update:", status);
//                 // Handle status update logic here
//               });
//             }
//           }
//         });
//       });
//     }

//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (error) {
//     console.error("Webhook processing error:", error);
//     return NextResponse.json(
//       { success: false, error: "Webhook processing failed" },
//       { status: 500 }
//     );
//   }
// }
