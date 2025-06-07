import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const activities = [
	{
		id: 1,
		user: {
			name: "You",
			avatar: "/placeholder.svg?height=32&width=32",
			email: "admin@example.com",
		},
		action: "updated the About section",
		date: "2 hours ago",
	},
	{
		id: 2,
		user: {
			name: "You",
			avatar: "/placeholder.svg?height=32&width=32",
			email: "admin@example.com",
		},
		action: "added a new project",
		date: "1 day ago",
	},
	{
		id: 3,
		user: {
			name: "You",
			avatar: "/placeholder.svg?height=32&width=32",
			email: "admin@example.com",
		},
		action: "updated skills",
		date: "3 days ago",
	},
	{
		id: 4,
		user: {
			name: "You",
			avatar: "/placeholder.svg?height=32&width=32",
			email: "admin@example.com",
		},
		action: "uploaded new media",
		date: "1 week ago",
	},
];

export function RecentActivity() {
	return (
		<div className="space-y-8">
			{activities.map((activity) => (
				<div key={activity.id} className="flex items-center">
					<Avatar className="h-9 w-9">
						<AvatarImage
							src={activity.user.avatar || "/placeholder.svg"}
							alt={activity.user.name}
						/>
						<AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
					</Avatar>
					<div className="ml-4 space-y-1">
						<p className="text-sm font-medium leading-none">
							{activity.user.name}{" "}
							<span className="text-muted-foreground">{activity.action}</span>
						</p>
						<p className="text-sm text-muted-foreground">{activity.date}</p>
					</div>
				</div>
			))}
		</div>
	);
}
