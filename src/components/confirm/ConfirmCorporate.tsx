// components/confirm/ConfirmCorporate.tsx

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
  Hr,
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

export const CorporateConfirmEmail = ({
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
            width="180"
            height="45"
            alt={product || "Company Logo"}
            style={logo}
          />
        </Section>
        <Hr style={divider} />
        <Section style={contentSection}>
          <Text style={greeting}>Dear {firstName},</Text>
          <Heading style={heading}>Email Verification Required</Heading>
          <Text style={paragraph}>
            Thank you for registering with {product}. To ensure the security of
            your account, please verify your email address using the
            verification code below.
          </Text>
          <Section style={codeContainer}>
            <Text style={codeStyle}>{code}</Text>
          </Section>
          <Text style={paragraph}>
            This code will expire in 30 minutes. If you did not create an
            account with us, please disregard this message.
          </Text>
          <Hr style={sectionDivider} />
          {support && (
            <Text style={supportText}>
              If you have any questions or need assistance, please contact our
              support team at{" "}
              <Link href={`mailto:${support}`} style={link}>
                {support}
              </Link>
            </Text>
          )}
        </Section>
        <Hr style={divider} />
        <Section style={footerSection}>
          <Text style={footerText}>
            This is an automated message. Please do not reply directly to this
            email.
          </Text>
          <Text style={copyright}>
            © {new Date().getFullYear()} {product}. All Rights Reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default CorporateConfirmEmail;

const main = {
  backgroundColor: "#f5f7fa",
  fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
  padding: "40px 20px",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eaeaea",
  borderRadius: "8px", // Slightly increased border radius
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)", // Enhanced shadow
  margin: "0 auto",
  maxWidth: "600px",
};

const headerSection = {
  backgroundColor: "#ffffff",
  padding: "30px 40px 20px",
};

const contentSection = {
  padding: "20px 40px 30px",
};

const footerSection = {
  backgroundColor: "#f8f9fa",
  borderBottomLeftRadius: "8px", // Matching container border radius
  borderBottomRightRadius: "8px",
  padding: "20px 40px",
};

const logo = {
  display: "block",
};

const divider = {
  borderTop: "1px solid #eaeaea",
  margin: "0",
};

const sectionDivider = {
  borderTop: "1px solid #eaeaea",
  margin: "30px 0",
};

const greeting = {
  color: "#666666",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 10px",
};

const heading = {
  color: "#252525",
  fontSize: "24px",
  fontWeight: "bold",
  lineHeight: "32px",
  margin: "0 0 20px",
  padding: "0",
};

const paragraph = {
  color: "#444444",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 20px",
};

const codeContainer = {
  background: "#f8f9fa",
  border: "1px solid #eaeaea",
  borderRadius: "6px", // Slightly rounded corners
  margin: "25px 0",
  padding: "20px",
  textAlign: "center" as const,
};

const codeStyle = {
  color: "#3a3a3a",
  fontFamily: "Consolas, Monaco, 'Andale Mono', monospace",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "8px",
  lineHeight: "40px",
  margin: "0",
  textAlign: "center" as const,
};

const supportText = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
};

const link = {
  color: "#0066cc",
  textDecoration: "underline", // Adding underline for better link visibility
};

const footerText = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "20px",
  margin: "0 0 8px",
};

const copyright = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "20px",
  margin: "0",
};
