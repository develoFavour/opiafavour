import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";

export async function GET() {
	try {
		const { db } = await connectToDatabase();

		const projects = await db
			.collection("projects")
			.find({})
			.sort({ createdAt: -1 })
			.toArray();

		return NextResponse.json(
			projects.map((project) => ({
				id: project._id.toString(),
				title: project.title,
				description: project.description,
				tags: project.tags,
				image: project.image,
				createdAt: project.createdAt,
				updatedAt: project.updatedAt,
			}))
		);
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch projects" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { title, description, tags, image } = await request.json();

		if (!title || !description) {
			return NextResponse.json(
				{ error: "Title and description are required" },
				{ status: 400 }
			);
		}

		const { db } = await connectToDatabase();

		const now = new Date().toISOString();

		const result = await db.collection("projects").insertOne({
			title,
			description,
			tags: tags || [],
			image: image || "/placeholder.svg?height=600&width=800",
			createdAt: now,
			updatedAt: now,
		});

		return NextResponse.json(
			{
				id: result.insertedId.toString(),
				title,
				description,
				tags: tags || [],
				image: image || "/placeholder.svg?height=600&width=800",
				createdAt: now,
				updatedAt: now,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{ error: "Failed to create project" },
			{ status: 500 }
		);
	}
}
