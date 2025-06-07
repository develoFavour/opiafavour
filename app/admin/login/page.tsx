"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [email, setEmail] = useState("admin@example.com");
	const [password, setPassword] = useState("adminpassword123");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	// Check for error in URL (from NextAuth)
	useEffect(() => {
		const errorParam = searchParams.get("error");
		if (errorParam) {
			if (errorParam === "CredentialsSignin") {
				setError("Invalid email or password");
			} else {
				setError(`Authentication error: ${errorParam}`);
			}
		}
	}, [searchParams]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const result = await signIn("credentials", {
				redirect: false,
				email,
				password,
			});

			if (result?.error) {
				setError("Invalid email or password");
				setIsLoading(false);
				return;
			}

			router.push("/admin/dashboard");
			router.refresh();
		} catch (error) {
			setError("An error occurred. Please try again.");
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<div className="flex items-center justify-between">
						<Link
							href="/admin"
							className="flex items-center text-sm text-muted-foreground hover:text-foreground"
						>
							<ArrowLeft className="mr-1 h-4 w-4" />
							Back
						</Link>
					</div>
					<CardTitle className="text-2xl font-bold mt-4">Admin Login</CardTitle>
					<CardDescription>
						Enter your credentials to access the dashboard
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						{error && (
							<Alert variant="destructive">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="admin@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Password</Label>
								<a href="#" className="text-sm text-primary hover:underline">
									Forgot password?
								</a>
							</div>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						<div className="text-sm text-muted-foreground">
							<p>For development: Use the pre-filled credentials to log in</p>
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
								</>
							) : (
								"Sign In"
							)}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
