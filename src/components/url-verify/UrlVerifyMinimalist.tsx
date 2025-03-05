// components/url-verify/UrlVerifyMinimalist.tsx

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

export const UrlVerifyMinimalist = ({
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
        <Img
          src={getEmailLogoUrl(logoUrl, product)}
          width="120"
          height="36"
          alt={product || "Company Logo"}
          style={logo}
        />
        <Section style={contentSection}>
          <Text style={greeting}>Hello {firstName},</Text>
          <Heading style={heading}>Password Reset Request</Heading>
          <Text style={paragraph}>
            We received a request to reset your password. Use the button below
            to create a new password.
          </Text>
          <Section style={buttonContainer}>
            <Link href={resetUrl} style={buttonStyle}>
              Reset Password
            </Link>
          </Section>
          <Text style={tokenWrapper}>
            If the button doesn't work, use this token:
            <Section style={tokenContainer}>
              <Text style={tokenStyle}>{resetToken}</Text>
            </Section>
          </Text>
          <Section style={divider}></Section>
          <Text style={footerText}>
            {support ? (
              <>
                If you didn't request this change, please contact us at{" "}
                <Link href={`mailto:${support}`} style={link}>
                  {support}
                </Link>
              </>
            ) : (
              "If you didn't request this change, you can safely ignore this email."
            )}
          </Text>
        </Section>
      </Container>
      <Text style={footer}>{product} • © 2025 All Rights Reserved</Text>
    </Body>
  </Html>
);

export default UrlVerifyMinimalist;

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  padding: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  margin: "0 auto",
  maxWidth: "500px",
  padding: "40px 0",
};

const contentSection = {
  padding: "0 48px",
};

const logo = {
  margin: "0 auto 30px",
  display: "block",
};

const greeting = {
  color: "#666666",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 10px",
};

const heading = {
  color: "#333333",
  fontSize: "24px",
  fontWeight: 500,
  lineHeight: "32px",
  margin: "0 0 20px",
  padding: "0",
};

const paragraph = {
  color: "#666666",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const buttonContainer = {
  margin: "32px 0",
};

const buttonStyle = {
  backgroundColor: "#000000",
  borderRadius: "4px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: 500,
  lineHeight: "1",
  padding: "14px 24px",
  textAlign: "center" as const,
  textDecoration: "none",
};

const tokenWrapper = {
  color: "#666666",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const tokenContainer = {
  backgroundColor: "#f5f5f5",
  borderRadius: "4px",
  margin: "12px 0 0",
  padding: "12px",
};

const tokenStyle = {
  color: "#333333",
  fontFamily: "monospace",
  fontSize: "18px",
  fontWeight: 500,
  letterSpacing: "1px",
  margin: "0",
  textAlign: "center" as const,
};

const divider = {
  borderTop: "1px solid #eeeeee",
  margin: "32px 0",
};

const footerText = {
  color: "#666666",
  fontSize: "14px",
  fontStyle: "italic",
  lineHeight: "24px",
};

const link = {
  color: "#000000",
  fontWeight: 500,
  textDecoration: "underline",
};

const footer = {
  color: "#999999",
  fontSize: "13px",
  lineHeight: "24px",
  margin: "24px 0 0",
  textAlign: "center" as const,
};
