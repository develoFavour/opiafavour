"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Project {
	id: string;
	title: string;
	description: string;
	tags: string[];
	image: string;
	createdAt: string;
	updatedAt: string;
}

interface ProjectsTableProps {
	projects: Project[];
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
	const router = useRouter();
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

	const handleDelete = async () => {
		if (!projectToDelete) return;

		try {
			const response = await fetch(`/api/projects/${projectToDelete}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Failed to delete project");
			}

			router.refresh();
		} catch (error) {
			console.error("Error deleting project:", error);
		} finally {
			setIsDeleteDialogOpen(false);
			setProjectToDelete(null);
		}
	};

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Tags</TableHead>
							<TableHead>Created</TableHead>
							<TableHead>Updated</TableHead>
							<TableHead className="w-[100px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{projects.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="text-center py-8 text-muted-foreground"
								>
									No projects found. Create your first project.
								</TableCell>
							</TableRow>
						) : (
							projects.map((project) => (
								<TableRow key={project.id}>
									<TableCell className="font-medium">{project.title}</TableCell>
									<TableCell>
										<div className="flex flex-wrap gap-1">
											{project.tags.slice(0, 3).map((tag) => (
												<Badge key={tag} variant="outline">
													{tag}
												</Badge>
											))}
											{project.tags.length > 3 && (
												<Badge variant="outline">
													+{project.tags.length - 3}
												</Badge>
											)}
										</div>
									</TableCell>
									<TableCell>
										{new Date(project.createdAt).toLocaleDateString()}
									</TableCell>
									<TableCell>
										{new Date(project.updatedAt).toLocaleDateString()}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" size="icon">
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">Actions</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<Link href={`/admin/projects/${project.id}`}>
													<DropdownMenuItem>
														<Edit className="mr-2 h-4 w-4" />
														Edit
													</DropdownMenuItem>
												</Link>
												<DropdownMenuItem
													className="text-red-600 focus:text-red-600"
													onSelect={() => {
														setProjectToDelete(project.id);
														setIsDeleteDialogOpen(true);
													}}
												>
													<Trash className="mr-2 h-4 w-4" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<AlertDialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							project and all its data.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-red-600 hover:bg-red-700"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
