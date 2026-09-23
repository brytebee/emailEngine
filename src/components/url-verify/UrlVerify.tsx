import {
  Button,
  Container,
  Heading,
  Hr,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import PremiumEmailLayout from "../email-templates/PremiumEmailLayout";

interface UrlVerifyEmailProps {
  token?: string;
  url?: string;
  firstName?: string;
  companyName?: string;
  logoUrl?: string;
  reset?: boolean;
}

export const UrlVerifyEmail = ({
  token,
  url,
  firstName = "there",
  companyName = "EmailEngine",
  logoUrl,
  reset = false,
}: UrlVerifyEmailProps) => {
  const title = reset ? "Reset Your Password" : "Verify Your Email";
  const subtext = reset
    ? "Please confirm your identity to secure your account."
    : "Please confirm your email address to secure your account.";
  const buttonText = reset ? "Reset Password" : "Verify Account";

  return (
    <PremiumEmailLayout
      previewText={`${title} - ${companyName}`}
      companyName={companyName}
      logoUrl={logoUrl}
    >
      <Section style={mainContent}>
        <Heading style={heading}>{title}</Heading>
        <Text style={paragraph}>{subtext}</Text>

        <Section style={buttonContainer}>
          <Button style={button} href={url}>
            {buttonText}
          </Button>
        </Section>

        <Hr style={hr} />

        <Section style={protectionSection}>
          <Text style={protectionLabel}>Account Protection</Text>
          <Section style={protectionGrid}>
            <Section style={protectionCard}>
              <div style={iconBox}>
                  <img src="https://img.icons8.com/material-outlined/24/00D2B4/checked-2.png" width="20" height="20" alt="icon" style={featureIcon} />
              </div>
              <Text style={featureTitle}>Secure Your Data</Text>
              <Text style={featureText}>Keep your information safe.</Text>
            </Section>
            <Section style={protectionCard}>
              <div style={iconBox}>
                  <img src="https://img.icons8.com/material-outlined/24/00D2B4/checked-2.png" width="20" height="20" alt="icon" style={featureIcon} />
              </div>
              <Text style={featureTitle}>Prevent Unauthorized Access</Text>
              <Text style={featureText}>Protect your account from threats.</Text>
            </Section>
          </Section>
        </Section>

        {token && (
          <Text style={tokenSubtext}>
             Or use this verification code: <br/>
             <strong style={tokenCode}>{token}</strong>
          </Text>
        )}
      </Section>
    </PremiumEmailLayout>
  );
};

export default UrlVerifyEmail;

const mainContent = {
  textAlign: "center" as const,
};

const heading = {
  fontSize: "32px",
  fontWeight: "800",
  lineHeight: "1.2",
  color: "#1E293B",
  margin: "0 0 16px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#64748B",
  margin: "0 0 40px",
};

const buttonContainer = {
  margin: "0 0 48px",
};

const button = {
  background: "linear-gradient(135deg, #00D2B4 0%, #0069FF 100%)",
  borderRadius: "100px",
  color: "#FFFFFF",
  fontSize: "18px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "18px 48px",
  boxShadow: "0 10px 20px rgba(0, 105, 255, 0.2)",
};

const hr = {
  borderTop: "1px solid #E2E8F0",
  margin: "0 0 40px",
};

const protectionSection = {
  textAlign: "center" as const,
};

const protectionLabel = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#94A3B8",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 24px",
  backgroundColor: "#FFFFFF",
  display: "inline-block",
  padding: "0 16px",
  position: "relative" as const,
  zIndex: 1,
};

const protectionGrid = {
  display: "flex",
  gap: "12px",
  justifyContent: "center",
};

const protectionCard = {
  width: "48%",
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  border: "1px solid #F1F5F9",
  padding: "24px 16px",
  textAlign: "center" as const,
  display: "inline-block",
  margin: "0 6px",
};

const iconBox = {
  width: "32px",
  height: "32px",
  backgroundColor: "#F0FDFA",
  borderRadius: "8px",
  margin: "0 auto 12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #CCFBF1",
};

const featureIcon = {
  display: "block",
  margin: "6px auto",
};

const featureTitle = {
  fontSize: "14px",
  fontWeight: "700",
  color: "#1E293B",
  margin: "0 0 4px",
};

const featureText = {
  fontSize: "12px",
  color: "#94A3B8",
  margin: "0",
};

const tokenSubtext = {
  fontSize: "14px",
  color: "#94A3B8",
  margin: "40px 0 0",
};

const tokenCode = {
  color: "#0069FF",
  fontSize: "24px",
  letterSpacing: "0.1em",
};
