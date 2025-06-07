import { connectToDatabase } from "@/lib/mongoose";
import { ObjectId } from "mongodb";

export interface Project {
	id: string;
	title: string;
	description: string;
	tags: string[];
	image: string;
	createdAt: string;
	updatedAt: string;
}

export async function getProjects(): Promise<Project[]> {
	try {
		const { db } = await connectToDatabase();

		const projects = await db
			.collection("projects")
			.find({})
			.sort({ createdAt: -1 })
			.toArray();

		return projects.map((project) => ({
			id: project._id.toString(),
			title: project.title,
			description: project.description,
			tags: project.tags,
			image: project.image,
			createdAt: project.createdAt,
			updatedAt: project.updatedAt,
		}));
	} catch (error) {
		console.error("Database error:", error);
		return [];
	}
}

export async function getProjectById(id: string): Promise<Project | null> {
	try {
		const { db } = await connectToDatabase();

		const project = await db
			.collection("projects")
			.findOne({ _id: new ObjectId(id) });

		if (!project) return null;

		return {
			id: project._id.toString(),
			title: project.title,
			description: project.description,
			tags: project.tags,
			image: project.image,
			createdAt: project.createdAt,
			updatedAt: project.updatedAt,
		};
	} catch (error) {
		console.error("Database error:", error);
		return null;
	}
}
