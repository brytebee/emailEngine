import React from "react";

export const ResetPasswordEmail = ({ resetLink }: { resetLink: string }) => {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h2>Admin Password Reset</h2>
      <p>We received a request to reset your admin master password.</p>
      <p>Click the button below to set a new password:</p>
      <a 
        href={resetLink} 
        style={{ 
          display: "inline-block", 
          padding: "10px 20px", 
          backgroundColor: "#000", 
          color: "#fff", 
          textDecoration: "none", 
          borderRadius: "5px",
          marginTop: "10px"
        }}
      >
        Reset Password
      </a>
      <p style={{ marginTop: "20px", fontSize: "12px", color: "#666" }}>
        If you did not request this, please ignore this email. The link expires in 1 hour.
      </p>
    </div>
  );
};
