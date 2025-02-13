import type { Metadata } from "next";
import { redirect } from "next/navigation";

import "../globals.css";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Rupee Script",
  description: "Be a step ahead in your financial journey.",
};

// applicable to private groups
// making sure the user is authenticated
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    return redirect("/sign-in");
  }
  return <>{children}</>;
}
