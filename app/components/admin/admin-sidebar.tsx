"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
	BarChart3,
	FileText,
	Home,
	ImageIcon,
	LayoutDashboard,
	LogOut,
	Settings,
	User,
	Briefcase,
	Code,
} from "lucide-react";

const sidebarLinks = [
	{ name: "Dashboard", href: "/admin", icon: LayoutDashboard },
	{ name: "Projects", href: "/admin/projects", icon: FileText },
	{ name: "Experience", href: "/admin/experience", icon: Briefcase },
	{ name: "Skills", href: "/admin/skills", icon: Code },
	{ name: "About", href: "/admin/about", icon: User },
	{ name: "Media", href: "/admin/media", icon: ImageIcon },
	{ name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
	{ name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
	const pathname = usePathname();

	return (
		<div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
			<div className="p-6">
				<Link href="/" className="flex items-center gap-2">
					<Home className="h-6 w-6" />
					<span className="font-bold text-xl">Portfolio Admin</span>
				</Link>
			</div>
			<div className="flex-1 px-4 space-y-1 overflow-auto py-2">
				{sidebarLinks.map((link) => {
					const isActive =
						pathname === link.href || pathname.startsWith(`${link.href}/`);
					return (
						<Link
							key={link.href}
							href={link.href}
							className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
								isActive
									? "bg-gray-100 dark:bg-gray-700 text-primary"
									: "hover:bg-gray-100 dark:hover:bg-gray-700"
							}`}
						>
							<link.icon className="h-5 w-5" />
							<span>{link.name}</span>
						</Link>
					);
				})}
			</div>
			<div className="p-4 border-t border-gray-200 dark:border-gray-700">
				<Button
					variant="ghost"
					className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
					onClick={() => signOut({ callbackUrl: "/admin/login" })}
				>
					<LogOut className="mr-2 h-5 w-5" />
					Sign Out
				</Button>
			</div>
		</div>
	);
}
