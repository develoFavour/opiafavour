import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Portfolio Admin Dashboard",
	description: "Admin dashboard for managing portfolio content",
};

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div
			className={`${inter.className} min-h-screen bg-gray-100 dark:bg-gray-900`}
		>
			{children}
		</div>
	);
}
