import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
  Section,
} from "@react-email/components";

interface BetterAuthResetPasswordEmailProps {
  username?: string;
  resetLink?: string;
}

export const ResetPasswordEmail = ({
  username,
  resetLink,
}: BetterAuthResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your Password</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "sans-serif" }}>
        <Container
          style={{
            border: "1px solid #eaeaea",
            borderRadius: "8px",
            padding: "20px",
            maxWidth: "465px",
            margin: "40px auto",
          }}
        >
          <Heading style={{ color: "#000", textAlign: "center" }}>
            Reset your <strong>Yahonos</strong> password
          </Heading>
          <Text>Hello {username},</Text>
          <Text>
            We received a request to reset your password. If you didn’t make
            this request, you can ignore this email.
          </Text>
          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Button
              style={{
                backgroundColor: "#000",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "5px",
              }}
              href={resetLink}
            >
              Reset Password
            </Button>
          </Section>
          <Text>
            Or copy and paste this URL into your browser:{" "}
            <Link href={resetLink}>{resetLink}</Link>
          </Text>
          <Hr style={{ border: "1px solid #eaeaea", margin: "26px 0" }} />
          <Text style={{ color: "#666", fontSize: "12px" }}>
            If you didn&apos;t request a password reset, please ignore this
            email or contact support.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
