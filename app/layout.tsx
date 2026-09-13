import type { Metadata } from "next";
import { BeamsBackground } from "@/components/BeamsBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "Liquid Mirror Auto Spa",
  description: "Premium mobile auto detailing and ceramic coating.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <BeamsBackground />
        {children}
      </body>
    </html>
  );
}
