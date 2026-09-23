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

interface SystemUpdateEmailProps {
  message?: string;
  companyName?: string;
  logoUrl?: string;
  activityUrl?: string;
}

export const SystemUpdateEmail = ({
  message = "This is to notify you of recent activity on your account. Please review the details in your log.",
  companyName = "EmailEngine",
  logoUrl,
  activityUrl = "https://brytebee.com/dashboard/activity",
}: SystemUpdateEmailProps) => {
  return (
    <PremiumEmailLayout
      previewText={`System Update: Recent account activity`}
      companyName={companyName}
      logoUrl={logoUrl}
      showHeaderLine={true}
      headerLineColor="#6366F1" // Indigo accent
    >
      <Section style={mainContent}>
        {/* Header Action Buttons */}
        <Section style={actionHeader}>
            <table cellPadding="0" cellSpacing="0" border={0} style={{ width: "100%" }}>
                <tr>
                    <td align="right" style={{ paddingRight: "8px" }}>
                        <Button style={secondaryButton} href={activityUrl}>
                            <img src="https://img.icons8.com/material-outlined/24/475569/time-machine.png" width="16" height="16" style={btnIcon} alt="log" />
                            Activity Log
                        </Button>
                    </td>
                    <td align="left" style={{ paddingLeft: "8px" }}>
                        <Button style={secondaryButton} href={activityUrl}>
                            <img src="https://img.icons8.com/material-outlined/24/475569/menu.png" width="16" height="16" style={btnIcon} alt="history" />
                            Account History
                        </Button>
                    </td>
                </tr>
            </table>
        </Section>

        <Heading style={heading}>System Update</Heading>
        
        <Text style={paragraph}>
            {message}
        </Text>

        <Section style={linkContainer}>
            <Link href={activityUrl} style={actionLink}>
                View recent activity
            </Link>
        </Section>

        {/* The DO NOT REPLY Badge */}
        <Section style={badgeContainer}>
            <Section style={badge}>
                DO NOT REPLY
            </Section>
        </Section>
      </Section>
    </PremiumEmailLayout>
  );
};

export default SystemUpdateEmail;

const mainContent = {
  textAlign: "center" as const,
};

const actionHeader = {
  padding: "0 0 40px",
};

const secondaryButton = {
  backgroundColor: "#F1F5F9",
  borderRadius: "8px",
  color: "#475569",
  fontSize: "13px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "10px 16px",
  border: "1px solid #E2E8F0",
};

const btnIcon = {
    verticalAlign: "middle",
    marginRight: "8px",
    display: "inline-block",
};

const heading = {
  fontSize: "28px",
  fontWeight: "600",
  lineHeight: "1.3",
  color: "#1E293B",
  margin: "0 0 32px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#475569",
  margin: "0 auto 32px",
  maxWidth: "400px",
};

const linkContainer = {
    padding: "0 0 64px",
};

const actionLink = {
    color: "#6366F1",
    fontSize: "16px",
    fontWeight: "700",
    textDecoration: "underline",
};

const badgeContainer = {
    textAlign: "center" as const,
};

const badge = {
  display: "inline-block",
  backgroundColor: "#F1F5F9",
  borderRadius: "100px",
  padding: "8px 24px",
  color: "#94A3B8",
  fontSize: "12px",
  fontWeight: "800",
  letterSpacing: "0.1em",
};
