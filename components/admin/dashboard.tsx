"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProjectsManager } from "./projects-manager";
import { SkillsManager } from "./skills-manager";
import { ExperienceManager } from "./experience-manager";
import { DashboardStats } from "./dashboard-stats";
import {
	LayoutDashboard,
	FolderOpen,
	Code,
	Briefcase,
	LogOut,
	Menu,
	X,
	Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

interface AdminDashboardProps {
	onLogout: () => void;
}

type ActiveTab = "dashboard" | "projects" | "skills" | "experience";

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
	const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const getUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setUser(user);
		};
		getUser();
	}, []);

	const handleLogout = async () => {
		try {
			await supabase.auth.signOut();
			toast.success("You have been signed out of the admin dashboard.");
			onLogout();
		} catch (error) {
			console.log(error);
			toast.error("Failed to log out. Please try again.");
		}
	};

	const menuItems = [
		{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
		{ id: "projects", label: "Projects", icon: FolderOpen },
		{ id: "skills", label: "Skills", icon: Code },
		{ id: "experience", label: "Experience", icon: Briefcase },
	];

	const renderContent = () => {
		switch (activeTab) {
			case "dashboard":
				return <DashboardStats />;
			case "projects":
				return <ProjectsManager />;
			case "skills":
				return <SkillsManager />;
			case "experience":
				return <ExperienceManager />;
			default:
				return <DashboardStats />;
		}
	};

	return (
		<div className="min-h-screen flex">
			{/* Sidebar */}
			<AnimatePresence>
				{sidebarOpen && (
					<motion.aside
						initial={{ x: -300, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: -300, opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="fixed lg:relative z-30 w-80 h-screen bg-black/40 backdrop-blur-xl border-r border-white/10"
					>
						<div className="p-6">
							{/* Logo */}
							<div className="flex items-center gap-3 mb-8">
								<div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
									<Sparkles className="h-5 w-5 text-white" />
								</div>
								<div>
									<h2 className="text-xl font-bold text-white">Admin Panel</h2>
									<p className="text-xs text-gray-400">Portfolio Manager</p>
								</div>
							</div>

							{/* User Info */}
							<div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
										<span className="text-white font-semibold text-sm">
											{user?.email?.charAt(0).toUpperCase() || "A"}
										</span>
									</div>
									<div>
										<p className="text-white font-medium text-sm">
											Welcome back!
										</p>
										<p className="text-gray-400 text-xs">
											{user?.email || "admin@example.com"}
										</p>
									</div>
								</div>
							</div>

							{/* Navigation */}
							<nav className="space-y-2">
								{menuItems.map((item) => {
									const Icon = item.icon;
									const isActive = activeTab === item.id;

									return (
										<motion.button
											key={item.id}
											onClick={() => setActiveTab(item.id as ActiveTab)}
											className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
												isActive
													? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
													: "text-gray-400 hover:text-white hover:bg-white/5"
											}`}
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
										>
											<Icon className="h-5 w-5" />
											<span className="font-medium">{item.label}</span>
											{isActive && (
												<motion.div
													layoutId="activeTab"
													className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
												/>
											)}
										</motion.button>
									);
								})}
							</nav>

							{/* Logout Button */}
							<div className="absolute bottom-6 left-6 right-6">
								<Button
									onClick={handleLogout}
									variant="outline"
									className="w-full bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
								>
									<LogOut className="h-4 w-4 mr-2" />
									Logout
								</Button>
							</div>
						</div>
					</motion.aside>
				)}
			</AnimatePresence>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{/* Header */}
				<header className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setSidebarOpen(!sidebarOpen)}
								className="text-white hover:bg-white/10"
							>
								{sidebarOpen ? (
									<X className="h-5 w-5" />
								) : (
									<Menu className="h-5 w-5" />
								)}
							</Button>
							<div>
								<h1 className="text-2xl font-bold text-white capitalize">
									{activeTab}
								</h1>
								<p className="text-gray-400 text-sm">
									Manage your portfolio content
								</p>
							</div>
						</div>
					</div>
				</header>

				{/* Content */}
				<main className="flex-1 p-6 overflow-auto">
					<AnimatePresence mode="wait">
						<motion.div
							key={activeTab}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3 }}
						>
							{renderContent()}
						</motion.div>
					</AnimatePresence>
				</main>
			</div>

			{/* Mobile Overlay */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}
		</div>
	);
}
