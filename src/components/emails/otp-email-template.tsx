import {
  Body,
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
import { Tailwind } from "@react-email/tailwind";

interface OtpEmailTemplateProps {
  otpCode: string;
  recipientName?: string;
  expiryMinutes?: number;
  companyName?: string;
  companyLogo?: string;
}

export const OtpEmailTemplate = ({
  otpCode = "123456",
  recipientName = "there",
  expiryMinutes = 10,
  companyName = "Your Company",
  companyLogo = "https://via.placeholder.com/150x50?text=YourLogo",
}: OtpEmailTemplateProps) => {
  // Format OTP with spaces for better readability
  const formattedOtp = otpCode.split("").join(" ");

  return (
    <Html>
      <Head />
      <Preview>Your verification code: {otpCode}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto pt-5 pb-12">
            <Section className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header with logo */}
              <Section className="bg-primary-600 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600">
                <Img
                  src={companyLogo}
                  alt={companyName}
                  width="150"
                  height="50"
                  className="mx-auto"
                />
              </Section>

              {/* Main content */}
              <Section className="px-8 py-6">
                <Heading className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Verify Your Identity
                </Heading>

                <Text className="text-gray-700 mb-4">
                  Hello {recipientName},
                </Text>

                <Text className="text-gray-700 mb-6">
                  We received a request to verify your identity. Please use the
                  verification code below to complete the process:
                </Text>

                {/* OTP code display */}
                <Section className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-6 mb-6">
                  <Text className="font-mono text-3xl tracking-widest font-bold text-center text-gray-800">
                    {formattedOtp}
                  </Text>
                </Section>

                <Text className="text-gray-600 mb-2 text-sm">
                  This code will expire in {expiryMinutes} minutes.
                </Text>

                <Text className="text-gray-600 mb-6 text-sm">
                  If you didn&apos;t request this code, you can safely ignore
                  this email.
                </Text>

                <Hr className="border-gray-200 my-6" />

                {/* Security notice */}
                <Section className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <Text className="text-sm text-blue-700">
                    <strong>Security Tip:</strong> {companyName} will never ask
                    you to share this code with anyone, including our support
                    team. If someone asks for your code, please report it
                    immediately.
                  </Text>
                </Section>

                <Text className="text-gray-500 text-sm">
                  Need help? Contact our support team at{" "}
                  <Link
                    href="mailto:support@example.com"
                    className="text-blue-600 underline"
                  >
                    support@example.com
                  </Link>
                </Text>
              </Section>

              {/* Footer */}
              <Section className="bg-gray-50 px-8 py-4 text-center">
                <Text className="text-xs text-gray-500">
                  &copy; {new Date().getFullYear()} {companyName}. All rights
                  reserved.
                </Text>
                <Text className="text-xs text-gray-500 mt-2">
                  This is an automated message, please do not reply.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
