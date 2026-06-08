import SessionProvider from "@/components/providers/SessionProvider";
import { authOptions } from "@/lib/auth"; // ← change this import
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatAI — Real-Time Chat with AI",
  description: "Real-time chat app with built-in AI assistant",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}