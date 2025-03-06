// components/preview/EmailPreview.tsx
import React from "react";
import { getEmailLogoUrl } from "@/utils/imageUtils";

// This component will render a browser-compatible preview of the email templates
interface EmailPreviewProps {
  code?: string;
  firstName?: string;
  product?: string;
  support?: string;
  logoUrl?: string;
  imageUrl?: string;
  verifyUrl?: string;
  templateType: "confirmation" | "url";
  style:
    | "default"
    | "corporate"
    | "elegant"
    | "minimal"
    | "tech"
    | "creative"
    | "minimalist";
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  code,
  firstName,
  product,
  support = "support@example.com",
  logoUrl,
  verifyUrl,
  templateType,
  style,
}) => {
  // Common styles
  const commonStyles = {
    main: {
      backgroundColor: "#ffffff",
      fontFamily: "HelveticaNeue, Helvetica, Arial, sans-serif",
      marginTop: "30px",
    },
    container: {
      backgroundColor: "#ffffff",
      border: "1px solid #eee",
      borderRadius: "15px",
      boxShadow: "0 5px 10px rgba(20,50,70,.2)",
      marginTop: "20px",
      maxWidth: "100%",
      width: "360px",
      margin: "0 auto",
      padding: "36px 0 40px",
    },
    logo: {
      margin: "30px auto",
      borderRadius: "50%",
      width: "120px",
      height: "120px",
      objectFit: "cover" as const,
      display: "block",
    },
    heading: {
      color: "#000",
      display: "block",
      fontFamily: "HelveticaNeue-Medium, Helvetica, Arial, sans-serif",
      fontSize: "18px",
      fontWeight: 500,
      lineHeight: "24px",
      marginBottom: "12px",
      marginTop: "0",
      textAlign: "center" as const,
      padding: "0 30px",
    },
    paragraph: {
      color: "#444",
      fontSize: "15px",
      fontFamily: "HelveticaNeue, Helvetica, Arial, sans-serif",
      lineHeight: "23px",
      padding: "0 40px",
      margin: "0 0 20px 0",
      textAlign: "center" as const,
    },
    link: {
      color: "#444",
      textDecoration: "underline",
    },
    button: {
      backgroundColor: "#0a85ea",
      borderRadius: "4px",
      color: "#ffffff",
      display: "inline-block",
      fontFamily: "HelveticaNeue, Helvetica, Arial, sans-serif",
      fontSize: "15px",
      fontWeight: 600,
      lineHeight: "50px",
      textAlign: "center" as const,
      textDecoration: "none",
      width: "200px",
      margin: "0 auto 16px",
    },
    footer: {
      color: "#000",
      fontSize: "12px",
      fontWeight: 800,
      lineHeight: "23px",
      margin: "20px 0 0 0",
      fontFamily: "HelveticaNeue, Helvetica, Arial, sans-serif",
      textAlign: "center" as const,
      textTransform: "uppercase" as const,
    },
  };

  // Template-specific styles and components
  const renderTemplate = () => {
    if (templateType === "confirmation") {
      // Confirmation code templates
      switch (style) {
        case "corporate":
          return (
            <div style={{ ...commonStyles.main }}>
              <div
                style={{
                  ...commonStyles.container,
                  border: "1px solid #ddd",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={getEmailLogoUrl(logoUrl, product)}
                  width="120"
                  height="120"
                  alt={product || "Company Logo"}
                  style={{ ...commonStyles.logo, borderRadius: "8px" }}
                />
                <p
                  style={{
                    ...commonStyles.paragraph,
                    fontWeight: 600,
                    fontSize: "16px",
                  }}
                >
                  Dear {firstName},
                </p>
                <h2
                  style={{
                    ...commonStyles.heading,
                    color: "#333",
                    fontSize: "20px",
                    fontWeight: 600,
                  }}
                >
                  Verification Required
                </h2>
                <p style={{ ...commonStyles.paragraph }}>
                  Please use the following verification code to complete your
                  account setup:
                </p>
                <div
                  style={{
                    background: "#f5f5f5",
                    padding: "15px",
                    margin: "0 40px 20px",
                    borderRadius: "4px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "28px",
                      letterSpacing: "6px",
                      margin: 0,
                      textAlign: "center",
                      fontWeight: 700,
                    }}
                  >
                    {code}
                  </p>
                </div>
                <p
                  style={{
                    ...commonStyles.paragraph,
                    fontSize: "13px",
                    color: "#666",
                  }}
                >
                  If you did not request this code, please contact {support}{" "}
                  immediately.
                </p>
              </div>
              <p
                style={{
                  ...commonStyles.footer,
                  textTransform: "none",
                  color: "#666",
                }}
              >
                © {new Date().getFullYear()} {product} | All Rights Reserved
              </p>
            </div>
          );

        case "elegant":
          return (
            <div style={{ ...commonStyles.main, backgroundColor: "#fafafa" }}>
              <div
                style={{
                  ...commonStyles.container,
                  border: "none",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                  background: "linear-gradient(to bottom, #ffffff, #f9f9f9)",
                }}
              >
                <img
                  src={getEmailLogoUrl(logoUrl, product)}
                  width="100"
                  height="100"
                  alt={product || "Company Logo"}
                  style={{ ...commonStyles.logo, borderRadius: "8px" }}
                />
                <p
                  style={{
                    ...commonStyles.paragraph,
                    fontWeight: 300,
                    fontSize: "16px",
                    color: "#888",
                  }}
                >
                  Hello, {firstName}
                </p>
                <h2
                  style={{
                    ...commonStyles.heading,
                    color: "#333",
                    fontSize: "24px",
                    fontWeight: 300,
                    marginBottom: "20px",
                  }}
                >
                  Verify Your Account
                </h2>
                <div
                  style={{
                    background: "#ffffff",
                    padding: "20px",
                    margin: "0 40px 30px",
                    borderRadius: "6px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    border: "1px solid #eee",
                  }}
                >
                  <p
                    style={{
                      fontSize: "32px",
                      letterSpacing: "8px",
                      margin: 0,
                      textAlign: "center",
                      fontWeight: 300,
                      color: "#333",
                    }}
                  >
                    {code}
                  </p>
                </div>
                <p
                  style={{
                    ...commonStyles.paragraph,
                    fontSize: "14px",
                    color: "#999",
                    fontStyle: "italic",
                  }}
                >
                  For your security, this code will expire in 15 minutes.
                </p>
              </div>
              <p
                style={{
                  ...commonStyles.footer,
                  fontWeight: 300,
                  color: "#999",
                }}
              >
                {product}
              </p>
            </div>
          );

        case "minimal":
          return (
            <div style={{ ...commonStyles.main, backgroundColor: "#ffffff" }}>
              <div
                style={{
                  ...commonStyles.container,
                  border: "1px solid #f0f0f0",
                  boxShadow: "none",
                  padding: "30px 0",
                }}
              >
                <h2
                  style={{
                    ...commonStyles.heading,
                    fontSize: "18px",
                    marginTop: "20px",
                    fontWeight: 400,
                    color: "#000",
                  }}
                >
                  Verification Code
                </h2>
                <div
                  style={{
                    padding: "15px",
                    margin: "20px 40px",
                    borderRadius: "4px",
                    border: "1px solid #eee",
                  }}
                >
                  <p
                    style={{
                      fontSize: "30px",
                      margin: 0,
                      textAlign: "center",
                      fontWeight: 500,
                      letterSpacing: "4px",
                      color: "#000",
                    }}
                  >
                    {code}
                  </p>
                </div>
                <p
                  style={{
                    ...commonStyles.paragraph,
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  Hello {firstName}, please use this code to verify your
                  account.
                </p>
              </div>
              <p
                style={{
                  ...commonStyles.footer,
                  fontWeight: 400,
                  fontSize: "11px",
                  color: "#aaa",
                  textTransform: "none",
                }}
              >
                {product}
              </p>
            </div>
          );

        case "tech":
          return (
            <div style={{ ...commonStyles.main, backgroundColor: "#f5f7fa" }}>
              <div
                style={{
                  ...commonStyles.container,
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  background: "#ffffff",
                }}
              >
                <div
                  style={{
                    background: "#0a85ea",
                    height: "8px",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                    marginTop: "-36px",
                  }}
                ></div>
                <img
                  src={getEmailLogoUrl(logoUrl, product)}
                  width="80"
                  height="80"
                  alt={product || "Company Logo"}
                  style={{
                    ...commonStyles.logo,
                    marginTop: "40px",
                    borderRadius: "12px",
                  }}
                />
                <p
                  style={{
                    ...commonStyles.paragraph,
                    color: "#0a85ea",
                    fontWeight: 600,
                    fontSize: "14px",
                    textTransform: "uppercase" as const,
                  }}
                >
                  Account Verification
                </p>
                <h2
                  style={{
                    ...commonStyles.heading,
                    fontSize: "22px",
                    fontWeight: 600,
                    marginBottom: "24px",
                  }}
                >
                  Your verification code
                </h2>
                <div
                  style={{
                    background: "linear-gradient(to right, #0a85ea, #0fbdea)",
                    padding: "20px",
                    margin: "0 40px 24px",
                    borderRadius: "8px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "32px",
                      margin: 0,
                      textAlign: "center",
                      fontWeight: 700,
                      letterSpacing: "6px",
                      color: "#ffffff",
                    }}
                  >
                    {code}
                  </p>
                </div>
                <p
                  style={{
                    ...commonStyles.paragraph,
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  This code will expire in 10 minutes for security reasons.
                </p>
              </div>
              <p
                style={{
                  ...commonStyles.footer,
                  fontWeight: 600,
                  fontSize: "12px",
                  color: "#0a85ea",
                }}
              >
                {product}
              </p>
            </div>
          );

        default: // default style
          return (
            <div style={{ ...commonStyles.main }}>
              <div style={commonStyles.container}>
                <img
                  src={getEmailLogoUrl(logoUrl, product)}
                  width="120"
                  height="120"
                  alt={product || "Company Logo"}
                  style={commonStyles.logo}
                />
                <p
                  style={{
                    ...commonStyles.paragraph,
                    textAlign: "left",
                    paddingLeft: "40px",
                    fontWeight: 700,
                  }}
                >
                  Hi, {firstName}
                </p>
                <p
                  style={{
                    color: "#0a85ea",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0",
                    lineHeight: "16px",
                    margin: "16px 8px 8px 8px",
                    textTransform: "uppercase" as const,
                    textAlign: "center" as const,
                  }}
                >
                  Verify Your Identity
                </p>
                <h2 style={commonStyles.heading}>
                  Enter the following code to complete your account creation.
                </h2>
                <div
                  style={{
                    background: "rgba(0,0,0,.05)",
                    borderRadius: "4px",
                    margin: "16px auto 14px",
                    verticalAlign: "middle",
                    width: "280px",
                    padding: "8px 0",
                  }}
                >
                  <p
                    style={{
                      color: "#000",
                      fontSize: "32px",
                      fontWeight: 700,
                      letterSpacing: "6px",
                      lineHeight: "40px",
                      margin: 0,
                      textAlign: "center" as const,
                    }}
                  >
                    {code}
                  </p>
                </div>
                <p style={commonStyles.paragraph}>Not expecting this email?</p>
                <p style={commonStyles.paragraph}>
                  Contact{" "}
                  <a href={`mailto:${support}`} style={commonStyles.link}>
                    {support}
                  </a>{" "}
                  if you did not request this code.
                </p>
              </div>
              <p style={commonStyles.footer}>Securely powered by {product}.</p>
            </div>
          );
      }
    } else {
      // URL verification templates
      switch (style) {
        case "corporate":
          return (
            <div style={{ ...commonStyles.main }}>
              <div
                style={{
                  ...commonStyles.container,
                  border: "1px solid #ddd",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={getEmailLogoUrl(logoUrl, product)}
                  width="120"
                  height="120"
                  alt={product || "Company Logo"}
                  style={{ ...commonStyles.logo, borderRadius: "8px" }}
                />
                <p
                  style={{
                    ...commonStyles.paragraph,
                    fontWeight: 600,
                    fontSize: "16px",
                  }}
                >
                  Dear {firstName},
                </p>
                <h2
                  style={{
                    ...commonStyles.heading,
                    color: "#333",
                    fontSize: "20px",
                    fontWeight: 600,
                  }}
                >
                  Verify Your Account
                </h2>
                <p style={{ ...commonStyles.paragraph }}>
                  Thank you for creating an account with us. Please click the
                  button below to verify your email address.
                </p>
                <div style={{ textAlign: "center", margin: "30px 0" }}>
                  <a
                    href={verifyUrl}
                    style={{
                      ...commonStyles.button,
                      backgroundColor: "#2c3e50",
                      borderRadius: "4px",
                    }}
                  >
                    Verify Email
                  </a>
                </div>
                <p
                  style={{
                    ...commonStyles.paragraph,
                    fontSize: "13px",
                    color: "#666",
                  }}
                >
                  If you did not create an account, please contact {support}{" "}
                  immediately.
                </p>
              </div>
              <p
                style={{
                  ...commonStyles.footer,
                  textTransform: "none",
                  color: "#666",
                }}
              >
                © {new Date().getFullYear()} {product} | All Rights Reserved
              </p>
            </div>
          );

        case "creative":
          return (
            <div style={{ ...commonStyles.main, backgroundColor: "#f5f9ff" }}>
              <div
                style={{
                  ...commonStyles.container,
                  border: "none",
                  boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  background: "linear-gradient(135deg, #ffffff, #f0f7ff)",
                  borderRadius: "20px",
                }}
              >
                <img
                  src={getEmailLogoUrl(logoUrl, product)}
                  width="100"
                  height="100"
                  alt={product || "Company Logo"}
                  style={{ ...commonStyles.logo, borderRadius: "20px" }}
                />
                <div
                  style={{
                    background: "linear-gradient(135deg, #6e8efb, #a777e3)",
                    padding: "3px",
                    margin: "0 auto 30px",
                    width: "60%",
                    borderRadius: "50px",
                  }}
                ></div>
                <h2
                  style={{
                    ...commonStyles.heading,
                    color: "#4a4a4a",
                    fontSize: "28px",
                    fontWeight: 700,
                    marginBottom: "20px",
                  }}
                >
                  Hey {firstName}!
                </h2>
                <p
                  style={{
                    ...commonStyles.paragraph,
                    color: "#666",
                    fontSize: "16px",
                  }}
                >
                  Your account is almost ready. Just one quick step to verify
                  your email.
                </p>
                <div style={{ textAlign: "center", margin: "30px 0" }}>
                  <a
                    href={verifyUrl}
                    style={{
                      ...commonStyles.button,
                      background: "linear-gradient(to right, #6e8efb, #a777e3)",
                      borderRadius: "50px",
                      boxShadow: "0 5px 15px rgba(110, 142, 251, 0.4)",
                      padding: "0 30px",
                      fontWeight: 700,
                      fontSize: "16px",
                    }}
                  >
                    Let's Go!
                  </a>
                </div>
                <div
                  style={{
                    background: "linear-gradient(135deg, #6e8efb, #a777e3)",
                    padding: "3px",
                    margin: "30px auto 0",
                    width: "60%",
                    borderRadius: "50px",
                  }}
                ></div>
              </div>
              <p
                style={{
                  ...commonStyles.footer,
                  fontWeight: 600,
                  color: "#a777e3",
                }}
              >
                {product}
              </p>
            </div>
          );

        case "minimalist":
          return (
            <div style={{ ...commonStyles.main, backgroundColor: "#ffffff" }}>
              <div
                style={{
                  ...commonStyles.container,
                  border: "1px solid #f0f0f0",
                  boxShadow: "none",
                  padding: "40px 0",
                }}
              >
                <h2
                  style={{
                    ...commonStyles.heading,
                    fontSize: "18px",
                    marginTop: "10px",
                    fontWeight: 400,
                    color: "#000",
                  }}
                >
                  Verify your email
                </h2>
                <p
                  style={{
                    ...commonStyles.paragraph,
                    fontSize: "14px",
                    color: "#666",
                    margin: "30px 40px",
                  }}
                >
                  Hello {firstName}, please verify your email address to
                  complete your account setup.
                </p>
                <div style={{ textAlign: "center", margin: "30px 0" }}>
                  <a
                    href={verifyUrl}
                    style={{
                      ...commonStyles.button,
                      backgroundColor: "#000000",
                      borderRadius: "0",
                      fontWeight: 400,
                      fontSize: "14px",
                      textTransform: "uppercase" as const,
                      letterSpacing: "1px",
                    }}
                  >
                    Verify
                  </a>
                </div>
              </div>
              <p
                style={{
                  ...commonStyles.footer,
                  fontWeight: 400,
                  fontSize: "11px",
                  color: "#aaa",
                  textTransform: "none",
                }}
              >
                {product}
              </p>
            </div>
          );

        case "tech":
          return (
            <div style={{ ...commonStyles.main, backgroundColor: "#f5f7fa" }}>
              <div
                style={{
                  ...commonStyles.container,
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  background: "#ffffff",
                }}
              >
                <div
                  style={{
                    background: "#0a85ea",
                    height: "8px",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                    marginTop: "-36px",
                  }}
                ></div>
                <img
                  src={getEmailLogoUrl(logoUrl, product)}
                  width="80"
                  height="80"
                  alt={product || "Company Logo"}
                  style={{
                    ...commonStyles.logo,
                    marginTop: "40px",
                    borderRadius: "12px",
                  }}
                />
                <h2
                  style={{
                    ...commonStyles.heading,
                    fontSize: "24px",
                    fontWeight: 600,
                    marginBottom: "16px",
                  }}
                >
                  Complete Your Setup
                </h2>
                <p
                  style={{
                    ...commonStyles.paragraph,
                    fontSize: "15px",
                    color: "#555",
                  }}
                >
                  Hi {firstName}, you're just one click away from getting
                  started.
                </p>
                <div style={{ textAlign: "center", margin: "30px 0" }}>
                  <a
                    href={verifyUrl}
                    style={{
                      ...commonStyles.button,
                      background: "linear-gradient(to right, #0a85ea, #0fbdea)",
                      borderRadius: "6px",
                      boxShadow: "0 4px 10px rgba(10, 133, 234, 0.3)",
                      fontWeight: 600,
                    }}
                  >
                    Activate Account
                  </a>
                </div>
                <p
                  style={{
                    ...commonStyles.paragraph,
                    fontSize: "13px",
                    color: "#888",
                    fontStyle: "italic",
                  }}
                >
                  This link will expire in 24 hours for security reasons.
                </p>
              </div>
              <p
                style={{
                  ...commonStyles.footer,
                  fontWeight: 600,
                  fontSize: "12px",
                  color: "#0a85ea",
                }}
              >
                Powered by {product}
              </p>
            </div>
          );

        default: // default
          return (
            <div style={{ ...commonStyles.main }}>
              <div style={commonStyles.container}>
                <img
                  src={getEmailLogoUrl(logoUrl, product)}
                  width="120"
                  height="120"
                  alt={product || "Company Logo"}
                  style={commonStyles.logo}
                />
                <h2 style={commonStyles.heading}>Verify Your Email Address</h2>
                <p style={commonStyles.paragraph}>
                  Thanks for signing up! Please verify your email address by
                  clicking the button below.
                </p>
                <div style={{ textAlign: "center", margin: "30px 0" }}>
                  <a href={verifyUrl} style={commonStyles.button}>
                    Verify Email
                  </a>
                </div>
                <p style={commonStyles.paragraph}>
                  If you didn't create an account with {product}, you can safely
                  ignore this email.
                </p>
              </div>
              <p style={commonStyles.footer}>Securely powered by {product}.</p>
            </div>
          );
      }
    }
  };

  return (
    <div style={{ maxWidth: "100%", overflow: "auto" }}>{renderTemplate()}</div>
  );
};

export default EmailPreview;
