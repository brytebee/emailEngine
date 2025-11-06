// components/notification/MinimalNotification.tsx

import {
  Body,
  Button,
  Container,
  Head,
  Hr,
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

export const MinimalNotificationEmail = ({
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
        {/* Logo */}
        <Img
          src={getEmailLogoUrl(logoUrl, product)}
          width="48"
          height="48"
          alt={product}
          style={logo}
        />

        {/* Greeting */}
        <Text style={greeting}>Hello {firstName},</Text>

        {/* Message */}
        <Text style={messageText}>{message}</Text>

        {/* Action Button */}
        {actionUrl && (
          <Section style={buttonSection}>
            <Button style={button} href={actionUrl}>
              {actionText}
            </Button>
          </Section>
        )}

        <Hr style={hr} />

        {/* Footer */}
        <Text style={footer}>{product} • Automated notification</Text>
      </Container>
    </Body>
  </Html>
);

export default MinimalNotificationEmail;

// Styles
const main = {
  backgroundColor: "#ffffff",
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
};

const logo = {
  width: "48px",
  height: "48px",
  borderRadius: "8px",
  marginBottom: "24px",
  objectFit: "cover" as const,
};

const greeting = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#171717",
  margin: "0 0 16px",
  fontWeight: "500",
};

const messageText = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#404040",
  margin: "0 0 24px",
};

const buttonSection = {
  margin: "32px 0",
};

const button = {
  backgroundColor: "#171717",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "500",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 28px",
  border: "none",
};

const hr = {
  borderColor: "#e5e5e5",
  margin: "32px 0",
};

const footer = {
  color: "#737373",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "0",
};
