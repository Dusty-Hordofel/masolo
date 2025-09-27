import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface EmailChangeTemplateProps {
  newEmail: string;
  oldEmail: string;
  confirmationLink: string;
  username?: string;
  companyName?: string;
  companyLogo?: string;
  companyAddress?: string;
  supportEmail?: string;
  expiresIn?: string;
}

export const EmailChange = ({
  newEmail = "nouveau@exemple.fr",
  oldEmail = "ancien@exemple.fr",
  confirmationLink = "https://exemple.fr/confirmer-email?token=xyz123",
  username = "user",
  companyName = "Entreprise SAS",
  companyLogo = "/placeholder.svg?height=48&width=180",
  companyAddress = "123 Avenue de Paris, 75000 Paris, France",
  supportEmail = "support@exemple.fr",
  expiresIn = "24 heures",
}: EmailChangeTemplateProps) => {
  const previewText = `Confirmation of email address modification`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={companyLogo}
            width="180"
            height="48"
            alt={companyName}
            style={logo}
          />
          <Heading style={h1}>Email modification confirmation</Heading>

          <Section style={section}>
            <Text style={text}>Bonjour {username},</Text>
            <Text style={text}>
              We have received a request to change your email address. You wish
              to replace <strong style={highlight}>{oldEmail}</strong> by{" "}
              <strong style={highlight}>{newEmail}</strong>.
            </Text>
            <Text style={text}>
              To confirm this change, please click on the button button below.
              This link is valid for {expiresIn}.
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Button
              style={{ ...button, padding: "12px 20px" }}
              href={confirmationLink}
            >
              Confirm email change
            </Button>
          </Section>

          <Text style={text}>
            If you can&apos;t click on the button, copy and paste this link link
            in your browser:
          </Text>
          <Text style={linkContainer}>
            <Link
              href={confirmationLink}
              style={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {confirmationLink}
            </Link>
          </Text>

          <Section style={alertSection}>
            <Text style={alertText}>
              If you have not requested this change, please ignore this email or
              contact our support team at{" "}
              <Link href={`mailto:${supportEmail}`} style={link}>
                {supportEmail}
              </Link>
              to secure your account.
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            © {new Date().getFullYear()} {companyName}. All rights reserved.
            <br />
            {companyAddress}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailChange;

const main = {
  backgroundColor: "#f5f8fa",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

const logo = {
  margin: "0 auto 24px auto",
  display: "block",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.3",
  margin: "16px 0",
  textAlign: "center" as const,
};

const section = {
  margin: "24px 0",
};

const text = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "16px 0",
};

const highlight = {
  color: "#6366f1",
  fontWeight: "600",
};

const buttonContainer = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#6366f1",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
};

const linkContainer = {
  backgroundColor: "#f4f4f4",
  borderRadius: "4px",
  padding: "12px",
  margin: "16px 0 32px",
  wordBreak: "break-all" as const,
};

const link = {
  color: "#6366f1",
  fontSize: "14px",
  textDecoration: "underline",
};

const alertSection = {
  backgroundColor: "#fff8f0",
  borderLeft: "4px solid #f59e0b",
  padding: "16px",
  borderRadius: "4px",
  margin: "24px 0",
};

const alertText = {
  color: "#664d03",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "1.5",
  textAlign: "center" as const,
};
