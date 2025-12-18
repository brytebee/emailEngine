// components/url-verify/UrlVerifyCreative.tsx

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

export const UrlVerifyCreative = ({
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
      <Container style={container}>
        <Section style={topAccent}></Section>
        <Section style={logoContainer}>
          <Img
            src={getEmailLogoUrl(logoUrl, product)}
            width="180"
            height="45"
            alt={product || "Company Logo"}
            style={logo}
          />
        </Section>
        <Section style={heroSection}>
          <Heading style={heroHeading}>
            {reset ? "Reset Your Password" : "Verify Your Email"}
          </Heading>
          <Text style={heroText}>
            {reset
              ? "Let's get you back in action"
              : "Let's verify your account"}
            , {firstName}!
          </Text>
        </Section>
        <Section style={contentSection}>
          <Text style={paragraph}>
            {reset
              ? "We received a request to reset your password. No worries — it happens to the best of us! Just click the button below to create a new password."
              : "We're excited to have you on board! Please click the button below to verify your email address."}
          </Text>
          <Section style={buttonWrapper}>
            <Link href={url} style={buttonStyle}>
              {reset ? "Create New Password" : "Verify Email"}
            </Link>
          </Section>
          <Section style={tokenSection}>
            <Text style={tokenHeading}>
              <Img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgMThDMTQuNDE4MyAxOCAxOCAxNC40MTgzIDE4IDEwQzE4IDUuNTgxNzIgMTQuNDE4MyAyIDEwIDJDNS41ODE3MiAyIDIgNS41ODE3MiAyIDEwQzIgMTQuNDE4MyA1LjU4MTcyIDE4IDEwIDE4WiIgc3Ryb2tlPSIjOEE2M0Q2IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTEwIDEwVjYiIHN0cm9rZT0iIzhBNjNENiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9K0xMCAxM0gxMC4wMSIgc3Ryb2tlPSIjOEE2M0Q2IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+"
                width="20"
                height="20"
                style={{ verticalAlign: "middle", marginRight: "8px" }}
              />
              Alternatively, use this token
            </Text>
            <Section style={tokenContainer}>
              <Text style={tokenStyle}>{token}</Text>
            </Section>
          </Section>
          <Section style={divider}></Section>
          <Text style={noteText}>
            If you didn&apos;t request this {reset ? "reset" : "verification"},
            you can safely ignore this email
            {support && (
              <>
                {" "}
                or contact{" "}
                <Link href={`mailto:${support}`} style={link}>
                  our support team
                </Link>
              </>
            )}
            {!support && " and take no further action"}.
          </Text>
        </Section>
        <Section style={footer}>
          <Text style={footerText}>Crafted with ♥ by the {product} team</Text>
          <Text style={copyright}>© 2025 {product}. All rights reserved.</Text>
          <Text style={footerLinks}>
            <Link href="#" style={footerLink}>
              Help
            </Link>{" "}
            •
            <Link href="#" style={footerLink}>
              Privacy
            </Link>{" "}
            •
            <Link href="#" style={footerLink}>
              Terms
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default UrlVerifyCreative;

const main = {
  backgroundColor: "#f9f5ff",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  boxShadow: "0 4px 24px rgba(138, 99, 214, 0.12)",
  margin: "0 auto",
  maxWidth: "520px",
  overflow: "hidden",
  position: "relative" as const,
};

const topAccent = {
  backgroundColor: "#8a63d6",
  height: "6px",
  width: "100%",
};

const logoContainer = {
  backgroundColor: "#f9f5ff",
  padding: "24px 0",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const heroSection = {
  backgroundColor: "#f9f5ff",
  margin: "0 32px 24px",
  padding: "32px 24px",
  borderRadius: "12px",
  textAlign: "center" as const,
};

const heroHeading = {
  color: "#8a63d6",
  fontSize: "30px",
  fontWeight: 700,
  lineHeight: "36px",
  margin: "0 0 8px",
};

const heroText = {
  color: "#666666",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0",
};

const contentSection = {
  padding: "0 32px 32px",
};

const paragraph = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const buttonWrapper = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const buttonStyle = {
  backgroundColor: "#8a63d6",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: 600,
  padding: "14px 32px",
  textAlign: "center" as const,
  textDecoration: "none",
  boxShadow: "0 4px 12px rgba(138, 99, 214, 0.24)",
};

const tokenSection = {
  backgroundColor: "#f9f5ff",
  borderRadius: "12px",
  margin: "24px 0",
  padding: "20px",
  borderLeft: "4px solid #8a63d6",
};

const tokenHeading = {
  color: "#8a63d6",
  fontSize: "15px",
  fontWeight: 600,
  lineHeight: "20px",
  margin: "0 0 12px",
};

const tokenContainer = {
  background: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(138, 99, 214, 0.12)",
  margin: "12px 0 0",
  padding: "12px",
};

const tokenStyle = {
  color: "#4a4a4a",
  fontFamily: "'Courier New', monospace",
  fontSize: "20px",
  fontWeight: 600,
  letterSpacing: "2px",
  margin: "0",
  textAlign: "center" as const,
};

const divider = {
  borderTop: "1px dashed #e0e0e0",
  margin: "32px 0 24px",
};

const noteText = {
  color: "#8c8c8c",
  fontSize: "14px",
  fontStyle: "italic",
  lineHeight: "21px",
};

const link = {
  color: "#8a63d6",
  fontWeight: 600,
  textDecoration: "none",
};

const footer = {
  backgroundColor: "#f9f5ff",
  borderTop: "1px solid #f0e6ff",
  padding: "24px 32px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#8c8c8c",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 12px",
};

const copyright = {
  color: "#999999",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 8px",
};

const footerLinks = {
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};

const footerLink = {
  color: "#8a63d6",
  display: "inline-block",
  margin: "0 8px",
  textDecoration: "none",
};
