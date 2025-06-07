import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongoose";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},

	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				try {
					const { db } = await connectToDatabase();
					const user = await db
						.collection("users")
						.findOne({ email: credentials.email });

					if (!user) {
						return null;
					}

					// For development, allow a simple password check
					// In production, use proper password comparison with bcrypt
					const passwordMatch =
						process.env.NODE_ENV === "development"
							? credentials.password === user.password
							: await compare(credentials.password, user.password);

					if (!passwordMatch) {
						return null;
					}

					return {
						id: user._id.toString(),
						name: user.name || "Admin User",
						email: user.email,
						role: user.role || "admin",
					};
				} catch (error) {
					console.error("Authentication error:", error);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
			}
			return session;
		},
	},
	pages: {
		signIn: "/admin/login",
		error: "/admin/login",
	},
	secret: process.env.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV === "development",
};
