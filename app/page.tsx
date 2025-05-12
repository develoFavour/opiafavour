import { ThreeDScene } from "./components/3d-scene";
import { About } from "./components/about";
import { AIAssistant } from "./components/ai-assistant";
import { Contact } from "./components/contact";
import { Hero } from "./components/hero";
import { Projects } from "./components/projects";
import { Skills } from "./components/skills";

export default function Home() {
	return (
		<main className="relative">
			<ThreeDScene />
			<Hero />
			<About />
			<Projects />
			<Skills />
			<Contact />
			<AIAssistant />
		</main>
	);
}
