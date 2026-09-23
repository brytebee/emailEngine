import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Font,
} from "@react-email/components";
import * as React from "react";

interface PremiumEmailLayoutProps {
  previewText?: string;
  companyName: string;
  logoUrl?: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
  showHeaderLine?: boolean;
  headerLineColor?: string;
  showTopBorder?: boolean;
  topBorderColor?: string;
}

export const PremiumEmailLayout = ({
  previewText = "Notification from EmailEngine",
  companyName = "EmailEngine",
  logoUrl,
  children,
  footerContent,
  showHeaderLine = false,
  headerLineColor = "#E2E8F0",
  showTopBorder = false,
  topBorderColor = "#4F46E5",
}: PremiumEmailLayoutProps) => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        {showTopBorder && (
          <Section style={{ ...topBorder, backgroundColor: topBorderColor }} />
        )}
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            {logoUrl ? (
              <Img
                src={logoUrl}
                width="40"
                height="40"
                alt={companyName}
                style={logo}
              />
            ) : (
              <Text style={companyLogoText}>{companyName}</Text>
            )}
          </Section>

          {showHeaderLine && <Hr style={{ ...hr, borderColor: headerLineColor }} />}

          {/* Main Content Area */}
          <Section style={content}>
            {children}
          </Section>

          {/* Footer Area */}
          <Section style={footer}>
            {footerContent ? (
              footerContent
            ) : (
              <>
                <Text style={footerText}>
                  &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
                </Text>
                <Text style={footerSubtext}>
                  Sent securely via <Link href="https://brytebee.com" style={link}>EmailEngine Platform</Link>.
                </Text>
              </>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PremiumEmailLayout;

const main = {
  backgroundColor: "#F8FAF8", // Very slight grey background
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  padding: "40px 0",
};

const topBorder = {
  height: "4px",
  width: "100%",
  position: "fixed" as const,
  top: 0,
  left: 0,
};

const container = {
  backgroundColor: "#FFFFFF",
  margin: "0 auto",
  maxWidth: "600px",
  borderRadius: "24px",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.02)",
};

const header = {
  padding: "32px 48px",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
  display: "block",
};

const companyLogoText = {
  fontSize: "20px",
  fontWeight: "900",
  letterSpacing: "-0.04em",
  margin: "0",
  color: "#1E293B",
  textAlign: "center" as const,
};

const hr = {
  margin: "0 48px",
  borderTop: "1px solid #E2E8F0",
};

const content = {
  padding: "40px 48px",
};

const footer = {
  padding: "32px 48px",
  textAlign: "center" as const,
  borderTop: "1px solid #F1F5F9",
};

const footerText = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#475569",
  margin: "0",
};

const footerSubtext = {
  fontSize: "12px",
  color: "#94A3B8",
  margin: "8px 0 0",
};

const link = {
  color: "#6366F1",
  textDecoration: "none",
  fontWeight: "700",
};
