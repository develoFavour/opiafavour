"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "@/components/admin/login-form";
import { AdminDashboard } from "@/components/admin/dashboard";
import { useAuth } from "@/hooks/use-auth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AdminPage() {
	const { user, loading } = useAuth();
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		setIsAuthenticated(!!user);
	}, [user]);

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0">
				<div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
				<motion.div
					className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl"
					animate={{
						x: [0, 100, 0],
						y: [0, -50, 0],
						scale: [1, 1.2, 1],
					}}
					transition={{
						duration: 20,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"
					animate={{
						x: [0, -80, 0],
						y: [0, 60, 0],
						scale: [1, 1.1, 1],
					}}
					transition={{
						duration: 15,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
						delay: 2,
					}}
				/>
			</div>

			<AnimatePresence mode="wait">
				{!isAuthenticated ? (
					<motion.div
						key="login"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 1.1 }}
						transition={{ duration: 0.5 }}
						className="relative z-10"
					>
						<LoginForm onLogin={() => setIsAuthenticated(true)} />
					</motion.div>
				) : (
					<motion.div
						key="dashboard"
						initial={{ opacity: 0, x: 100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -100 }}
						transition={{ duration: 0.5 }}
						className="relative z-10"
					>
						<AdminDashboard onLogout={() => setIsAuthenticated(false)} />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
