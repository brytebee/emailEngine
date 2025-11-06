// components/notification/ModernNotification.tsx

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { getEmailLogoUrl } from "@/utils/imageUtils";

interface Props {
  message?: string;
  firstName?: string;
  product?: string;
  logoUrl?: string;
  actionUrl?: string;
  actionText?: string;
}

export const ModernNotificationEmail = ({
  message = "You have a new notification",
  firstName = "there",
  product = "Our App",
  logoUrl,
  actionUrl,
  actionText = "View Details",
}: Props) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        {/* Logo Section */}
        <Section style={logoSection}>
          <Img
            src={getEmailLogoUrl(logoUrl, product)}
            width="60"
            height="60"
            alt={product}
            style={logo}
          />
        </Section>

        {/* Content Section */}
        <Section style={content}>
          <Heading style={heading}>Hi {firstName}! 👋</Heading>

          <Section style={messageCard}>
            <Text style={messageText}>{message}</Text>
          </Section>

          {actionUrl && (
            <Section style={buttonContainer}>
              <Button style={button} href={actionUrl}>
                {actionText}
              </Button>
            </Section>
          )}
        </Section>

        {/* Footer */}
        <Text style={footer}>
          © {new Date().getFullYear()} {product}. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ModernNotificationEmail;

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "600px",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
};

const logoSection = {
  padding: "40px 40px 0",
  textAlign: "center" as const,
};

const logo = {
  width: "60px",
  height: "60px",
  borderRadius: "12px",
  objectFit: "cover" as const,
};

const content = {
  padding: "0 40px 40px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#1f2937",
  margin: "30px 0 20px",
  textAlign: "center" as const,
};

const messageCard = {
  backgroundColor: "#f9fafb",
  borderLeft: "4px solid #3b82f6",
  borderRadius: "8px",
  padding: "24px",
  margin: "20px 0",
};

const messageText = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#374151",
  margin: "0",
  fontWeight: "500",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0 20px",
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
  border: "none",
  cursor: "pointer",
};

const footer = {
  color: "#6b7280",
  fontSize: "12px",
  textAlign: "center" as const,
  margin: "30px 0 0",
  padding: "0 40px 30px",
};
