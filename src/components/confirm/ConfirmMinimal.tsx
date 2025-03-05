// components/confirm/ConfirmMinimal.tsx

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
  code?: string;
  firstName?: string;
  product?: string;
  support?: string;
  logoUrl?: string;
}

export const MinimalConfirmEmail = ({
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
        <Section style={headerSection}>
          <Img
            src={getEmailLogoUrl(logoUrl, product)}
            width="120"
            height="120"
            alt={product || "Company Logo"}
            style={logo}
          />
        </Section>

        <Section style={contentSection}>
          <Text style={greeting}>Hello {firstName},</Text>
          <Heading style={secondary}>Verify Your Email</Heading>

          <Text style={paragraph}>
            You're just one step away from completing your registration. Please
            use the verification code below to confirm your email address.
          </Text>

          <Section style={codeContainer}>
            <Text style={codeStyle}>{code}</Text>
          </Section>

          <Text style={disclaimer}>
            This code will expire in 15 minutes for your security.
          </Text>

          <Text style={infoText}>
            {support && "Contact "}
            <Link href={`mailto:${support}`} style={link}>
              {support && support}
            </Link>{" "}
            {!support && "Please delete and ignore "}if you did not request this
            code.
          </Text>
        </Section>

        <Section style={footerSection}>
          <Text style={footer}>
            © {new Date().getFullYear()} {product} • All Rights Reserved
          </Text>
          <Text style={poweredBy}>Secured by {product}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default MinimalConfirmEmail;

const main = {
  backgroundColor: "#f4f4f6",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  lineHeight: "1.6",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e7e7e9",
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  margin: "40px auto",
  maxWidth: "480px",
  overflow: "hidden",
};

const headerSection = {
  backgroundColor: "#f9f9fb",
  borderBottom: "1px solid #e7e7e9",
  padding: "20px",
  textAlign: "center" as const,
};

const contentSection = {
  padding: "40px",
};

const logo = {
  margin: "0 auto",
  display: "block",
};

const greeting = {
  color: "#6b7280",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 12px",
};

const secondary = {
  color: "#111827",
  fontSize: "28px",
  fontWeight: 700,
  lineHeight: "36px",
  margin: "0 0 24px",
  padding: "0",
};

const paragraph = {
  color: "#4b5563",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const codeContainer = {
  background: "#f3f4f6",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  margin: "24px 0",
  padding: "20px",
  textAlign: "center" as const,
};

const codeStyle = {
  color: "#111827",
  fontFamily: "'Courier New', Courier, monospace",
  fontSize: "36px",
  fontWeight: 700,
  letterSpacing: "8px",
  margin: "0",
};

const disclaimer = {
  color: "#6b7280",
  fontSize: "14px",
  fontStyle: "italic",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const infoText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "24px 0 0",
  textAlign: "center" as const,
};

const link = {
  color: "#3b82f6",
  fontWeight: 600,
  textDecoration: "none",
};

const footerSection = {
  backgroundColor: "#f9f9fb",
  borderTop: "1px solid #e7e7e9",
  padding: "20px",
  textAlign: "center" as const,
};

const footer = {
  color: "#6b7280",
  fontSize: "12px",
  margin: "0 0 8px",
};

const poweredBy = {
  color: "#9ca3af",
  fontSize: "10px",
  fontStyle: "italic",
  margin: "0",
};
