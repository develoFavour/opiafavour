import { NextResponse } from "next/server";
import { CohereClient } from "cohere-ai";
import portfolio from "@/data/portfolio.json";

const cohere = new CohereClient({
	token: process.env.COHERE_API_KEY!,
});

export async function POST(req: Request) {
	try {
		const { question, conversationHistory } = await req.json();

		if (!question || typeof question !== "string") {
			return NextResponse.json(
				{ error: "Question is required" },
				{ status: 400 }
			);
		}

		// Build context from conversation history
		interface ConversationMessage {
			role: string;
			content: string;
		}

		const conversationContext: string =
			conversationHistory
				?.slice(-3) // Last 3 messages for context
				?.map((msg: ConversationMessage) => `${msg.role}: ${msg.content}`)
				?.join("\n") || "";

		const prompt = `You are Favour Opia's AI assistant. You should answer questions about Favour in first person as if you are representing him professionally. Be conversational, helpful, and accurate. Only answer questions related to Favour's professional background, skills, projects, and experience.

PORTFOLIO INFORMATION:
Name: ${portfolio.name}

About: ${portfolio.about.description.join(" ")}

Core Skills: ${portfolio.about.skills.join(", ")}

Detailed Skills:
${portfolio.skills
	.map(
		(skill) =>
			`- ${skill.title}: ${skill.description} (${skill.technologies.join(
				", "
			)})`
	)
	.join("\n")}

Projects:
${portfolio.projects
	.map(
		(project) =>
			`- ${project.title}: ${project.description}
    Technologies: ${project.technologies.join(", ")}
    URL: ${project.url}
    GitHub: ${project.github_url}`
	)
	.join("\n\n")}

Experience:
${portfolio.experience
	.map(
		(exp) =>
			`- ${exp.role} at ${exp.company} (${exp.period})
    Duration: ${exp.duration}
    Location: ${exp.location}
    Description: ${exp.description}
    Skills: ${exp.skills.join(", ")}`
	)
	.join("\n\n")}

${
	conversationContext
		? `\nPrevious conversation:\n${conversationContext}\n`
		: ""
}

Current question: ${question}

Instructions:
- Answer in first person as Favour Opia
- Be professional but conversational
- Keep responses concise (2-3 sentences max unless more detail is specifically requested)
- If asked about something not in the portfolio data, politely redirect to what you can help with
- Don't make up information not provided in the portfolio data
- For technical questions, reference specific technologies and projects when relevant

Answer:`;

		const response = await cohere.generate({
			model: "command-r-plus",
			prompt,
			maxTokens: 250,
			temperature: 0.7,
			stopSequences: ["\n\nQuestion:", "\n\nUser:", "\n\nHuman:"],
		});

		const answer = response.generations[0].text.trim();

		// Basic validation to ensure the response is appropriate
		if (!answer || answer.length < 10) {
			return NextResponse.json({
				answer:
					"I'm sorry, I couldn't generate a proper response. Could you please rephrase your question?",
			});
		}

		return NextResponse.json({ answer });
	} catch (error) {
		console.error("Error with Cohere AI:", error);

		// Return a helpful error message
		return NextResponse.json(
			{
				answer:
					"I'm experiencing some technical difficulties right now. Please try again in a moment, or feel free to contact Favour directly through the contact form.",
			},
			{ status: 200 }
		); // Return 200 to avoid breaking the chat UI
	}
}
