# Email Service

This product is a helper built from the resend email package.

It is used to send an email from an application to the email of a user. It can be extended to serve confirmation message or mass email sender.

## Adding new domains requires the following updates:

1. Add domain and API key to .env.local
2. Include the in config/email-domains.ts
3. Push to create an updated build
4. Start emailing...

## General Arguments

It takes the following arguements:

- `from`: This defines the sender. It is used to represent the domain of the product.
- `to`: The email(s) of the recipients.
- `subject`: The subject of the email being sent.
- `firstName`: A name of the recipient to personalize the message of the email.
- `product`: The product name, app name, etc.
- `logoUrl`: a hosted link of the product's logo.
- `support`: A support email for users.

## Arguments for Confirmation Endpoint

- `code`: A code sent to the recipient, in the event of email confirmations.

## Arguments for URL Verification Endpoint

- `resetToken`: A code sent to the recipient, in the event of email verification and complementary to the reset/verify button.
- `resetUrl`: A link sent to the recipient, in the event of email verification, rendered in the reset/verify button.

## Endpoint Usage

### Sending a Confirmation Email

You can send a confirmation email using a POST request to the `/v1/confirmation` endpoint. Here are examples of how to use the endpoint:

#### Default Template

```http
POST http://localhost:3000/v1/confirmation
Content-Type: application/json

{
  "from": "no-reply@techverseacademy.com",
  "to": "['user@example.com']",
  "product": "Techverse Academy",
  "firstName": "John",
  "subject": "Confirm your account",
  "code": "202456"
}
```

#### Using Different Templates

You can specify different email templates using the `template` parameter:

```http
# Corporate Template
POST http://localhost:3000/v1/confirmation
Content-Type: application/json

{
  "from": "no-reply@techverseacademy.com",
  "to": "['user@example.com']",
  "product": "Techverse Academy",
  "firstName": "John",
  "subject": "Confirm your account",
  "code": "202456",
  "template": "corporate"
}

# Elegant Template
POST http://localhost:3000/v1/confirmation
Content-Type: application/json

{
  "from": "no-reply@techverseacademy.com",
  "to": "['user@example.com']",
  "product": "Techverse Academy",
  "firstName": "John",
  "subject": "Confirm your account",
  "code": "202456",
  "template": "elegant"
}
```

### Sending a URL Verification Email

You can send a URL verification email using a POST request to the `/v1/url-verify` endpoint:

#### Default Template

```http
POST http://localhost:3000/v1/url-verify
Content-Type: application/json

{
  "from": "no-reply@techverseacademy.com",
  "to": "['user@example.com']",
  "product": "Techverse Academy",
  "firstName": "John",
  "subject": "Verify Your Account",
  "resetToken": "5HF980",
  "resetUrl": "http://localhost:3000/verify"
}
```

#### Using Different Templates

```http
# Corporate Template
POST http://localhost:3000/v1/url-verify
Content-Type: application/json

{
  "from": "no-reply@techverseacademy.com",
  "to": "['user@example.com']",
  "product": "Techverse Academy",
  "firstName": "John",
  "subject": "Verify Your Account",
  "resetToken": "5HF980",
  "resetUrl": "http://localhost:3000/verify",
  "template": "corporate"
}

# Creative Template
POST http://localhost:3000/v1/url-verify
Content-Type: application/json

{
  "from": "no-reply@techverseacademy.com",
  "to": "['user@example.com']",
  "product": "Techverse Academy",
  "firstName": "John",
  "subject": "Verify Your Account",
  "resetToken": "5HF980",
  "resetUrl": "http://localhost:3000/verify",
  "template": "creative"
}
```

### Available Templates

#### Confirmation Email Templates

- `default`: Standard confirmation email
- `corporate`: Corporate-style email template
- `elegant`: Elegant email template
- `minimal`: Minimalist email template
- `tech`: Tech-oriented email template

#### URL Verify Email Templates

- `default`: Standard URL verification email
- `corporate`: Corporate-style URL verification email
- `creative`: Creative URL verification email
- `minimalist`: Minimalist URL verification email
- `tech`: Tech-oriented URL verification email

## Author

1. Bright Atsighi
   - [GitHub](https://github.com/brytebee)
   - [LinkedIn](https://linkedin.com/in/brytebee)
