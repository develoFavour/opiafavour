import { notFound } from "next/navigation";
import { DashboardHeader } from "@/app/components/admin/dashboard-header";
import { ProjectForm } from "@/app/components/admin/project-form";
import { getProjectById } from "@/lib/projects";

interface EditProjectPageProps {
	params: {
		id: string;
	};
}

export default async function EditProjectPage({
	params,
}: EditProjectPageProps) {
	const project = await getProjectById(params.id);

	if (!project) {
		notFound();
	}

	return (
		<div className="space-y-6">
			<DashboardHeader
				heading="Edit Project"
				text="Update your portfolio project."
			/>

			<div className="border rounded-lg p-6">
				<ProjectForm project={project} />
			</div>
		</div>
	);
}
