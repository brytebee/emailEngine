import React from "react";

interface TenantBaseEmailProps {
  companyName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  title: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
}

export const TenantBaseEmail: React.FC<TenantBaseEmailProps> = ({
  companyName,
  logoUrl,
  primaryColor,
  secondaryColor,
  title,
  content,
  footer
}) => {
  return (
    <div style={{ 
      backgroundColor: secondaryColor || "#F8FAFC", 
      padding: "40px 20px", 
      fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      color: "#1E293B",
      minHeight: "100%"
    }}>
      <div style={{ 
        maxWidth: "600px", 
        margin: "0 auto", 
        backgroundColor: "#FFFFFF", 
        borderRadius: "24px", 
        overflow: "hidden", 
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" 
      }}>
        {/* Header with Logo */}
        <div style={{ padding: "40px 40px 20px", textAlign: "center" }}>
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={companyName} 
              style={{ maxHeight: "60px", maxWidth: "200px", marginBottom: "20px" }} 
            />
          ) : (
            <div style={{ 
              fontSize: "24px", 
              fontWeight: "bold", 
              color: primaryColor, 
              marginBottom: "20px" 
            }}>
              {companyName}
            </div>
          )}
          <h1 style={{ 
            fontSize: "28px", 
            fontWeight: "800", 
            letterSpacing: "-0.02em", 
            margin: "0",
            color: "#0F172A"
          }}>
            {title}
          </h1>
        </div>

        {/* Content */}
        <div style={{ padding: "0 40px 40px", fontSize: "16px", lineHeight: "1.6" }}>
          {content}
        </div>

        {/* Footer info (if any) */}
        {footer && (
          <div style={{ 
            padding: "30px 40px", 
            backgroundColor: "#F1F5F9", 
            fontSize: "14px", 
            color: "#64748B", 
            textAlign: "center" 
          }}>
            {footer}
          </div>
        )}
      </div>

      {/* Global Footer */}
      <div style={{ 
        maxWidth: "600px", 
        margin: "20px auto 0", 
        textAlign: "center", 
        fontSize: "12px", 
        color: "#94A3B8" 
      }}>
        <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
        <p>Sent via EmailEngine Platform</p>
      </div>
    </div>
  );
};
