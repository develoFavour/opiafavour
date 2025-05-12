"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Layers, Palette, Sparkles, Zap } from "lucide-react";

const skills = [
	{
		icon: Code,
		title: "Frontend Development",
		description:
			"Building responsive and performant web applications with modern frameworks and tools.",
		technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
	},
	{
		icon: Layers,
		title: "3D Graphics & WebGL",
		description:
			"Creating immersive 3D experiences and interactive visualizations for the web.",
		technologies: ["Three.js", "React Three Fiber", "WebGL", "GLSL"],
	},
	{
		icon: Zap,
		title: "Animation & Interaction",
		description:
			"Crafting smooth animations and micro-interactions that enhance user experience.",
		technologies: ["GSAP", "Framer Motion", "Lottie", "CSS Animations"],
	},
	{
		icon: Palette,
		title: "UI/UX Design",
		description:
			"Designing intuitive interfaces with a focus on usability and aesthetic appeal.",
		technologies: ["Figma", "Adobe XD", "Design Systems", "Prototyping"],
	},
	{
		icon: Sparkles,
		title: "AI Integration",
		description:
			"Implementing AI-powered features to create intelligent and adaptive user experiences.",
		technologies: [
			"Vercel AI SDK",
			"OpenAI API",
			"TensorFlow.js",
			"Natural Language Processing",
		],
	},
];

export function Skills() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const descriptionRef = useRef<HTMLParagraphElement>(null);
	const cardsRef = useRef<HTMLDivElement>(null);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isMounted) return;

		gsap.registerPlugin(ScrollTrigger);

		// Small delay to ensure DOM is ready
		const timer = setTimeout(() => {
			// Animate heading and description
			if (headingRef.current && descriptionRef.current) {
				gsap.fromTo(
					headingRef.current,
					{ opacity: 0, y: 30 },
					{
						opacity: 1,
						y: 0,
						duration: 0.8,
						ease: "power3.out",
						scrollTrigger: {
							trigger: headingRef.current,
							start: "top 80%",
							toggleActions: "play none none none",
							scroller: "[data-scroll-container]",
						},
					}
				);

				gsap.fromTo(
					descriptionRef.current,
					{ opacity: 0, y: 30 },
					{
						opacity: 1,
						y: 0,
						duration: 0.8,
						delay: 0.2,
						ease: "power3.out",
						scrollTrigger: {
							trigger: descriptionRef.current,
							start: "top 80%",
							toggleActions: "play none none none",
							scroller: "[data-scroll-container]",
						},
					}
				);
			}

			// Animate cards
			const cards = cardsRef.current?.querySelectorAll(".skill-card");
			if (cards) {
				cards.forEach((card, i) => {
					gsap.fromTo(
						card,
						{
							y: 100,
							opacity: 0,
						},
						{
							y: 0,
							opacity: 1,
							duration: 0.8,
							ease: "power3.out",
							scrollTrigger: {
								trigger: card,
								start: "top 85%",
								toggleActions: "play none none none",
								scroller: "[data-scroll-container]",
							},
							delay: i * 0.1,
						}
					);
				});
			}
		}, 500);

		return () => {
			clearTimeout(timer);
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	}, [isMounted]);

	return (
		<section
			ref={sectionRef}
			className="relative py-24 md:py-32 bg-black min-h-screen"
			id="skills"
			data-scroll-section
		>
			<div className="absolute inset-0 z-0">
				<div className="absolute inset-0 bg-gradient-to-tl from-violet-900/10 via-black to-blue-900/10" />
			</div>

			<div className="container mx-auto px-4">
				<div className="text-center mb-16">
					<h2
						ref={headingRef}
						className="text-3xl md:text-5xl font-bold mb-6 inline-block"
						data-scroll
						data-scroll-speed="0.1"
					>
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
							Skills & Expertise
						</span>
					</h2>
					<p
						ref={descriptionRef}
						className="max-w-2xl mx-auto text-gray-300"
						data-scroll
						data-scroll-speed="0.2"
					>
						My technical toolkit and areas of expertise that enable me to create
						exceptional digital experiences.
					</p>
				</div>

				<div
					ref={cardsRef}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				>
					{skills.map((skill, index) => (
						<Card
							key={skill.title}
							className="skill-card bg-black/50 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden group"
							data-scroll
							data-scroll-speed={0.05 * (index % 3)}
						>
							<CardContent className="p-6">
								<div className="mb-4 flex items-center justify-between">
									<div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 backdrop-blur-sm">
										<skill.icon className="h-6 w-6 text-white" />
									</div>
									<div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transform origin-left scale-0 group-hover:scale-100 transition-transform duration-300"></div>
								</div>

								<h3 className="text-xl font-bold mb-2">{skill.title}</h3>
								<p className="text-gray-400 mb-4 text-sm">
									{skill.description}
								</p>

								<div className="flex flex-wrap gap-2">
									{skill.technologies.map((tech) => (
										<span
											key={tech}
											className="px-2 py-1 text-xs bg-white/5 backdrop-blur-sm rounded-md border border-white/10"
										>
											{tech}
										</span>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
