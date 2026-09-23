// utils/wa-messages.ts

export class WhatsAppAutomation {
  constructor() {
    // No browser initialization needed on client-side
  }

  async initialize() {
    // No initialization needed for client-side API calls
    return Promise.resolve();
  }

  async sendMessage(phoneNumber: string, message: string) {
    try {
      // Fixed: Correct API endpoint URL to match your structure
      const response = await fetch("/v1/send-whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `HTTP ${response.status}: Failed to send message`
        );
      }

      return result;
    } catch (error) {
      console.error("WhatsApp API call failed:", error);
      return {
        success: false,
        phoneNumber,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  async close() {
    // No cleanup needed for client-side
    return Promise.resolve();
  }
}

// Alternative: Simple function approach (recommended)
export const sendWhatsAppMessage = async (
  phoneNumber: string,
  message: string
) => {
  try {
    console.log("Sending WhatsApp message to:", phoneNumber);

    const response = await fetch("/v1/send-whatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber,
        message,
      }),
    });

    const result = await response.json();
    console.log("WhatsApp API response:", result);

    if (!response.ok) {
      throw new Error(
        result.error || `HTTP ${response.status}: Failed to send message`
      );
    }

    return result;
  } catch (error) {
    console.error("WhatsApp message sending failed:", error);
    throw new Error(error instanceof Error ? error.message : "Network error");
  }
};

// Utility function to check API status
export const checkWhatsAppStatus = async () => {
  try {
    const response = await fetch("/v1/send-whatsapp", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("WhatsApp status check failed:", error);
    return {
      initialized: false,
      error: error instanceof Error ? error.message : "Status check failed",
    };
  }
};
