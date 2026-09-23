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

interface SecurityReviewEmailProps {
  message?: string;
  companyName?: string;
  logoUrl?: string;
  actionUrl?: string;
}

export const SecurityReviewEmail = ({
  message = "As part of our security protocols, a review of your account is needed at this time. Please contact our Compliance Office to verify your information and restore full access.",
  companyName = "EmailEngine",
  logoUrl,
  actionUrl = "https://brytebee.com/support",
}: SecurityReviewEmailProps) => {
  return (
    <PremiumEmailLayout
      previewText={`Security Review Required - ${companyName}`}
      companyName={companyName}
      logoUrl={logoUrl}
      showTopBorder={true}
      topBorderColor="#F59E0B" // Amber/Orange accent
    >
      <Section style={mainContent}>
        <Heading style={heading}>Security Review Required</Heading>
        
        {/* Large 3D Exclamation Icon Section */}
        <Section style={iconHero}>
            <div style={iconGlow}>
                <img src="https://img.icons8.com/3d-fluency/94/exclamation-mark.png" width="94" height="94" alt="attention" />
            </div>
        </Section>

        <Text style={paragraph}>
            {message}
        </Text>

        <Section style={buttonContainer}>
            <Button style={button} href={actionUrl}>
                Contact Compliance Office
            </Button>
        </Section>
      </Section>
    </PremiumEmailLayout>
  );
};

export default SecurityReviewEmail;

const mainContent = {
  textAlign: "center" as const,
};

const heading = {
  fontSize: "28px",
  fontWeight: "800",
  lineHeight: "1.3",
  color: "#1E293B",
  margin: "0 0 40px",
  textAlign: "center" as const,
};

const iconHero = {
    padding: "0 0 48px",
    display: "flex",
    justifyContent: "center",
};

const iconGlow = {
    width: "120px",
    height: "120px",
    backgroundColor: "#FEF3C7",
    borderRadius: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    border: "1px solid #FDE68A",
    boxShadow: "0 8px 16px rgba(245, 158, 11, 0.1)",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#475569",
  margin: "0 auto 48px",
  maxWidth: "440px",
};

const buttonContainer = {
    padding: "0 0 20px",
};

const button = {
  backgroundColor: "#1E293B", // Dark navy / Charcoal as per design
  borderRadius: "12px",
  color: "#FFFFFF",
  fontSize: "16px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 40px",
  boxShadow: "0 10px 20px rgba(30, 41, 59, 0.15)",
};
