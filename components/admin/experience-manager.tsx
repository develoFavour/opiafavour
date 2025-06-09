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
import {
	Plus,
	Edit,
	Trash2,
	Building,
	MapPin,
	Calendar,
	Clock,
	Star,
} from "lucide-react";
import { supabase, type Experience } from "@/lib/supabase";
import { toast } from "sonner";

const experienceSchema = z.object({
	role: z.string().min(1, "Role is required"),
	company: z.string().min(1, "Company is required"),
	location: z.string().min(1, "Location is required"),
	period: z.string().min(1, "Period is required"),
	duration: z.string().min(1, "Duration is required"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	skills: z.string().min(1, "At least one skill is required"),
	current: z.boolean(),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

export function ExperienceManager() {
	const [experiences, setExperiences] = useState<Experience[]>([]);
	const [loading, setLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingExperience, setEditingExperience] = useState<Experience | null>(
		null
	);

	const form = useForm<ExperienceFormData>({
		resolver: zodResolver(experienceSchema),
		defaultValues: {
			role: "",
			company: "",
			location: "",
			period: "",
			duration: "",
			description: "",
			skills: "",
			current: false,
		},
	});

	useEffect(() => {
		fetchExperiences();
	}, []);

	const fetchExperiences = async () => {
		try {
			const { data, error } = await supabase
				.from("experience")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw error;
			setExperiences(data || []);
		} catch (error) {
			console.error("Error fetching experiences:", error);
			toast.error("Failed to fetch experiences");
		} finally {
			setLoading(false);
		}
	};

	const onSubmit = async (values: ExperienceFormData) => {
		try {
			const experienceData = {
				...values,
				skills: values.skills.split(",").map((skill) => skill.trim()),
			};

			if (editingExperience) {
				const { error } = await supabase
					.from("experience")
					.update(experienceData)
					.eq("id", editingExperience.id);
				if (error) throw error;
				toast.success("Experience updated successfully");
			} else {
				const { error } = await supabase
					.from("experience")
					.insert([experienceData]);
				if (error) throw error;
				toast.success("Experience created successfully");
			}

			setIsDialogOpen(false);
			setEditingExperience(null);
			form.reset();
			fetchExperiences();
		} catch (error) {
			console.error("Error saving experience:", error);
			toast.error("Failed to save experience");
		}
	};

	const deleteExperience = async (id: string) => {
		if (!confirm("Are you sure you want to delete this experience?")) return;

		try {
			const { error } = await supabase.from("experience").delete().eq("id", id);
			if (error) throw error;

			toast.success("Experience deleted successfully");
			fetchExperiences();
		} catch (error) {
			console.error("Error deleting experience:", error);
			toast.error("Failed to delete experience");
		}
	};

	const openEditDialog = (experience: Experience) => {
		setEditingExperience(experience);
		form.reset({
			role: experience.role,
			company: experience.company,
			location: experience.location || "",
			period: experience.period,
			duration: experience.duration || "",
			description: experience.description,
			skills: experience.skills.join(", "),
			current: experience.current,
		});
		setIsDialogOpen(true);
	};

	const openCreateDialog = () => {
		setEditingExperience(null);
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
					<h2 className="text-2xl font-bold text-white">Experience</h2>
					<p className="text-gray-400">
						Manage your work experience and career history
					</p>
				</div>
				<Button
					onClick={openCreateDialog}
					className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
				>
					<Plus className="h-4 w-4 mr-2" />
					Add Experience
				</Button>
			</div>

			{/* Timeline */}
			<div className="relative">
				{/* Timeline line */}
				<div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>

				<div className="space-y-8">
					<AnimatePresence>
						{experiences.map((experience, index) => (
							<motion.div
								key={experience.id}
								layout
								initial={{ opacity: 0, x: -50 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 50 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
								className="relative flex items-start gap-6"
							>
								{/* Timeline dot */}
								<div className="relative z-10 flex-shrink-0">
									<div
										className={`w-4 h-4 rounded-full border-4 ${
											experience.current
												? "bg-green-500 border-green-400 shadow-lg shadow-green-500/50"
												: "bg-blue-500 border-blue-400"
										}`}
									>
										{experience.current && (
											<div className="absolute inset-0 rounded-full bg-green-500 animate-ping"></div>
										)}
									</div>
								</div>

								{/* Experience card */}
								<Card className="flex-1 bg-black/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 group">
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<CardTitle className="text-white text-xl flex items-center gap-2">
													{experience.role}
													{experience.current && (
														<Star className="h-4 w-4 text-green-500 fill-current" />
													)}
												</CardTitle>
												<div className="flex items-center gap-4 mt-2 text-gray-400">
													<div className="flex items-center gap-1">
														<Building className="h-4 w-4" />
														<span>{experience.company}</span>
													</div>
													{experience.location && (
														<div className="flex items-center gap-1">
															<MapPin className="h-4 w-4" />
															<span>{experience.location}</span>
														</div>
													)}
												</div>
												<div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
													<div className="flex items-center gap-1">
														<Calendar className="h-3 w-3" />
														<span>{experience.period}</span>
													</div>
													{experience.duration && (
														<div className="flex items-center gap-1">
															<Clock className="h-3 w-3" />
															<span>{experience.duration}</span>
														</div>
													)}
												</div>
											</div>
										</div>
									</CardHeader>

									<CardContent className="space-y-4">
										<p className="text-gray-300 leading-relaxed">
											{experience.description}
										</p>

										{/* Skills */}
										<div className="flex flex-wrap gap-2">
											{experience.skills.map((skill) => (
												<Badge
													key={skill}
													variant="secondary"
													className="bg-white/10 text-gray-300"
												>
													{skill}
												</Badge>
											))}
										</div>

										{/* Actions */}
										<div className="flex gap-2 pt-2 border-t border-white/10">
											<Button
												size="sm"
												variant="ghost"
												onClick={() => openEditDialog(experience)}
												className="flex-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
											>
												<Edit className="h-3 w-3 mr-1" />
												Edit
											</Button>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => deleteExperience(experience.id)}
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

			{/* Create/Edit Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{editingExperience ? "Edit Experience" : "Add New Experience"}
						</DialogTitle>
					</DialogHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Job Title</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Frontend Developer"
													className="bg-white/5 border-white/10 text-white"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="company"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Company</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Tech Company Inc."
													className="bg-white/5 border-white/10 text-white"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<FormField
									control={form.control}
									name="location"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Location</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Remote / San Francisco, CA"
													className="bg-white/5 border-white/10 text-white"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="period"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Period</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Jan 2023 - Present"
													className="bg-white/5 border-white/10 text-white"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="duration"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Duration</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="1 year 6 months"
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
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												placeholder="Describe your role, responsibilities, and achievements..."
												className="bg-white/5 border-white/10 text-white min-h-[120px]"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="skills"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Skills (comma-separated)</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="React, Next.js, TypeScript, Node.js"
												className="bg-white/5 border-white/10 text-white"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="current"
								render={({ field }) => (
									<FormItem className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
										<div>
											<FormLabel>Current Position</FormLabel>
											<p className="text-sm text-gray-400">
												Mark this as your current job
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
									{editingExperience ? "Update Experience" : "Add Experience"}
								</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
