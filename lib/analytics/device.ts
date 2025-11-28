import { UAParser } from "ua-parser-js";
import type { DeviceType } from "@/types/database";

export interface ParsedDevice {
  type: DeviceType;
  browser: string | undefined;
  browserVersion: string | undefined;
  os: string | undefined;
  osVersion: string | undefined;
}

export function parseUserAgent(userAgent: string | null): ParsedDevice {
  if (!userAgent) {
    return {
      type: "unknown",
      browser: undefined,
      browserVersion: undefined,
      os: undefined,
      osVersion: undefined,
    };
  }

  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  const browser = parser.getBrowser();
  const os = parser.getOS();

  let type: DeviceType = "unknown";

  if (device.type === "mobile") {
    type = "mobile";
  } else if (device.type === "tablet") {
    type = "tablet";
  } else if (!device.type) {
    // No device type usually means desktop
    type = "desktop";
  }

  return {
    type,
    browser: browser.name,
    browserVersion: browser.version,
    os: os.name,
    osVersion: os.version,
  };
}
