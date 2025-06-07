import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { db } = await connectToDatabase();

		const project = await db
			.collection("projects")
			.findOne({ _id: new ObjectId(params.id) });

		if (!project) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		return NextResponse.json({
			id: project._id.toString(),
			title: project.title,
			description: project.description,
			tags: project.tags,
			image: project.image,
			createdAt: project.createdAt,
			updatedAt: project.updatedAt,
		});
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch project" },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
) {
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

		const result = await db.collection("projects").updateOne(
			{ _id: new ObjectId(params.id) },
			{
				$set: {
					title,
					description,
					tags: tags || [],
					image: image || "/placeholder.svg?height=600&width=800",
					updatedAt: now,
				},
			}
		);

		if (result.matchedCount === 0) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		return NextResponse.json({
			id: params.id,
			title,
			description,
			tags: tags || [],
			image: image || "/placeholder.svg?height=600&width=800",
			updatedAt: now,
		});
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{ error: "Failed to update project" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { db } = await connectToDatabase();

		const result = await db
			.collection("projects")
			.deleteOne({ _id: new ObjectId(params.id) });

		if (result.deletedCount === 0) {
			return NextResponse.json({ error: "Project not found" }, { status: 404 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{ error: "Failed to delete project" },
			{ status: 500 }
		);
	}
}
