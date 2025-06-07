"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
// import { useToast } from "@/components/ui/use-toast";
import { Loader2, X } from "lucide-react";
import Image from "next/image";

interface ProjectFormProps {
	project?: {
		id: string;
		title: string;
		description: string;
		tags: string[];
		image: string;
	};
}

export function ProjectForm({ project }: ProjectFormProps) {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		title: project?.title || "",
		description: project?.description || "",
		tags: project?.tags?.join(", ") || "",
		image: project?.image || "",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const tags = formData.tags
				.split(",")
				.map((tag) => tag.trim())
				.filter((tag) => tag);

			const payload = {
				title: formData.title,
				description: formData.description,
				tags,
				image: formData.image || "/placeholder.svg?height=600&width=800",
			};

			const url = project ? `/api/projects/${project.id}` : "/api/projects";
			const method = project ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				throw new Error("Failed to save project");
			}

			toast(
				project
					? "Project updated successfully"
					: "Project created successfully"
			);

			router.push("/admin/projects");
			router.refresh();
		} catch (error) {
			console.error("Error saving project:", error);
			toast("Failed to save project. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-2">
				<Label htmlFor="title">Title</Label>
				<Input
					id="title"
					name="title"
					value={formData.title}
					onChange={handleChange}
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					name="description"
					value={formData.description}
					onChange={handleChange}
					rows={5}
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="tags">Tags (comma separated)</Label>
				<Input
					id="tags"
					name="tags"
					value={formData.tags}
					onChange={handleChange}
					placeholder="React, Next.js, TypeScript"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="image">Image URL</Label>
				<Input
					id="image"
					name="image"
					value={formData.image}
					onChange={handleChange}
					placeholder="/placeholder.svg?height=600&width=800"
				/>
				{formData.image && (
					<div className="mt-2 relative w-full max-w-xs">
						<Image
							height={600}
							width={600}
							src={formData.image || "/placeholder.svg"}
							alt="Project preview"
							className="rounded-md border h-40 object-cover"
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/50 hover:bg-black/70"
							onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				)}
			</div>

			<div className="flex gap-4">
				<Button type="submit" disabled={isLoading}>
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{project ? "Update Project" : "Create Project"}
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={() => router.push("/admin/projects")}
				>
					Cancel
				</Button>
			</div>
		</form>
	);
}
