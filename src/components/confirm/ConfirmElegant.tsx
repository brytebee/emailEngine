// components/confirm/ConfirmElegant.tsx

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
  logoUrl?: string;
  support?: string;
}

export const ElegantConfirmEmail = ({
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
        <Img
          src={getEmailLogoUrl(logoUrl, product)}
          width="150"
          height="40"
          alt={product || "Company Logo"}
          style={logo}
        />
        <Heading style={heading}>One step to go, {firstName}</Heading>
        <Text style={paragraph}>
          Thank you for choosing {product}. To complete your registration and
          ensure your account security, please enter the verification code
          below.
        </Text>
        <Section style={codeSection}>
          <Text style={codeIntro}>Your verification code:</Text>
          <Text style={codeStyle}>{code}</Text>
          <Text style={codeExpiry}>Valid for 15 minutes</Text>
        </Section>
        <Text style={paragraph}>
          If you did not request this verification, please disregard this email.
        </Text>
        <Section style={supportSection}>
          <Text style={supportHeading}>Questions?</Text>
          <Text style={supportText}>
            {support ? (
              <>
                Our team is here to help. Contact us at{" "}
                <Link href={`mailto:${support}`} style={link}>
                  {support}
                </Link>
              </>
            ) : (
              "If you need assistance, please contact our support team."
            )}
          </Text>
        </Section>
        <Section style={footerSection}>
          <Text style={footerText}>Sent with care by {product}</Text>
          <Text style={addressText}>
            123 Innovation Drive • Tech City, TC 10101
          </Text>
          <Text style={unsubscribeText}>
            <Link href="#" style={unsubscribeLink}>
              Preferences
            </Link>{" "}
            •
            <Link href="#" style={unsubscribeLink}>
              {" "}
              Unsubscribe
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ElegantConfirmEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  padding: "40px 20px",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #E5E7EB",
  borderRadius: "16px",
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
  margin: "0 auto",
  maxWidth: "500px",
  padding: "48px",
};

const logo = {
  display: "block",
  margin: "0 auto 32px",
};

const heading = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: 600,
  lineHeight: "32px",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const paragraph = {
  color: "#4B5563",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const codeSection = {
  backgroundColor: "#F9FAFB",
  borderRadius: "12px",
  margin: "32px 0",
  padding: "24px",
  textAlign: "center" as const,
};

const codeIntro = {
  color: "#6B7280",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "20px",
  margin: "0 0 16px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

const codeStyle = {
  color: "#111827",
  fontFamily: "monospace",
  fontSize: "36px",
  fontWeight: 700,
  letterSpacing: "12px",
  lineHeight: "40px",
  margin: "0 0 16px",
};

const codeExpiry = {
  color: "#6B7280",
  fontSize: "14px",
  fontStyle: "italic",
  lineHeight: "20px",
  margin: "0",
};

const supportSection = {
  borderTop: "1px solid #E5E7EB",
  marginTop: "32px",
  paddingTop: "32px",
};

const supportHeading = {
  color: "#111827",
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: "24px",
  margin: "0 0 8px",
};

const supportText = {
  color: "#4B5563",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};

const link = {
  color: "#2563EB",
  fontWeight: 500,
  textDecoration: "none",
};

const footerSection = {
  borderTop: "1px solid #E5E7EB",
  marginTop: "40px",
  paddingTop: "32px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#6B7280",
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "20px",
  margin: "0 0 8px",
};

const addressText = {
  color: "#9CA3AF",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0 0 16px",
};

const unsubscribeText = {
  color: "#9CA3AF",
  fontSize: "12px",
  lineHeight: "18px",
  margin: "0",
};

const unsubscribeLink = {
  color: "#9CA3AF",
  textDecoration: "underline",
};
