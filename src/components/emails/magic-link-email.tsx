import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface MagicLinkEmailProps {
  magicLinkUrl: string;
  email: string;
  //   name?: string;
  expiryTime?: string;
}

export const MagicLinkEmail = ({
  magicLinkUrl,
  email,
  //   name = "",
  expiryTime = "10 minutes",
}: MagicLinkEmailProps) => {
  // Format the name to ensure first letter is capitalized if provided
  //   const formattedName = name
  //     ? name
  //         .split(" ")
  //         .map(
  //           (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  //         )
  //         .join(" ")
  //     : "";

  // Get first name for personalized greeting if available
  //   const firstName = formattedName ? formattedName.split(" ")[0] : "";

  // Greeting text based on whether we have a name
  //   const greeting = firstName ? `Hi ${firstName},` : "Hi there,";
  const greeting = "Hi there,";

  return (
    <Html>
      <Head />
      <Preview>Your secure sign-in link for BETTER-AUTH</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={headerSection}>
            <Img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg"
              width="50"
              height="50"
              alt="Brand Logo"
              style={logo}
            />
          </Section>

          {/* Hero Section */}
          <Section style={heroSection}>
            <Heading style={welcomeHeading}>SECURE SIGN-IN</Heading>
            <Text style={heroText}>
              No password needed - just click the button below
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={contentSection}>
            <Text style={paragraph}>{greeting}</Text>
            <Text style={paragraph}>
              We received a request to sign in to your account using a secure
              magic link. Click the button below to securely sign in without
              needing a password.
            </Text>

            {/* Magic Link Button */}
            <Section style={buttonContainer}>
              <Button
                style={{ ...button, padding: "12px 20px" }}
                href={magicLinkUrl}
              >
                SIGN IN SECURELY
              </Button>
            </Section>

            {/* User Information Card */}
            <Section style={infoCardSection}>
              <Row>
                <Column style={infoCardColumn}>
                  <Text style={infoCardLabel}>EMAIL</Text>
                  <Text style={infoCardValue}>{email}</Text>
                </Column>
                <Column style={infoCardColumn}>
                  <Text style={infoCardLabel}>LINK EXPIRES</Text>
                  <Text style={infoCardValue}>In {expiryTime}</Text>
                </Column>
              </Row>
            </Section>

            {/* Alternative Link */}
            <Text style={alternativeText}>
              If the button doesn&apos;t work, copy and paste this link into
              your browser:
            </Text>
            <Text style={linkText}>
              <Link href={magicLinkUrl} style={alternativeLink}>
                {magicLinkUrl}
              </Link>
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Security Note */}
          <Section style={securitySection}>
            <Text style={securityHeading}>Security Information</Text>
            <Text style={securityText}>
              • This link will expire in {expiryTime} and can only be used once.
            </Text>
            <Text style={securityText}>
              • If you didn&apos;t request this link, you can safely ignore this
              email.
            </Text>
            <Text style={securityText}>
              • For security reasons, we recommend not sharing this email or
              link with anyone.
            </Text>
          </Section>

          {/* Help Section */}
          <Section style={helpSection}>
            <Text style={helpHeading}>Need Help?</Text>
            <Text style={helpText}>
              If you have any questions or concerns, please contact our support
              team at{" "}
              <Link href="mailto:support@yourbrand.com" style={helpLink}>
                support@yourbrand.com
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              © {new Date().getFullYear()} YourBrand. All rights reserved.
            </Text>
            <Text style={footerLinks}>
              <Link href="#" style={footerLink}>
                Privacy Policy
              </Link>{" "}
              •
              <Link href="#" style={footerLink}>
                {" "}
                Terms of Service
              </Link>
            </Text>
            <Text style={poweredBy}>
              Powered by <span style={betterAuth}>BETTER-AUTH</span>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f5f5f5",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  padding: "30px 0",
};

const container = {
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
};

const headerSection = {
  backgroundColor: "#000000",
  padding: "30px 0",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const heroSection = {
  backgroundColor: "#000000",
  padding: "0 40px 40px",
  textAlign: "center" as const,
};

const welcomeHeading = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0",
  letterSpacing: "0.05em",
};

const heroText = {
  color: "#ffffff",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "10px 0 0",
};

const contentSection = {
  padding: "40px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333333",
  margin: "16px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "4px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  width: "auto",
  padding: "16px 30px",
  letterSpacing: "0.05em",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
};

const infoCardSection = {
  backgroundColor: "#f8f8f8",
  borderRadius: "6px",
  padding: "20px",
  margin: "30px 0",
  border: "1px solid #eeeeee",
};

const infoCardColumn = {
  padding: "0 10px",
  width: "50%",
};

const infoCardLabel = {
  fontSize: "12px",
  color: "#666666",
  fontWeight: "bold",
  margin: "0 0 5px",
  letterSpacing: "0.05em",
};

const infoCardValue = {
  fontSize: "14px",
  color: "#333333",
  margin: "0",
  fontWeight: "medium",
};

const alternativeText = {
  fontSize: "14px",
  color: "#666666",
  margin: "20px 0 5px",
  textAlign: "center" as const,
};

const linkText = {
  textAlign: "center" as const,
  fontSize: "14px",
  color: "#666666",
  wordBreak: "break-all" as const,
};

const alternativeLink = {
  color: "#000000",
  textDecoration: "underline",
  fontSize: "14px",
};

const divider = {
  borderColor: "#eeeeee",
  margin: "0",
};

const securitySection = {
  padding: "30px 40px",
  backgroundColor: "#f8f8f8",
};

const securityHeading = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#333333",
  margin: "0 0 10px",
};

const securityText = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#666666",
  margin: "8px 0",
};

const helpSection = {
  padding: "30px 40px",
  backgroundColor: "#f8f8f8",
  borderTop: "1px solid #eeeeee",
};

const helpHeading = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#333333",
  margin: "0 0 10px",
};

const helpText = {
  fontSize: "14px",
  lineHeight: "22px",
  color: "#666666",
  margin: "0",
};

const helpLink = {
  color: "#000000",
  textDecoration: "underline",
};

const footerSection = {
  padding: "30px 40px",
  backgroundColor: "#000000",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "14px",
  color: "#ffffff",
  margin: "0 0 10px",
};

const footerLinks = {
  fontSize: "14px",
  color: "#cccccc",
  margin: "0 0 10px",
};

const footerLink = {
  color: "#ffffff",
  textDecoration: "none",
};

const poweredBy = {
  fontSize: "12px",
  color: "#999999",
  margin: "20px 0 0",
};

const betterAuth = {
  fontWeight: "bold",
  color: "#ffffff",
};
