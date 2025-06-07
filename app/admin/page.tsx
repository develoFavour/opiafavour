import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminEntryPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4">
			<div className="w-full max-w-md space-y-8 text-center">
				<div>
					<h1 className="text-4xl font-bold tracking-tight">Portfolio Admin</h1>
					<p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
						Manage your portfolio content with ease
					</p>
				</div>

				<div className="space-y-4">
					<Link href="/admin/dashboard">
						<Button className="w-full">Enter Dashboard</Button>
					</Link>

					<Link href="/admin/login">
						<Button variant="outline" className="w-full">
							Login
						</Button>
					</Link>

					<Link href="/">
						<Button variant="ghost" className="w-full">
							Return to Portfolio
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
