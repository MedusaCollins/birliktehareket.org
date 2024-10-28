import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Row,
  Preview,
  Section,
  Column,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationCode {
  verificationCode: string;
}

export const PassResetTemplate = ({ verificationCode }: VerificationCode) => (
  <Html>
    <Head />
    <Preview>Reset Your Password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Row>
            <Column>
              <Img
                src="https://i.imgur.com/y3yEkHb.jpeg" //For Now
                width="100"
                height="100"
                style={logo}
                alt="Logo"
              />
            </Column>

            <Column align="left" style={tableCell}>
              <Text style={heading}>Birlikte Hareket</Text>
            </Column>
          </Row>
        </Section>

        <Heading style={h1}>Password Recovery</Heading>
        <Text style={heroText}>
          Your confirmation code is below, enter it in your open browser window and we'll help you
          reset your password.
        </Text>

        <Section style={codeBox}>
          <Text style={confirmationCodeText}>{verificationCode}</Text>
        </Section>

        <Text style={text}>
          If you didn't request this email, there's nothing to worry about, you can safely ignore
          it.
        </Text>

        <Section>
          <Link
            style={footerLink}
            href="https://birliktehareket.org/contact"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact
          </Link>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <Link
            style={footerLink}
            href="https://birliktehareket.org/terms"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms
          </Link>
          <Text style={footerText}>© 2024 Birlikte Hareket. All rights reserved</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default PassResetTemplate;

const footerText = {
  fontSize: "12px",
  color: "#d8d6ca",
  lineHeight: "15px",
  textAlign: "left" as const,
  marginBottom: "50px",
};

const footerLink = {
  color: "#d8d6ca",
  textDecoration: "underline",
};

const main = {
  backgroundColor: "#9ca3af",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const tableCell = { display: "table-cell" };

const heading = {
  fontSize: "24px",
  fontWeight: "600",
  color: "black",
};

const container = {
  margin: "0 auto",
  padding: "0px 20px",
};

const logoContainer = {
  marginTop: "32px",
  marginBottom: "32px",
  width: "100%",
};

const logo = {
  borderRadius: "2rem",
  width: "100px",
  height: "100px",
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "36px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px",
};

const heroText = {
  fontSize: "20px",
  lineHeight: "28px",
  marginBottom: "30px",
  color: "black",
};

const codeBox = {
  background: "rgb(245, 244, 245)",
  borderRadius: "4px",
  marginBottom: "30px",
  padding: "40px 10px",
};

const confirmationCodeText = {
  fontSize: "30px",
  textAlign: "center" as const,
  verticalAlign: "middle",
};

const text = {
  color: "#000",
  fontSize: "14px",
  lineHeight: "24px",
};
