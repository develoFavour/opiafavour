import { DashboardHeader } from "@/app/components/admin/dashboard-header";
import { ProjectForm } from "@/app/components/admin/project-form";

export default function NewProjectPage() {
	return (
		<div className="space-y-6">
			<DashboardHeader
				heading="Create Project"
				text="Add a new project to your portfolio."
			/>

			<div className="border rounded-lg p-6">
				<ProjectForm />
			</div>
		</div>
	);
}
