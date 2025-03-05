// components/confirm/ConfirmTech.tsx

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
  Button,
} from "@react-email/components";
import * as React from "react";
import { getEmailLogoUrl } from "@/utils/imageUtils";

interface Props {
  code?: string;
  firstName?: string;
  product?: string;
  logoUrl?: string;
  support?: string;
}

export const TechConfirmEmail = ({
  code,
  firstName,
  product,
  logoUrl,
  support,
}: Props) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={headerBanner}>
          <Img
            src={getEmailLogoUrl(logoUrl, product)}
            width="160"
            height="40"
            alt={product || "Company Logo"}
            style={logo}
          />
        </Section>
        <Section style={contentSection}>
          <Heading style={title}>Verification Code</Heading>
          <Text style={subtitle}>Hey {firstName}! 👋</Text>
          <Text style={paragraph}>
            You're almost there! Enter this verification code in the browser
            window where you started creating your {product} account:
          </Text>
          <Section style={codeContainer}>
            <Text style={codeStyle}>{code}</Text>
          </Section>
          <Text style={infoText}>
            This code will expire in 10 minutes for security reasons.
          </Text>
          <Section style={divider} />
          <Text style={helpText}>Need Help?</Text>
          <Text style={paragraph}>
            {support
              ? "If you have any questions or need assistance, contact our support team:"
              : "If you didn't request this code or need assistance, please contact support."}
          </Text>
          {support && (
            <Button href={`mailto:${support}`} style={supportButton}>
              Contact Support
            </Button>
          )}
        </Section>
        <Section style={footer}>
          <Text style={footerText}>
            Powered by {product} • {new Date().getFullYear()}
          </Text>
          <Text style={footerLinks}>
            <Link href="#" style={footerLink}>
              Privacy Policy
            </Link>{" "}
            •
            <Link href="#" style={footerLink}>
              {" "}
              Terms of Service
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default TechConfirmEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
  padding: "40px 15px",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
  margin: "0 auto",
  maxWidth: "480px",
  overflow: "hidden",
};

const headerBanner = {
  backgroundColor: "#7F56D9",
  padding: "30px 40px",
  textAlign: "center" as const,
};

const logo = {
  margin: "8px auto",
  borderRadius: "50%",
  width: "120px",
  height: "120px",
  objectFit: "cover" as const,
};

const contentSection = {
  padding: "40px",
};

const title = {
  color: "#101828",
  fontSize: "30px",
  fontWeight: "bold",
  lineHeight: "36px",
  margin: "0 0 12px",
  padding: "0",
  textAlign: "center" as const,
};

const subtitle = {
  color: "#667085",
  fontSize: "18px",
  fontWeight: 500,
  lineHeight: "26px",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const paragraph = {
  color: "#475467",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const codeContainer = {
  backgroundColor: "#F9FAFB",
  borderRadius: "8px",
  margin: "24px 0",
  padding: "24px 16px",
  textAlign: "center" as const,
};

const codeStyle = {
  color: "#101828",
  fontFamily:
    "'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace",
  fontSize: "36px",
  fontWeight: 700,
  letterSpacing: "10px",
  lineHeight: "40px",
  margin: "0",
  textAlign: "center" as const,
};

const infoText = {
  color: "#667085",
  fontSize: "14px",
  fontStyle: "italic",
  lineHeight: "20px",
  margin: "0 0 32px",
  textAlign: "center" as const,
};

const divider = {
  borderTop: "1px solid #EAECF0",
  margin: "32px 0",
};

const helpText = {
  color: "#101828",
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: "24px",
  margin: "0 0 16px",
};

const supportButton = {
  backgroundColor: "#F4EBFF",
  borderRadius: "6px",
  color: "#7F56D9",
  display: "block",
  fontSize: "14px",
  fontWeight: 600,
  padding: "12px 20px",
  textAlign: "center" as const,
  textDecoration: "none",
  margin: "24px 0 0",
};

const footer = {
  backgroundColor: "#F9FAFB",
  borderTop: "1px solid #EAECF0",
  padding: "24px 40px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#667085",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 8px",
};

const footerLinks = {
  color: "#667085",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};

const footerLink = {
  color: "#7F56D9",
  textDecoration: "none",
};
