import { Icons } from "@/components/ui/icons";

/**
 * Returns the Lucide icon corresponding to the device type.
 * @param deviceType The type of device (e.g., "mobile", "tablet", "desktop")
 * @param className Custom CSS class to apply to the icon
 * @returns A Lucide icon component based on the device type
 */

type DeviceIconProps = {
  deviceType?: string;
  className?: string;
};
export const getDeviceIcon = ({ deviceType, className }: DeviceIconProps) => {
  switch (deviceType) {
    case "mobile":
      return <Icons.smartphone className={className} />;
    case "tablet":
      return <Icons.tablet className={className} />;
    case "smarttv":
      return <Icons.tv className={className} />;
    case "console":
      return <Icons.gamepad2 className={className} />;
    case "wearable":
      return <Icons.watch className={className} />;
    case "embedded":
      return <Icons.monitor className={className} />;
    case "desktop":
    default:
      return <Icons.monitor className={className} />;
  }
};
