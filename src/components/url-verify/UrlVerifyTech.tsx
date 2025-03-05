// components/url-verify/UrlVerifyTech.tsx

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { getEmailLogoUrl } from "@/utils/imageUtils";

interface Props {
  resetToken?: string;
  resetUrl?: string;
  firstName?: string;
  product?: string;
  logoUrl?: string;
  support?: string;
}

export const UrlVerifyTech = ({
  resetToken,
  resetUrl,
  firstName,
  product,
  logoUrl,
  support,
}: Props) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img
            src={getEmailLogoUrl(logoUrl, product)}
            width="160"
            height="40"
            alt={product || "Company Logo"}
            style={logo}
          />
          <Text style={headerTag}>{`<PASSWORD_RESET>`}</Text>
        </Section>

        <Section style={contentSection}>
          <Section style={alertBar}>
            <Text style={alertText}>Security Alert // Action Required</Text>
          </Section>

          <Heading style={heading}>
            <Text style={accent}>{`# `}</Text>Password Reset Request
          </Heading>

          <Section style={infoGrid}>
            <Section style={infoRow}>
              <Text style={infoLabel}>USER:</Text>
              <Text style={infoValue}>{firstName}</Text>
            </Section>
            <Section style={infoRow}>
              <Text style={infoLabel}>TIME:</Text>
              <Text style={infoValue}>{new Date().toISOString()}</Text>
            </Section>
            <Section style={infoRow}>
              <Text style={infoLabel}>STATUS:</Text>
              <Text style={infoValue}>PENDING</Text>
            </Section>
          </Section>

          <Text style={paragraph}>
            A password reset has been initiated for your account. To complete
            this process and create a new secure password, click the button
            below.
          </Text>

          <Section style={codeBlock}>
            <Text style={codeComment}> == // Reset your password securely</Text>
            <Link href={resetUrl} style={resetButton}>
              RESET PASSWORD
            </Link>
            <Text style={codeComment}> == // Token expires in 24 hours</Text>
          </Section>

          <Section style={tokenSection}>
            <Text style={tokenLabel}>TOKEN ACCESS CODE:</Text>
            <Text style={tokenValue}>{resetToken}</Text>
          </Section>

          <Section style={securitySection}>
            <Heading style={securityHeading}>
              <Text style={accent}>{`> `}</Text>Security Notice
            </Heading>
            <Text style={securityText}>
              {support ? (
                <>
                  If you did not request this password reset, please secure your
                  account immediately by contacting our security team at{" "}
                  <Link href={`mailto:${support}`} style={link}>
                    {support}
                  </Link>
                </>
              ) : (
                "If you did not request this password reset, please secure your account immediately."
              )}
            </Text>
          </Section>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            {`/* ${product} Security Systems | ${new Date().getFullYear()} */`}
          </Text>
          <Text style={footerLinks}>
            <Link href="#" style={footerLink}>
              Documentation
            </Link>{" "}
            |
            <Link href="#" style={footerLink}>
              Privacy Policy
            </Link>{" "}
            |
            <Link href="#" style={footerLink}>
              Terms of Service
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default UrlVerifyTech;

// The rest of the styles remain the same as in the original component
const main = {
  backgroundColor: "#0a0e17",
  fontFamily: "'Consolas', 'Source Code Pro', monospace",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#171c26",
  border: "1px solid #304050",
  borderRadius: "8px",
  margin: "0 auto",
  maxWidth: "600px",
  overflow: "hidden",
};

// ... (all other style definitions remain unchanged)

const header = {
  backgroundColor: "#0d1219",
  borderBottom: "1px solid #304050",
  padding: "24px 32px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const logo = {
  margin: "0",
};

const headerTag = {
  color: "#5fb3fc",
  fontSize: "14px",
  fontWeight: 600,
  margin: "0",
};

const contentSection = {
  padding: "32px",
};

const alertBar = {
  backgroundColor: "#fc5a5a1a",
  border: "1px solid #fc5a5a",
  borderRadius: "4px",
  margin: "0 0 32px",
  padding: "10px 16px",
};

const alertText = {
  color: "#fc5a5a",
  fontSize: "14px",
  fontWeight: 600,
  margin: "0",
  textAlign: "center" as const,
};

const heading = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: 700,
  lineHeight: "32px",
  margin: "0 0 24px",
  padding: "0",
};

const accent = {
  color: "#5fb3fc",
};

const infoGrid = {
  backgroundColor: "#0d1219",
  border: "1px solid #304050",
  borderRadius: "4px",
  margin: "0 0 24px",
  padding: "16px",
};

const infoRow = {
  display: "flex",
  margin: "6px 0",
};

const infoLabel = {
  color: "#5fb3fc",
  fontSize: "14px",
  fontWeight: 600,
  margin: "0",
  width: "80px",
};

const infoValue = {
  color: "#e3e8ef",
  fontSize: "14px",
  margin: "0",
};

const paragraph = {
  color: "#c2c8d0",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const codeBlock = {
  backgroundColor: "#0d1219",
  border: "1px solid #304050",
  borderRadius: "4px",
  margin: "0 0 24px",
  padding: "20px",
};

const codeComment = {
  color: "#536f8e",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 12px",
};

const resetButton = {
  backgroundColor: "#5fb3fc",
  border: "none",
  borderRadius: "4px",
  color: "#0d1219",
  display: "block",
  fontSize: "16px",
  fontWeight: 600,
  margin: "16px 0",
  padding: "14px 0",
  textAlign: "center" as const,
  textDecoration: "none",
  width: "100%",
};

const tokenSection = {
  border: "1px dashed #304050",
  borderRadius: "4px",
  margin: "0 0 32px",
  padding: "16px",
  textAlign: "center" as const,
};

const tokenLabel = {
  color: "#5fb3fc",
  fontSize: "13px",
  fontWeight: 600,
  margin: "0 0 8px",
  textTransform: "uppercase" as const,
};

const tokenValue = {
  backgroundColor: "#0d1219",
  border: "1px solid #304050",
  borderRadius: "4px",
  color: "#fc9e5a",
  fontFamily: "'Consolas', 'Source Code Pro', monospace",
  fontSize: "20px",
  fontWeight: 600,
  letterSpacing: "2px",
  margin: "0",
  padding: "12px",
};

const securitySection = {
  backgroundColor: "#0d1219",
  border: "1px solid #304050",
  borderRadius: "4px",
  margin: "0",
  padding: "20px",
};

const securityHeading = {
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: 700,
  lineHeight: "24px",
  margin: "0 0 16px",
  padding: "0",
};

const securityText = {
  color: "#c2c8d0",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};

const link = {
  color: "#5fb3fc",
  fontWeight: 600,
  textDecoration: "none",
};

const footer = {
  backgroundColor: "#0d1219",
  borderTop: "1px solid #304050",
  padding: "24px 32px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#536f8e",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 16px",
};

const footerLinks = {
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0",
};

const footerLink = {
  color: "#5fb3fc",
  display: "inline-block",
  margin: "0 8px",
  textDecoration: "none",
};
