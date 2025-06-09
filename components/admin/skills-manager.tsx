"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Plus,
	Edit,
	Trash2,
	Code,
	Palette,
	Server,
	Smartphone,
	Brain,
} from "lucide-react";
import { supabase, type Skill } from "@/lib/supabase";
import { toast } from "sonner";

const skillSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	technologies: z.string().min(1, "At least one technology is required"),
	category: z.string().min(1, "Category is required"),
	level: z.number().min(0).max(100),
});

type SkillFormData = z.infer<typeof skillSchema>;

const categories = [
	{
		value: "frontend",
		label: "Frontend Development",
		icon: Code,
		color: "from-blue-500 to-cyan-500",
	},
	{
		value: "backend",
		label: "Backend Development",
		icon: Server,
		color: "from-green-500 to-emerald-500",
	},
	{
		value: "mobile",
		label: "Mobile Development",
		icon: Smartphone,
		color: "from-purple-500 to-pink-500",
	},
	{
		value: "design",
		label: "UI/UX Design",
		icon: Palette,
		color: "from-orange-500 to-red-500",
	},
	{
		value: "ai",
		label: "AI & Machine Learning",
		icon: Brain,
		color: "from-indigo-500 to-purple-500",
	},
];

export function SkillsManager() {
	const [skills, setSkills] = useState<Skill[]>([]);
	const [loading, setLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

	const form = useForm<SkillFormData>({
		resolver: zodResolver(skillSchema),
		defaultValues: {
			title: "",
			description: "",
			technologies: "",
			category: "",
			level: 50,
		},
	});

	useEffect(() => {
		fetchSkills();
	}, []);

	const fetchSkills = async () => {
		try {
			const { data, error } = await supabase
				.from("skills")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw error;
			setSkills(data || []);
		} catch (error) {
			console.error("Error fetching skills:", error);
			toast.error("Failed to fetch skills");
		} finally {
			setLoading(false);
		}
	};

	const onSubmit = async (values: SkillFormData) => {
		try {
			const skillData = {
				...values,
				technologies: values.technologies.split(",").map((tech) => tech.trim()),
			};

			if (editingSkill) {
				const { error } = await supabase
					.from("skills")
					.update(skillData)
					.eq("id", editingSkill.id);
				if (error) throw error;
				toast.success("Skill updated successfully");
			} else {
				const { error } = await supabase.from("skills").insert([skillData]);
				if (error) throw error;
				toast.success("Skill created successfully");
			}

			setIsDialogOpen(false);
			setEditingSkill(null);
			form.reset();
			fetchSkills();
		} catch (error) {
			console.error("Error saving skill:", error);
			toast.error("Failed to save skill");
		}
	};

	const deleteSkill = async (id: string) => {
		if (!confirm("Are you sure you want to delete this skill?")) return;

		try {
			const { error } = await supabase.from("skills").delete().eq("id", id);
			if (error) throw error;

			toast.success("Skill deleted successfully");
			fetchSkills();
		} catch (error) {
			console.error("Error deleting skill:", error);
			toast.error("Failed to delete skill");
		}
	};

	const openEditDialog = (skill: Skill) => {
		setEditingSkill(skill);
		form.reset({
			title: skill.title,
			description: skill.description,
			technologies: skill.technologies.join(", "),
			category: skill.category,
			level: skill.level,
		});
		setIsDialogOpen(true);
	};

	const openCreateDialog = () => {
		setEditingSkill(null);
		form.reset();
		setIsDialogOpen(true);
	};

	//   const getCategoryIcon = (category: string) => {
	//     const cat = categories.find((c) => c.value === category)
	//     return cat ? cat.icon : Code
	//   }

	const getCategoryColor = (category: string) => {
		const cat = categories.find((c) => c.value === category);
		return cat ? cat.color : "from-gray-500 to-gray-600";
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-white">Skills</h2>
					<p className="text-gray-400">
						Manage your technical skills and expertise
					</p>
				</div>
				<Button
					onClick={openCreateDialog}
					className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
				>
					<Plus className="h-4 w-4 mr-2" />
					Add Skill
				</Button>
			</div>

			{/* Skills by Category */}
			{categories.map((category) => {
				const categorySkills = skills.filter(
					(skill) => skill.category === category.value
				);
				if (categorySkills.length === 0) return null;

				const Icon = category.icon;

				return (
					<div key={category.value} className="space-y-4">
						<div className="flex items-center gap-3">
							<div
								className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}
							>
								<Icon className="h-5 w-5 text-white" />
							</div>
							<h3 className="text-xl font-bold text-white">{category.label}</h3>
							<Badge variant="secondary" className="bg-white/10 text-gray-300">
								{categorySkills.length}
							</Badge>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							<AnimatePresence>
								{categorySkills.map((skill) => (
									<motion.div
										key={skill.id}
										layout
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.9 }}
										transition={{ duration: 0.3 }}
									>
										<Card className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 group">
											<CardHeader className="pb-3">
												<CardTitle className="text-white text-lg flex items-center justify-between">
													{skill.title}
													<span className="text-sm font-normal text-gray-400">
														{skill.level}%
													</span>
												</CardTitle>
												<div className="w-full bg-white/10 rounded-full h-2">
													<div
														className={`h-2 rounded-full bg-gradient-to-r ${getCategoryColor(
															skill.category
														)}`}
														style={{ width: `${skill.level}%` }}
													/>
												</div>
											</CardHeader>

											<CardContent className="space-y-4">
												<p className="text-gray-400 text-sm line-clamp-2">
													{skill.description}
												</p>

												{/* Technologies */}
												<div className="flex flex-wrap gap-1">
													{skill.technologies.slice(0, 3).map((tech) => (
														<Badge
															key={tech}
															variant="secondary"
															className="text-xs bg-white/10 text-gray-300"
														>
															{tech}
														</Badge>
													))}
													{skill.technologies.length > 3 && (
														<Badge
															variant="secondary"
															className="text-xs bg-white/10 text-gray-300"
														>
															+{skill.technologies.length - 3}
														</Badge>
													)}
												</div>

												{/* Actions */}
												<div className="flex gap-2 pt-2 border-t border-white/10">
													<Button
														size="sm"
														variant="ghost"
														onClick={() => openEditDialog(skill)}
														className="flex-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
													>
														<Edit className="h-3 w-3 mr-1" />
														Edit
													</Button>
													<Button
														size="sm"
														variant="ghost"
														onClick={() => deleteSkill(skill.id)}
														className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
													>
														<Trash2 className="h-3 w-3 mr-1" />
														Delete
													</Button>
												</div>
											</CardContent>
										</Card>
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					</div>
				);
			})}

			{/* Create/Edit Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-2xl">
					<DialogHeader>
						<DialogTitle>
							{editingSkill ? "Edit Skill" : "Create New Skill"}
						</DialogTitle>
					</DialogHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Skill Title</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="React Development"
													className="bg-white/5 border-white/10 text-white"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="category"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Category</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="bg-white/5 border-white/10 text-white">
														<SelectValue placeholder="Select a category" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{categories.map((category) => (
														<SelectItem
															key={category.value}
															value={category.value}
														>
															{category.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												placeholder="Describe your expertise in this skill..."
												className="bg-white/5 border-white/10 text-white min-h-[100px]"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="technologies"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Technologies (comma-separated)</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="React, Next.js, TypeScript, Tailwind CSS"
												className="bg-white/5 border-white/10 text-white"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="level"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Proficiency Level: {field.value}%</FormLabel>
										<FormControl>
											<Slider
												min={0}
												max={100}
												step={5}
												value={[field.value]}
												onValueChange={(value: number[]) =>
													field.onChange(value[0])
												}
												className="w-full"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex gap-3 pt-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsDialogOpen(false)}
									className="flex-1 border-white/20 hover:bg-white/10"
								>
									Cancel
								</Button>
								<Button
									type="submit"
									className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
								>
									{editingSkill ? "Update Skill" : "Create Skill"}
								</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
