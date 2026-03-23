import React from "react";
import { render } from "@react-email/components";
import { UrlVerifyEmail } from "./src/components/url-verify/UrlVerify";

const html = render(
  <UrlVerifyEmail
    token="12345"
    url="http://localhost:3000/verify-email?token=12345"
    firstName="Test User"
    product="Ohiole Lagos"
    reset={false}
  />
);

console.log("URL Preserved?", html.includes("verify-email?token="));
