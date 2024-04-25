import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface Props {
  link?: string;
  firstName?: string;
  product?: string;
  domain?: string;
}

export const Recova = ({ link, firstName, product, domain }: Props) => (
  <Html>
    <Head />
    <Preview>Reset your account credentials!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src={`public/${product?.toLowerCase()}.svg`}
            width="49"
            height="21"
            alt={product}
          />
          <Hr style={hr} />
          <Text style={paragraph}>Hello {firstName},</Text>
          <Text style={paragraph}>
            We have received a request to reset the password for your account.
            To continue, please follow the instructions below:
          </Text>
          <Hr style={hr} />
          <Text style={paragraph}>
            1. Click on the following link to reset your password:
          </Text>
          <Button style={button} href={link}>
            Reset Password
          </Button>
          <Text style={paragraph}>
            2. If the link doesn&apos;t work, copy and paste the following URL
            into your browser:
          </Text>
          <Text style={linka}>{link}</Text>
          <Hr style={hr} />
          <Text style={paragraph}>
            If you did not request a password reset, please ignore this email.
            Your account is secure, and no action is required.
          </Text>
          <Text style={paragraph}>
            For security reasons, this link will expire in 24 hours. If you need
            further assistance, please don&apos;t hesitate to contact our
            support team at:
          </Text>
          <Text style={sup}>{`https://www.${domain}/help`}</Text>
          <Text style={paragraph}>— The {product} team</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Copyright {product} @{new Date().getFullYear()}. All rights
            reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default Recova;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const paragraph = {
  color: "#525f7f",

  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const anchor = {
  color: "#556cd6",
};

const button = {
  backgroundColor: "#656ee8",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
};

const linka = {
  backgroundColor: "#fff",
  borderRadius: "5px",
  color: "#656ee8",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
  border: "1px #656ee8 solid",
};

const sup = {
  backgroundColor: "#fff",
  borderRadius: "5px",
  color: "#656ee8",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  cursor: "pointer",
  padding: "10px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
