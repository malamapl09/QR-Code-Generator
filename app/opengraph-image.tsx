import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "QR Code Generator - Create Free QR Codes";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%)",
        }}
      >
        {/* QR Code Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="3" height="3" />
            <rect x="18" y="14" width="3" height="3" />
            <rect x="14" y="18" width="3" height="3" />
            <rect x="18" y="18" width="3" height="3" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            color: "white",
            marginBottom: 16,
            letterSpacing: "-0.02em",
          }}
        >
          Free QR Code Generator
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#a1a1aa",
            marginBottom: 40,
          }}
        >
          Create, customize & track QR codes instantly
        </div>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: 32,
          }}
        >
          {["URL", "WiFi", "vCard", "Email", "Phone", "SMS"].map((type) => (
            <div
              key={type}
              style={{
                display: "flex",
                padding: "8px 16px",
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 8,
                color: "white",
                fontSize: 18,
              }}
            >
              {type}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
