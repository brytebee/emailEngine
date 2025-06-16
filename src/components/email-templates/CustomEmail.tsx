// components/email-templates/CustomEmail.tsx

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
  firstName?: string;
  product?: string;
  support?: string;
  logoUrl?: string;
  customBody?: string;
  subject?: string;
}

export const CustomEmail = ({
  firstName = "User",
  product = "CORPORATE AFFAIRS COMMISSION",
  logoUrl,
  support,
  customBody,
  subject,
}: Props) => (
  <Html>
    <Head />
    <Body style={main}>
      {/* Header gradient section */}
      <Section style={headerGradient}>
        <Container style={headerContainer}>
          <div style={logoContainer}>
            <Img
              src={getEmailLogoUrl(logoUrl, product)}
              width="80"
              height="80"
              alt={product || "Company Logo"}
              style={logo}
            />
          </div>
          <Text style={brandName}>{product}</Text>
        </Container>
      </Section>

      <Container style={container}>
        {/* Greeting section */}
        <Section style={greetingSection}>
          <Text style={greeting}>Hello, {firstName}! 👋</Text>
        </Section>

        {/* Subject section */}
        {subject && (
          <Section style={subjectSection}>
            <div style={subjectBadge}>
              <Text style={subjectLabel}>OFFICIAL COMMUNICATION</Text>
            </div>
            <Heading style={subjectHeading}>{subject}</Heading>
          </Section>
        )}

        {/* Main content */}
        <Section style={contentContainer}>
          <div style={contentInner}>
            <Text style={paragraph}>
              {customBody ||
                "Thank you for your interest in our services. We're excited to have you on board and look forward to providing you with exceptional service."}
            </Text>
          </div>
        </Section>

        {/* Support section */}
        {support && (
          <Section style={supportSection}>
            <div style={supportCard}>
              <Text style={supportTitle}>Need Help?</Text>
              <Text style={supportText}>
                Our support team is here to assist you. Contact us at{" "}
                <Link href={`mailto:${support}`} style={supportLink}>
                  {support}
                </Link>
              </Text>
            </div>
          </Section>
        )}

        {/* CTA or additional info section */}
        <Section style={ctaSection}>
          <div style={ctaButton}>
            <Link href={"https://www.cac.gov.ng/"}>
              <Text style={ctaText}>Access CAC Portal</Text>
            </Link>
          </div>
        </Section>
      </Container>

      {/* Footer */}
      <Section style={footerSection}>
        <Container style={footerContainer}>
          <Text style={footer}>Securely powered by {product}</Text>
          <Text style={footerSecondary}>
            Federal Republic of Nigeria • Unity and Faith, Peace and Progress
          </Text>
        </Container>
      </Section>
    </Body>
  </Html>
);

export default CustomEmail;

// CAC Official color palette
const colors = {
  primary: "#1e7c3e",
  primaryLight: "#22c55e",
  primaryDark: "#166534",
  secondary: "#f0fdf4",
  accent: "#dc2626",
  gold: "#f59e0b",
  text: "#1f2937",
  textLight: "#6b7280",
  textMuted: "#9ca3af",
  white: "#ffffff",
  border: "#e5e7eb",
  shadow: "rgba(0, 0, 0, 0.1)",
  gradient: "linear-gradient(135deg, #1e7c3e 0%, #166534 100%)",
};

const main = {
  backgroundColor: "#f9fafb",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  margin: "0",
  padding: "0",
};

const headerGradient = {
  background: colors.gradient,
  padding: "40px 20px",
  textAlign: "center" as const,
};

const container = {
  backgroundColor: colors.white,
  borderRadius: "16px",
  boxShadow:
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  marginTop: "-20px",
  maxWidth: "600px",
  margin: "-20px auto 40px auto",
  position: "relative" as const,
  zIndex: 10,
};

const greetingSection = {
  padding: "40px 40px 20px 40px",
};

const greeting = {
  color: colors.text,
  fontSize: "24px",
  fontWeight: "700",
  letterSpacing: "-0.025em",
  lineHeight: "32px",
  margin: "0",
  textAlign: "center" as const,
};

const subjectSection = {
  padding: "0 40px 30px 40px",
  textAlign: "center" as const,
};

const subjectBadge = {
  display: "inline-block",
  backgroundColor: "#dcfce7",
  border: `1px solid ${colors.primaryLight}`,
  borderRadius: "20px",
  padding: "6px 16px",
  marginBottom: "16px",
};

const subjectLabel = {
  color: colors.primary,
  fontSize: "12px",
  fontWeight: "600",
  letterSpacing: "0.05em",
  textTransform: "uppercase" as const,
  margin: "0",
};

const subjectHeading = {
  color: colors.text,
  fontSize: "28px",
  fontWeight: "800",
  letterSpacing: "-0.025em",
  lineHeight: "36px",
  margin: "0",
  textAlign: "center" as const,
};

const contentContainer = {
  margin: "0 40px 40px 40px",
};

const contentInner = {
  backgroundColor: colors.secondary,
  borderRadius: "12px",
  borderLeft: `4px solid ${colors.primary}`,
  padding: "32px",
  position: "relative" as const,
};

const paragraph = {
  color: colors.text,
  fontSize: "16px",
  lineHeight: "28px",
  margin: "0",
  textAlign: "left" as const,
  whiteSpace: "pre-wrap" as const,
};

const supportSection = {
  padding: "0 40px 30px 40px",
};

const supportCard = {
  backgroundColor: "#f0fdf4",
  border: `1px solid #bbf7d0`,
  borderRadius: "12px",
  padding: "24px",
  textAlign: "center" as const,
};

const supportTitle = {
  color: colors.text,
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 8px 0",
};

const supportText = {
  color: colors.textLight,
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};

const supportLink = {
  color: colors.primary,
  textDecoration: "none",
  fontWeight: "600",
};

const ctaSection = {
  padding: "0 40px 40px 40px",
  textAlign: "center" as const,
};

const ctaButton = {
  backgroundColor: colors.primary,
  borderRadius: "8px",
  display: "inline-block",
  padding: "16px 32px",
  transition: "all 0.2s ease",
  cursor: "pointer",
  boxShadow: "0 4px 14px 0 rgba(30, 124, 62, 0.39)",
};

const ctaText = {
  color: colors.white,
  fontSize: "16px",
  fontWeight: "600",
  margin: "0",
  textDecoration: "none",
};

const footerSection = {
  backgroundColor: "#1e7c3e",
  padding: "40px 20px",
};

const footerContainer = {
  maxWidth: "600px",
  margin: "0 auto",
  textAlign: "center" as const,
};

const footer = {
  color: colors.white,
  fontSize: "14px",
  fontWeight: "600",
  letterSpacing: "0.025em",
  margin: "0 0 8px 0",
  textTransform: "uppercase" as const,
};

const footerSecondary = {
  color: "#d1d5db",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "0",
};

// 2. ENHANCED LOGO CONTAINER WITH ANIMATION
const logoContainer = {
  maxWidth: "600px",
  margin: "0 auto",
  marginBottom: "24px",
  position: "relative" as const,
  display: "inline-block",
  // Add subtle glow effect
  filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))",
};

// 3. ENHANCED LOGO WITH HOVER EFFECTS AND BETTER STYLING
const logo = {
  borderRadius: "24px", // Slightly larger radius
  border: `4px solid ${colors.white}`, // Thicker border
  boxShadow: `
    0 16px 40px rgba(0, 0, 0, 0.2),
    0 8px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2)
  `, // Multi-layered shadow
  width: "88px", // Slightly larger
  height: "88px",
  objectFit: "cover" as const,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  // Add subtle animation
  animation: "logoFloat 3s ease-in-out infinite",
};

// 4. ENHANCED BRAND NAME WITH BETTER TYPOGRAPHY
const brandName = {
  color: colors.white,
  fontSize: "18px", // Slightly larger
  fontWeight: "700", // Bolder
  letterSpacing: "2px", // More spacing
  textTransform: "uppercase" as const,
  margin: "0",
  textShadow: `
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.2),
    0 8px 16px rgba(0, 0, 0, 0.1)
  `, // Enhanced shadow
  lineHeight: "1.2",
  // Add subtle text outline for better readability
  WebkitTextStroke: "0.5px rgba(255, 255, 255, 0.1)",
};

// 7. ENHANCED HEADER CONTAINER WITH BETTER SPACING
const headerContainer = {
  maxWidth: "600px",
  margin: "0 auto",
  position: "relative" as const,
  zIndex: 2,
  // Add subtle backdrop filter for modern glass effect
  backdropFilter: "blur(8px)",
  borderRadius: "20px 20px 0 0",
  padding: "20px",
  background: "rgba(255, 255, 255, 0.05)",
};
