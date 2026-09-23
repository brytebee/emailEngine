import {
  Button,
  Container,
  Heading,
  Hr,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import PremiumEmailLayout from "../email-templates/PremiumEmailLayout";

interface WelcomeEmailProps {
  firstName?: string;
  companyName?: string;
  logoUrl?: string;
  actionUrl?: string;
}

export const ModernNotificationEmail = ({
  firstName = "there",
  companyName = "EmailEngine",
  logoUrl,
  actionUrl = "https://brytebee.com/dashboard",
}: WelcomeEmailProps) => {
  return (
    <PremiumEmailLayout
      previewText={`Welcome to ${companyName}, ${firstName}!`}
      companyName={companyName}
      logoUrl={logoUrl}
    >
      <Section style={mainContent}>
        {/* Hero Background Area */}
        <Section style={heroSection}>
            <Heading style={heading}>Welcome {firstName}!</Heading>
            <Text style={paragraph}>
                We're excited to have you on board! Get started with the platform by following the steps below.
            </Text>
            <Section style={buttonContainer}>
                <Button style={button} href={actionUrl}>
                    Get Started
                </Button>
            </Section>
        </Section>

        {/* Quick Start Grid */}
        <Section style={quickStartSection}>
          <Text style={label}>Quick Start</Text>
          
          {/* Grid Row */}
          <table cellPadding="0" cellSpacing="0" border={0} style={{ width: "100%" }}>
            <tr>
              <td style={gridItem}>
                <Section style={featureCard}>
                  <img src="https://img.icons8.com/material-outlined/48/00D2B4/book.png" width="32" height="32" alt="icon" style={featureIcon} />
                  <Text style={featureTitle}>Learn the Basics</Text>
                  <Text style={featureText}>Get familiar with the essential features.</Text>
                </Section>
              </td>
              <td style={gridItem}>
                <Section style={featureCard}>
                   <img src="https://img.icons8.com/material-outlined/48/00D2B4/rocket.png" width="32" height="32" alt="icon" style={featureIcon} />
                   <Text style={featureTitle}>Set Up Account</Text>
                   <Text style={featureText}>Customize your organization's workspace.</Text>
                </Section>
              </td>
              <td style={gridItem}>
                <Section style={featureCard}>
                   <img src="https://img.icons8.com/material-outlined/48/00D2B4/customer-support.png" width="32" height="32" alt="icon" style={featureIcon} />
                   <Text style={featureTitle}>Get Help & Support</Text>
                   <Text style={featureText}>Reach out to our support team anytime.</Text>
                </Section>
              </td>
            </tr>
          </table>
        </Section>
      </Section>
    </PremiumEmailLayout>
  );
};

export default ModernNotificationEmail;

const mainContent = {
  textAlign: "center" as const,
};

const heroSection = {
  // mesh gradient simulated via background image or style if supported
  background: "linear-gradient(135deg, #F8FAFF 0%, #FFFFFF 100%)",
  padding: "0 0 48px",
};

const heading = {
  fontSize: "36px",
  fontWeight: "800",
  lineHeight: "1.2",
  color: "#1E293B",
  margin: "0 0 16px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#64748B",
  margin: "0 auto 32px",
  maxWidth: "400px",
};

const buttonContainer = {
  margin: "0 0 48px",
};

const button = {
  background: "linear-gradient(135deg, #00D2B4 0%, #0069FF 100%)",
  borderRadius: "12px",
  color: "#FFFFFF",
  fontSize: "18px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 40px",
  boxShadow: "0 10px 20px rgba(0, 105, 255, 0.2)",
};

const quickStartSection = {
  textAlign: "center" as const,
  padding: "40px 0 0",
};

const label = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#94A3B8",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  margin: "0 0 24px",
};

const gridItem = {
    width: "33.33%",
    padding: "0 6px",
    verticalAlign: "top",
};

const featureCard = {
  backgroundColor: "#FFFFFF",
  borderRadius: "16px",
  border: "1px solid #F1F5F9",
  padding: "24px 16px",
  textAlign: "center" as const,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
};

const featureIcon = {
  display: "block",
  margin: "0 auto 16px",
};

const featureTitle = {
  fontSize: "14px",
  fontWeight: "800",
  color: "#1E293B",
  margin: "0 0 8px",
};

const featureText = {
  fontSize: "12px",
  lineHeight: "1.5",
  color: "#94A3B8",
  margin: "0",
};
