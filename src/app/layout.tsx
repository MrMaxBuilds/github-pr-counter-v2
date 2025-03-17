import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Github Productivity Insights",
  description: "Understand your team's productivity on Github",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
