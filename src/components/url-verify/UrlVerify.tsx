// components/url-verify/UrlVerify.tsx

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
  token?: string;
  url?: string;
  firstName?: string;
  product?: string;
  logoUrl?: string;
  support?: string;
  reset?: boolean;
}

export const UrlVerifyEmail = ({
  token,
  url,
  firstName,
  product,
  logoUrl,
  support,
  reset,
}: Props) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Img
          src={getEmailLogoUrl(logoUrl, product)}
          width="120"
          height="120"
          alt={product || "Company Logo"}
          style={logo}
        />
        <Text style={greeting}>Hi, {firstName}</Text>
        <Text style={tertiary}>
          {reset ? "Reset Your Password" : "Verify Your Email"}
        </Text>
        <Heading style={secondary}>
          {reset
            ? "Click the button below to reset your password."
            : "Click the button below to verify your email."}
        </Heading>
        <Section style={buttonContainer}>
          <Link href={url || ""} style={buttonStyle}>
            {reset ? "Reset Password" : "Verify Email"}
          </Link>
        </Section>
        <Text style={tokenText}>
          Or use this token: <Link style={link}>{token}</Link>
        </Text>
        <Text style={paragraph}>Not expecting this email?</Text>
        <Text style={paragraph}>
          {support && "Contact "}
          <Link href={`mailto:${support}`} style={link}>
            {support && support}
          </Link>{" "}
          {!support && "Please delete and ignore "}if you did not request this
          {reset ? "password reset." : "email verification."}
        </Text>
      </Container>
      <Text style={footer}>Securely powered by {product}.</Text>
    </Body>
  </Html>
);

export default UrlVerifyEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  marginTop: "30px",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "15px",
  boxShadow: "0 5px 10px rgba(20,50,70,.2)",
  marginTop: "20px",
  maxWidth: "360px",
  margin: "0 auto",
  padding: "36px 0 98px",
};

const logo = {
  margin: "30px auto",
  borderRadius: "50%",
  width: "120px",
  height: "120px",
  objectFit: "cover" as const,
};

const greeting = {
  color: "#444",
  fontSize: "15px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  letterSpacing: "0",
  lineHeight: "23px",
  padding: "12px 40px",
  margin: "0",
  textAlign: "left" as const,
  fontWeight: "900",
};

const tertiary = {
  color: "#0a85ea",
  fontSize: "11px",
  fontWeight: 700,
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  height: "16px",
  letterSpacing: "0",
  lineHeight: "16px",
  margin: "16px 8px 8px 8px",
  textTransform: "uppercase" as const,
  textAlign: "center" as const,
};

const secondary = {
  color: "#000",
  display: "inline-block",
  fontFamily: "HelveticaNeue-Medium,Helvetica,Arial,sans-serif",
  fontSize: "18px",
  fontWeight: 500,
  lineHeight: "24px",
  marginBottom: "0",
  marginTop: "0",
  textAlign: "center" as const,
  padding: "0 30px",
};

const buttonContainer = {
  margin: "26px auto 14px",
  textAlign: "center" as const,
};

const buttonStyle = {
  backgroundColor: "#0a85ea",
  borderRadius: "4px",
  color: "#fff",
  display: "inline-block",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  fontSize: "15px",
  fontWeight: 500,
  lineHeight: "50px",
  textAlign: "center" as const,
  textDecoration: "none",
  width: "180px",
};

const tokenText = {
  color: "#444",
  fontSize: "15px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  letterSpacing: "0",
  lineHeight: "23px",
  padding: "10px 40px",
  margin: "0",
  textAlign: "center" as const,
  marginBottom: "20px",
};

const tokenStyle = {
  fontWeight: 700,
  letterSpacing: "2px",
};

const paragraph = {
  color: "#444",
  fontSize: "15px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  letterSpacing: "0",
  lineHeight: "23px",
  padding: "0 40px",
  margin: "0",
  textAlign: "center" as const,
  marginBottom: "20px",
};

const link = {
  color: "#444",
  textDecoration: "underline",
};

const footer = {
  color: "#000",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0",
  lineHeight: "23px",
  margin: "0",
  marginTop: "20px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  textAlign: "center" as const,
  textTransform: "uppercase" as const,
};
