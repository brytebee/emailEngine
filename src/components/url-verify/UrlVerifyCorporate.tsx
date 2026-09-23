// components/url-verify/UrlVerifyCorporate.tsx

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
  token?: string;
  url?: string;
  firstName?: string;
  product?: string;
  logoUrl?: string;
  support?: string;
  reset?: boolean;
}

export const UrlVerifyCorporate = ({
  token,
  url,
  firstName,
  product,
  logoUrl,
  support,
  reset,
}: Props) => (
  <Html>
    <Head />
    <Body style={main}>
      <Section style={headerBar}></Section>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src={getEmailLogoUrl(logoUrl, product)}
            width="180"
            height="45"
            alt={product || "Company Logo"}
            style={logo}
          />
        </Section>
        <Section style={banner}>
          <Heading style={bannerHeading}>
            {reset ? "Password Reset" : "Verify Email"}
          </Heading>
        </Section>
        <Section style={contentSection}>
          <Text style={greeting}>Dear {firstName},</Text>
          <Text style={paragraph}>
            {reset
              ? "A password reset has been requested for your account. Please use the button below to set a new password and regain access to your account."
              : "Thanks for signing up! Please use the button below to verify your email address and activate your account."}
          </Text>
          <Section style={buttonContainer}>
            <Link href={url} style={buttonStyle}>
              {reset ? "Reset Your Password" : "Verify Your Email"}
            </Link>
          </Section>
          <Section style={infoBox}>
            <Text style={infoHeading}>Security Information</Text>
            <Text style={infoText}>
              For security purposes, this request will expire in 24 hours.
            </Text>
            <Text style={infoText}>
              If you need to use a {reset ? "reset" : "verification"} token
              instead, please enter the following code:
            </Text>
            <Text style={tokenStyle}>{token}</Text>
          </Section>
          <Text style={paragraph}>
            {support && "Contact "}
            <Link href={`mailto:${support}`} style={link}>
              {support && support}
            </Link>{" "}
            {!support && "Please delete and ignore "}if you did not request this
            {reset ? " password reset." : " email verification."}
          </Text>
        </Section>
        <Section style={footerSection}>
          <Text style={footerText}>
            This is an automated message from {product}. Please do not reply to
            this email.
          </Text>
          <Text style={copyright}>© 2025 {product}. All rights reserved.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default UrlVerifyCorporate;

const main = {
  backgroundColor: "#f7f7f7",
  fontFamily: "'Arial', sans-serif",
  padding: "20px 0",
};

const headerBar = {
  backgroundColor: "#1a5276",
  height: "8px",
  width: "100%",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e0e0e0",
  borderRadius: "4px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  margin: "0 auto",
  maxWidth: "600px",
  padding: "0",
};

const logoContainer = {
  backgroundColor: "#f5f9fc",
  padding: "24px 0",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const banner = {
  backgroundColor: "#1a5276",
  padding: "24px 0",
  textAlign: "center" as const,
};

const bannerHeading = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: 600,
  margin: "0",
};

const contentSection = {
  padding: "32px 48px",
};

const greeting = {
  color: "#333333",
  fontSize: "18px",
  fontWeight: 600,
  lineHeight: "24px",
  margin: "0 0 16px",
};

const paragraph = {
  color: "#555555",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const buttonContainer = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const buttonStyle = {
  backgroundColor: "#1a5276",
  borderRadius: "4px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: 600,
  padding: "12px 28px",
  textAlign: "center" as const,
  textDecoration: "none",
};

const infoBox = {
  backgroundColor: "#f5f9fc",
  border: "1px solid #d0e3f0",
  borderRadius: "4px",
  margin: "24px 0",
  padding: "16px 24px",
};

const infoHeading = {
  color: "#1a5276",
  fontSize: "16px",
  fontWeight: 600,
  margin: "0 0 12px",
};

const infoText = {
  color: "#555555",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 12px",
};

const tokenStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #d0e3f0",
  borderRadius: "4px",
  color: "#1a5276",
  fontFamily: "monospace",
  fontSize: "20px",
  fontWeight: 600,
  letterSpacing: "2px",
  margin: "12px 0",
  padding: "12px",
  textAlign: "center" as const,
};

const link = {
  color: "#1a5276",
  fontWeight: 600,
  textDecoration: "none",
};

const footerSection = {
  backgroundColor: "#f5f9fc",
  borderTop: "1px solid #e0e0e0",
  padding: "24px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#777777",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 8px",
};

const copyright = {
  color: "#999999",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0",
};
