"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Edit, Trash2, ExternalLink, Github, Star } from "lucide-react";
import { supabase, type Project } from "@/lib/supabase";
import { toast } from "sonner";
import { ImageUpload } from "./image-upload";
import Image from "next/image";

const projectSchema = z
	.object({
		title: z.string().min(1, "Title is required"),
		description: z
			.string()
			.min(10, "Description must be at least 10 characters"),
		url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
		github_url: z
			.string()
			.url("Must be a valid URL")
			.optional()
			.or(z.literal("")),
		technologies: z.string().min(1, "At least one technology is required"),
		featured: z.boolean(),
	})
	.required();

export function ProjectsManager() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingProject, setEditingProject] = useState<Project | null>(null);
	const [uploadedImage, setUploadedImage] = useState<string>("");

	type ProjectFormValues = z.infer<typeof projectSchema>;
	const form = useForm<ProjectFormValues>({
		resolver: zodResolver(projectSchema),
		defaultValues: {
			title: "",
			description: "",
			url: "",
			github_url: "",
			technologies: "",
			featured: false,
		},
	});

	useEffect(() => {
		fetchProjects();
	}, []);

	const fetchProjects = async () => {
		try {
			const { data, error } = await supabase
				.from("projects")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw error;
			setProjects(data || []);
		} catch (error) {
			console.error("Error fetching projects:", error);
			toast.error("Error", {
				description: "Failed to fetch projects",
			});
		} finally {
			setLoading(false);
		}
	};

	const onSubmit = async (values: z.infer<typeof projectSchema>) => {
		try {
			const projectData = {
				...values,
				technologies: values.technologies.split(",").map((tech) => tech.trim()),
				image: uploadedImage || editingProject?.image || null,
			};

			if (editingProject) {
				const { error } = await supabase
					.from("projects")
					.update(projectData)
					.eq("id", editingProject.id);
				if (error) throw error;
				toast.success("Success", {
					description: "Project updated successfully",
				});
			} else {
				const { error } = await supabase.from("projects").insert([projectData]);
				if (error) throw error;
				toast.success("Success", {
					description: "Project created successfully",
				});
			}

			setIsDialogOpen(false);
			setEditingProject(null);
			setUploadedImage("");
			form.reset();
			fetchProjects();
		} catch (error) {
			console.error("Error saving project:", error);
			toast.error("Error", {
				description: "Failed to save project",
			});
		}
	};

	const deleteProject = async (id: string) => {
		if (!confirm("Are you sure you want to delete this project?")) return;

		try {
			const { error } = await supabase.from("projects").delete().eq("id", id);
			if (error) throw error;

			toast.success("Success", {
				description: "Project deleted successfully",
			});
			fetchProjects();
		} catch (error) {
			console.error("Error deleting project:", error);
			toast.error("Error", {
				description: "Failed to delete project",
			});
		}
	};

	const openEditDialog = (project: Project) => {
		setEditingProject(project);
		setUploadedImage(project.image || "");
		form.reset({
			title: project.title,
			description: project.description,
			url: project.url || "",
			github_url: project.github_url || "",
			technologies: project.technologies.join(", "),
			featured: project.featured,
		});
		setIsDialogOpen(true);
	};

	const openCreateDialog = () => {
		setEditingProject(null);
		setUploadedImage("");
		form.reset();
		setIsDialogOpen(true);
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
					<h2 className="text-2xl font-bold text-white">Projects</h2>
					<p className="text-gray-400">Manage your portfolio projects</p>
				</div>
				<Button
					onClick={openCreateDialog}
					className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
				>
					<Plus className="h-4 w-4 mr-2" />
					Add Project
				</Button>
			</div>

			{/* Projects Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<AnimatePresence>
					{projects.map((project) => (
						<motion.div
							key={project.id}
							layout
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ duration: 0.3 }}
						>
							<Card className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 group">
								<CardHeader className="pb-3">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<CardTitle className="text-white text-lg flex items-center gap-2">
												{project.title}
												{project.featured && (
													<Star className="h-4 w-4 text-yellow-500 fill-current" />
												)}
											</CardTitle>
											<p className="text-gray-400 text-sm mt-1 line-clamp-2">
												{project.description}
											</p>
										</div>
									</div>
								</CardHeader>

								<CardContent className="space-y-4">
									{/* Project Image */}
									{project.image && (
										<div className="relative h-32 rounded-lg overflow-hidden bg-gray-800">
											<Image
												height={100}
												width={100}
												src={project.image || "/placeholder.svg"}
												alt={project.title}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
											/>
										</div>
									)}

									{/* Technologies */}
									<div className="flex flex-wrap gap-1">
										{project.technologies.slice(0, 3).map((tech) => (
											<Badge
												key={tech}
												variant="secondary"
												className="text-xs bg-white/10 text-gray-300"
											>
												{tech}
											</Badge>
										))}
										{project.technologies.length > 3 && (
											<Badge
												variant="secondary"
												className="text-xs bg-white/10 text-gray-300"
											>
												+{project.technologies.length - 3}
											</Badge>
										)}
									</div>

									{/* Links */}
									<div className="flex gap-2">
										{project.url && (
											<Button
												size="sm"
												variant="outline"
												className="flex-1 border-white/20 hover:bg-white/10"
											>
												<ExternalLink className="h-3 w-3 mr-1" />
												Demo
											</Button>
										)}
										{project.github_url && (
											<Button
												size="sm"
												variant="outline"
												className="flex-1 border-white/20 hover:bg-white/10"
											>
												<Github className="h-3 w-3 mr-1" />
												Code
											</Button>
										)}
									</div>

									{/* Actions */}
									<div className="flex gap-2 pt-2 border-t border-white/10">
										<Button
											size="sm"
											variant="ghost"
											onClick={() => openEditDialog(project)}
											className="flex-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
										>
											<Edit className="h-3 w-3 mr-1" />
											Edit
										</Button>
										<Button
											size="sm"
											variant="ghost"
											onClick={() => deleteProject(project.id)}
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

			{/* Create/Edit Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{editingProject ? "Edit Project" : "Create New Project"}
						</DialogTitle>
					</DialogHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Project Title</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="My Awesome Project"
												className="bg-white/5 border-white/10 text-white"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												placeholder="Describe your project..."
												className="bg-white/5 border-white/10 text-white min-h-[100px]"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="url"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Demo URL (Optional)</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="https://example.com"
													className="bg-white/5 border-white/10 text-white"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="github_url"
									render={({ field }) => (
										<FormItem>
											<FormLabel>GitHub URL (Optional)</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="https://github.com/username/repo"
													className="bg-white/5 border-white/10 text-white"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

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

							{/* Image Upload */}
							<div>
								<label className="block text-sm font-medium text-white mb-2">
									Project Image
								</label>
								<ImageUpload
									value={uploadedImage}
									onChange={setUploadedImage}
									bucket="project-images"
									className="w-full"
								/>
							</div>

							<FormField
								control={form.control}
								name="featured"
								render={({ field }) => (
									<FormItem className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
										<div>
											<FormLabel>Featured Project</FormLabel>
											<p className="text-sm text-gray-400">
												Show this project prominently on the homepage
											</p>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
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
									{editingProject ? "Update Project" : "Create Project"}
								</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
