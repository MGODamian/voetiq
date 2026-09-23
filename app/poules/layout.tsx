import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mijn voetbalpoules | VoetIQ",
  description:
    "Maak en beheer jouw voetbalpoules bij VoetIQ en speel samen met vrienden.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PoulesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
