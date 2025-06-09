"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Code, Briefcase, TrendingUp, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function DashboardStats() {
	const [stats, setStats] = useState({
		projects: 0,
		skills: 0,
		experience: 0,
		views: 1250, // Mock data for now
	});

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const [projectsRes, skillsRes, experienceRes] = await Promise.all([
					supabase.from("projects").select("id", { count: "exact" }),
					supabase.from("skills").select("id", { count: "exact" }),
					supabase.from("experience").select("id", { count: "exact" }),
				]);

				setStats({
					projects: projectsRes.count || 0,
					skills: skillsRes.count || 0,
					experience: experienceRes.count || 0,
					views: 1250,
				});
			} catch (error) {
				console.error("Error fetching stats:", error);
			}
		};

		fetchStats();
	}, []);

	const statCards = [
		{
			title: "Total Projects",
			value: stats.projects,
			icon: FolderOpen,
			color: "from-blue-500 to-cyan-500",
			change: "+12%",
		},
		{
			title: "Skills",
			value: stats.skills,
			icon: Code,
			color: "from-purple-500 to-pink-500",
			change: "+5%",
		},
		{
			title: "Experience",
			value: stats.experience,
			icon: Briefcase,
			color: "from-green-500 to-emerald-500",
			change: "+2%",
		},
		{
			title: "Portfolio Views",
			value: stats.views,
			icon: Eye,
			color: "from-orange-500 to-red-500",
			change: "+23%",
		},
	];

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-8 border border-white/10"
			>
				<h2 className="text-3xl font-bold text-white mb-2">
					Welcome to your Dashboard
				</h2>
				<p className="text-gray-400">
					Manage your portfolio content, track performance, and keep everything
					up to date.
				</p>
			</motion.div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{statCards.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<motion.div
							key={stat.title}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
						>
							<Card className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300">
								<CardHeader className="pb-2">
									<div className="flex items-center justify-between">
										<CardTitle className="text-sm font-medium text-gray-400">
											{stat.title}
										</CardTitle>
										<div
											className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}
										>
											<Icon className="h-4 w-4 text-white" />
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="flex items-center justify-between">
										<div className="text-2xl font-bold text-white">
											{stat.value}
										</div>
										<div className="flex items-center text-green-400 text-sm">
											<TrendingUp className="h-3 w-3 mr-1" />
											{stat.change}
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					);
				})}
			</div>

			{/* Recent Activity */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
			>
				<Card className="bg-black/40 backdrop-blur-xl border-white/10">
					<CardHeader>
						<CardTitle className="text-white">Recent Activity</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{[
								{
									action: "Updated project",
									item: "Portfolio Website",
									time: "2 hours ago",
								},
								{
									action: "Added skill",
									item: "Next.js 14",
									time: "1 day ago",
								},
								{
									action: "Modified experience",
									item: "Frontend Developer",
									time: "3 days ago",
								},
							].map((activity, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
								>
									<div>
										<p className="text-white font-medium">{activity.action}</p>
										<p className="text-gray-400 text-sm">{activity.item}</p>
									</div>
									<span className="text-gray-500 text-xs">{activity.time}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
