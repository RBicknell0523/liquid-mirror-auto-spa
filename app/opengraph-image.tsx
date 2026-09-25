import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const alt = "Liquid Mirror Auto Spa — Mirror Finish. Every Time."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const logoData = await readFile(join(process.cwd(), "public/liquid-mirror-logo.png"), "base64")
const logoSrc = `data:image/png;base64,${logoData}`

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(circle at 50% 20%, rgba(47,169,255,0.28) 0%, rgba(47,169,255,0) 60%)",
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element -- next/og requires a plain <img>, not next/image */}
        <img src={logoSrc} width={260} height={146} alt="" style={{ marginBottom: 28 }} />

        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 800,
            color: "#eef0f2",
            letterSpacing: -1,
          }}
        >
          MIRROR FINISH.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 800,
            color: "#2fa9ff",
            letterSpacing: -1,
            marginBottom: 24,
          }}
        >
          EVERY TIME.
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#a8acb2",
            letterSpacing: 2,
          }}
        >
          PREMIUM MOBILE AUTO DETAILING · VETERAN OWNED
        </div>
      </div>
    ),
    { ...size },
  )
}
