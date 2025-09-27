/**
 * Returns a user-friendly label for the device type.
 * @param deviceType The type of device (e.g., "mobile", "tablet", "desktop")
 * @returns A label representing the device type (e.g., "Mobile", "Tablet", "Computer")
 */

export const getDeviceLabel = (deviceType?: string): string => {
  switch (deviceType) {
    case "mobile":
      return "Mobile";
    case "tablet":
      return "Tablet";
    case "smarttv":
      return "Smart TV";
    case "console":
      return "Console";
    case "wearable":
      return "Wearable";
    case "embedded":
      return "Embedded system";
    case "desktop":
    default:
      return "Computer";
  }
};
