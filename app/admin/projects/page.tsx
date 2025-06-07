import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DashboardHeader } from "@/app/components/admin/dashboard-header";
import { ProjectsTable } from "@/app/components/admin/projects-table";
import { getProjects } from "@/lib/projects";

export default async function ProjectsPage() {
	const projects = await getProjects();

	return (
		<div className="space-y-6">
			<DashboardHeader
				heading="Projects"
				text="Manage your portfolio projects."
			>
				<Link href="/admin/projects/new">
					<Button>
						<PlusCircle className="mr-2 h-4 w-4" />
						Add Project
					</Button>
				</Link>
			</DashboardHeader>

			<ProjectsTable projects={projects} />
		</div>
	);
}
