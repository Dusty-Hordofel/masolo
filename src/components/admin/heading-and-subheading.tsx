import { cn } from "@/lib/utils";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";

interface HeadingAndSubheadingProps {
  heading: string;
  subheading: string;
  headingSize?: "h1" | "h2" | "h3" | "h4";
  subheadingAppearance?: "default" | "secondary";
  spacing?: "small" | "medium" | "large";
  className?: string;
  textClassName?: string;
}

export const HeadingAndSubheading = ({
  heading,
  subheading,
  headingSize = "h3",
  subheadingAppearance = "secondary",
  spacing = "medium",
  className,
  textClassName,
}: HeadingAndSubheadingProps) => {
  const spacingStyles = {
    small: "mb-2",
    medium: "mb-4",
    large: "mb-6",
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <Heading size={headingSize}>{heading}</Heading>
      <Text
        appearance={subheadingAppearance}
        className={cn(spacingStyles[spacing], textClassName)}
      >
        {subheading}
      </Text>
    </div>
  );
};
