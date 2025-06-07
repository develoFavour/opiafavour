import type React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/app/components/admin/admin-sidebar";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// This is a server component that will check for authentication
	// We'll wrap this in a try/catch to handle any JWT errors gracefully
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			redirect("/admin/login");
		}

		return (
			<div className="flex h-screen overflow-hidden">
				<AdminSidebar />
				<div className="flex-1 overflow-auto">
					<main className="p-6">{children}</main>
				</div>
			</div>
		);
	} catch (error) {
		console.error("Session error:", error);
		// If there's an error with the session, redirect to login
		redirect("/admin/login");
	}
}
