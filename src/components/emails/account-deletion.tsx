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

interface AccountDeletionTemplateProps {
  confirmationLink: string;
  //   cancelLink: string;
  username?: string;
  companyName?: string;
  companyLogo?: string;
  companyAddress?: string;
  supportEmail?: string;
  expiresIn?: string;
  deletionDate?: string;
}

export const AccountDeletion = ({
  confirmationLink = "https://example.com/confirm-deletion?token=xyz123",
  //   cancelLink = "https://example.com/cancel-deletion?token=xyz123",
  username = "User",
  companyName = "Company Inc.",
  companyLogo = "/placeholder.svg?height=48&width=180",
  companyAddress = "123 Main Street, New York, NY 10001, USA",
  supportEmail = "support@example.com",
  expiresIn = "48 hours",
  deletionDate = "15 days",
}: AccountDeletionTemplateProps) => {
  const previewText = `Confirm your account deletion request for ${companyName}`;

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
          <Heading style={h1}>Account Deletion Confirmation</Heading>

          <Section style={section}>
            <Text style={text}>Hello {username},</Text>
            <Text style={text}>
              We have received a request to delete your {companyName} account.
              We&apos;re sorry to see you go.
            </Text>
            <Text style={text}>
              <strong>Important:</strong> Deleting your account will permanently
              remove:
            </Text>
            <ul style={list}>
              <li style={listItem}>All your personal data</li>
              <li style={listItem}>Your activity history</li>
              <li style={listItem}>Your preferences and settings</li>
              <li style={listItem}>All content you have created</li>
            </ul>
            <Text style={text}>
              To confirm the deletion of your account, please click the button
              below. This request will expire in {expiresIn}.
            </Text>
          </Section>

          <Section style={buttonContainer}>
            <Button
              style={{ ...dangerButton, padding: "12px 20px" }}
              href={confirmationLink}
            >
              Confirm Deletion
            </Button>
          </Section>

          <Text style={text}>
            If you can&apos;t click the button, copy and paste this link into
            your browser:
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

          {/* <Section style={infoSection}>
              <Text style={infoText}>
                <strong>Changed your mind?</strong> If this request was a mistake or you wish to keep your account,
                <Link href={cancelLink} style={cancelLink}>
                  {" "}
                  click here to cancel the deletion
                </Link>
                .
              </Text>
            </Section> */}

          <Section style={noteSection}>
            <Text style={noteText}>
              After confirmation, your account will be scheduled for deletion in{" "}
              {deletionDate}. During this period, you can still recover your
              account by logging in.
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={supportText}>
            If you have any questions or need assistance, please contact our
            support team at
            <Link href={`mailto:${supportEmail}`} style={link}>
              {" "}
              {supportEmail}
            </Link>
            .
          </Text>

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

export default AccountDeletion;

const main = {
  backgroundColor: "#f5f5f5",
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

const list = {
  margin: "16px 0",
  padding: "0 0 0 24px",
};

const listItem = {
  color: "#444",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "8px 0",
};

const buttonContainer = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const dangerButton = {
  backgroundColor: "#dc2626",
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
  color: "#4f46e5",
  fontSize: "14px",
  textDecoration: "underline",
};

// const cancelLink = {
//   color: "#4f46e5",
//   fontWeight: "600",
//   textDecoration: "underline",
// };

// const infoSection = {
//   backgroundColor: "#f0f9ff",
//   borderLeft: "4px solid #3b82f6",
//   padding: "16px",
//   borderRadius: "4px",
//   margin: "24px 0",
// };

// const infoText = {
//   color: "#1e40af",
//   fontSize: "14px",
//   lineHeight: "1.5",
//   margin: "0",
// };

const noteSection = {
  backgroundColor: "#fffbeb",
  borderLeft: "4px solid #f59e0b",
  padding: "16px",
  borderRadius: "4px",
  margin: "24px 0",
};

const noteText = {
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const supportText = {
  color: "#444",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "16px 0",
  textAlign: "center" as const,
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "1.5",
  textAlign: "center" as const,
  margin: "24px 0 0",
};
