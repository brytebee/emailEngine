import {
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

interface ConfirmEmailProps {
  code?: string;
  firstName?: string;
  companyName?: string;
  logoUrl?: string;
}

export const ConfirmEmail = ({
  code = "000 000",
  firstName = "there",
  companyName = "EmailEngine",
  logoUrl,
}: ConfirmEmailProps) => {
  return (
    <PremiumEmailLayout
      previewText={`Your ${companyName} verification code: ${code}`}
      companyName={companyName}
      logoUrl={logoUrl}
    >
      <Section style={mainContent}>
        <Heading style={heading}>Your Security Code</Heading>
        
        {/* The OTP Code Box */}
        <Section style={codeBox}>
          <Text style={codeText}>{code}</Text>
        </Section>

        <Hr style={hr} />

        {/* Security Warning Section */}
        <Section style={securitySection}>
            <div style={iconBox}>
                <img src="https://img.icons8.com/material-outlined/24/94A3B8/security-shield.png" width="24" height="24" alt="shield" />
            </div>
            <Text style={securityText}>
                Do not share this code with anyone.
            </Text>
        </Section>
      </Section>
    </PremiumEmailLayout>
  );
};

export default ConfirmEmail;

const mainContent = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const heading = {
  fontSize: "28px",
  fontWeight: "600",
  lineHeight: "1.3",
  color: "#1E293B",
  margin: "0 0 48px",
};

const codeBox = {
  backgroundColor: "#EEF2FF",
  borderRadius: "24px",
  padding: "40px 20px",
  margin: "0 auto 48px",
  maxWidth: "360px",
  textAlign: "center" as const,
};

const codeText = {
  fontSize: "48px",
  fontWeight: "400",
  letterSpacing: "0.15em",
  color: "#1E293B",
  margin: "0",
  fontFamily: "'Courier New', Courier, monospace",
};

const hr = {
  borderTop: "1px solid #F1F5F9",
  margin: "0 0 32px",
};

const securitySection = {
    textAlign: "center" as const,
};

const iconBox = {
    width: "32px",
    height: "32px",
    margin: "0 auto 12px",
};

const securityText = {
  fontSize: "14px",
  color: "#94A3B8",
  margin: "0",
};
