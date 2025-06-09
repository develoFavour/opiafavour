import type React from "react";
import { Inter, Geist as Geist_Sans } from "next/font/google";
import { LocomotiveScrollProvider } from "@/app/components/locomotive-scroll-provider";
import { ThemeProvider } from "@/app/components/theme-provider";
import { CustomCursor } from "@/app/components/custom-cursor";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geist = Geist_Sans({ subsets: ["latin"], variable: "--font-geist" });

export const metadata = {
	title: "Favour Opia | Software Developer",
	description:
		"Favour Opia, Software Developer specializing in modern web technologies",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${inter.variable} ${geist.variable} font-sans bg-black text-white`}
			>
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
					<LocomotiveScrollProvider>
						<CustomCursor />
						{children}
						<Toaster />
					</LocomotiveScrollProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
