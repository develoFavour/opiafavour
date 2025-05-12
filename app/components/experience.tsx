"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, MapPin } from "lucide-react";

const experiences = [
	{
		id: 1,
		role: "Senior Frontend Developer",
		company: "TechCorp Inc.",
		location: "San Francisco, CA",
		period: "2022 - Present",
		description:
			"Led the development of interactive web applications using React, Three.js, and WebGL. Implemented advanced animations and 3D visualizations that increased user engagement by 40%.",
		skills: ["React", "Three.js", "WebGL", "GSAP", "TypeScript"],
	},
	{
		id: 2,
		role: "UI/UX Developer",
		company: "DesignStudio",
		location: "New York, NY",
		period: "2020 - 2022",
		description:
			"Designed and developed responsive user interfaces for various clients. Created interactive prototypes and implemented them using modern frontend technologies.",
		skills: ["JavaScript", "React", "Figma", "CSS/SCSS", "Framer Motion"],
	},
	{
		id: 3,
		role: "Web Developer",
		company: "StartupHub",
		location: "Remote",
		period: "2018 - 2020",
		description:
			"Built and maintained websites for early-stage startups. Collaborated with designers to implement pixel-perfect interfaces and optimize performance.",
		skills: ["HTML/CSS", "JavaScript", "WordPress", "PHP", "jQuery"],
	},
];

export function Experience() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const descriptionRef = useRef<HTMLParagraphElement>(null);
	const timelineRef = useRef<HTMLDivElement>(null);
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

			// Animate timeline items
			const timelineItems =
				timelineRef.current?.querySelectorAll(".timeline-item");
			if (timelineItems) {
				timelineItems.forEach((item, i) => {
					gsap.fromTo(
						item,
						{
							opacity: 0,
							y: 50,
						},
						{
							opacity: 1,
							y: 0,
							duration: 0.8,
							ease: "power3.out",
							scrollTrigger: {
								trigger: item,
								start: "top 85%",
								toggleActions: "play none none none",
								scroller: "[data-scroll-container]",
							},
							delay: i * 0.2,
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
			id="experience"
			data-scroll-section
		>
			<div className="absolute inset-0 z-0">
				<div className="absolute inset-0 bg-gradient-to-tr from-violet-900/10 via-black to-blue-900/10" />
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
							Work Experience
						</span>
					</h2>
					<p
						ref={descriptionRef}
						className="max-w-2xl mx-auto text-gray-300"
						data-scroll
						data-scroll-speed="0.2"
					>
						My professional journey and the companies I&apos;ve had the
						privilege to work with throughout my career.
					</p>
				</div>

				<div ref={timelineRef} className="relative max-w-4xl mx-auto">
					{/* Timeline line */}
					<div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 to-violet-500 transform md:translate-x-[-0.5px]"></div>

					{experiences.map((exp, index) => (
						<div
							key={exp.id}
							className={`timeline-item relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 ${
								index % 2 === 0 ? "md:text-right" : ""
							}`}
							data-scroll
							data-scroll-speed={0.1 * ((index % 3) + 1)}
						>
							{/* Timeline dot */}
							<div className="absolute left-[-8px] md:left-1/2 top-0 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transform md:translate-x-[-8px]"></div>

							{/* Content */}
							<div
								className={`${
									index % 2 === 0
										? "md:col-start-1 md:col-end-2 md:pr-12"
										: "md:col-start-2 md:col-end-3 md:pl-12 col-start-1"
								}`}
							>
								<div
									className={`p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 h-full ${
										index % 2 === 0 ? "md:text-right" : "md:text-left"
									}`}
								>
									<div className="flex items-center gap-2 mb-2 text-sm text-gray-400">
										<Calendar className="h-4 w-4" />
										<span>{exp.period}</span>
									</div>

									<h3 className="text-xl md:text-2xl font-bold mb-1">
										{exp.role}
									</h3>

									<div className="flex items-center gap-2 mb-4 text-gray-300">
										<Briefcase className="h-4 w-4" />
										<span>{exp.company}</span>
										<span className="mx-1">•</span>
										<MapPin className="h-4 w-4" />
										<span>{exp.location}</span>
									</div>

									<p className="text-gray-300 mb-4">{exp.description}</p>

									<div className="flex flex-wrap gap-2">
										{exp.skills.map((skill) => (
											<Badge
												key={skill}
												variant="outline"
												className="bg-white/5 hover:bg-white/10 border-white/10"
											>
												{skill}
											</Badge>
										))}
									</div>
								</div>
							</div>

							{/* Empty column for alternating layout */}
							<div
								className={`${
									index % 2 === 0
										? "md:col-start-2 md:col-end-3 hidden md:block"
										: "md:col-start-1 md:col-end-2 hidden md:block"
								}`}
							></div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
