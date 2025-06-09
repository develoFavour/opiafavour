"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { SiAppwrite, SiSupabase } from "react-icons/si";

import {
	SiJavascript,
	SiMongodb,
	SiNextdotjs,
	SiTypescript,
} from "react-icons/si";

import { FaReact } from "react-icons/fa";
// import { TbBrandThreejs } from "react-icons/tb";
import { FiFramer } from "react-icons/fi";
// import { FaCircleNodes, FaGolang } from "react-icons/fa6";
import { RiTailwindCssFill } from "react-icons/ri";

const projects = [
	{
		id: 5,
		title: "ContentAI",
		description:
			"A Fullstack AI-powered content generation application built with REACT, Next.js, Supabase,TAILWIND and OpenAI API, groq",
		url: "https://content-ai-eta.vercel.app/",
		github_url: "https://github.com/develoFavour/content-ai",
		tags: [
			{ title: "Next.js", icon: <SiNextdotjs /> },
			{ title: "TypeScript", icon: <SiTypescript /> },
			{ title: "React", icon: <FaReact /> },
			{ title: "Supabase", icon: <SiSupabase /> },
			{ title: "Tailwind CSS", icon: <RiTailwindCssFill /> },
		],

		image: "/projects/content-ai.jpg",
	},
	{
		id: 1,
		title: "Patient-Doctor Appointment Booking System",
		description:
			"A Fullstack Doctor-Patient Appointment Booking application built with REACT, Next.js, TAILWIND and Appwrite. The application allows users to book appointments with available doctors, and an admin dashboard for doctors to accept or reject appointments.",
		url: "https://opia-health-care.vercel.app/",
		github_url: "https://github.com/develoFavour/opia-health-care",
		tags: [
			{ title: "Appwrite", icon: <SiAppwrite /> },
			{ title: "React", icon: <FaReact /> },
			{ title: "Next.js", icon: <SiNextdotjs /> },
			{ title: "TypeScript", icon: <SiTypescript /> },
			{ title: "Tailwind CSS", icon: <RiTailwindCssFill /> },
		],
		image: "/projects/opia-health-care2.jpg",
	},
	{
		id: 2,
		title: "Top-Shop Commerce",
		description:
			"A Fullstack modern e-commerce platform with advanced animations and smooth transitions. Built with Next.js, Framer Motion, TypeScript, and MongoDB.",
		url: "https://top-shop-virid.vercel.app/",
		github_url: "https://github.com/develoFavour/Top-Shop",
		tags: [
			{ title: "Next.js", icon: <SiNextdotjs /> },
			{ title: "Framer Motion", icon: <FiFramer /> },
			{ title: "TypeScript", icon: <SiTypescript /> },
			{ title: "MongoDB", icon: <SiMongodb /> },
		],
		image: "/projects/topshop.jpg",
	},
	{
		id: 3,
		title: "MediCare",
		description:
			"A fullstack advanced hospital platform with personalized dashboards for doctors, admins, and patients with the fullest features encompassing all aspect of healthcare services of making appointment requests by patient, appointment scheduling by admin to doctors, patient and doctor notification, doctor management and patient management by admin, prescription by doctor, etc.",
		url: "https://medicare-taupe.vercel.app/",
		github_url: "https://github.com/develoFavour/MediCare",
		tags: [
			{ title: "Next.js", icon: <SiNextdotjs /> },
			{ title: "Framer Motion", icon: <FiFramer /> },
			{ title: "TypeScript", icon: <SiTypescript /> },
			{ title: "MongoDB", icon: <SiMongodb /> },
		],

		image: "/projects/medicare.jpg",
	},
	{
		id: 4,
		title: "Pincial",
		description:
			"A Fullstack Social Media Application Pinterest Clone built with REACT, TAILWIND and SANITY. This pinterest clone is a fullstack social media application that allows users to create and manage pins, and post their favorite pictures.",

		url: "https://pincial.netlify.app/",
		github_url: "https://github.com/develoFavour/pincial",
		tags: [
			{ title: "React", icon: <FaReact /> },
			{ title: "Tailwind CSS", icon: <RiTailwindCssFill /> },
			{ title: "JavaScript", icon: <SiJavascript /> },
		],

		image: "/projects/pincial.jpg",
	},
];

export function Projects() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const descriptionRef = useRef<HTMLParagraphElement>(null);
	const [activeProject, setActiveProject] = useState(0);
	const [isMounted, setIsMounted] = useState(false);
	console.log(activeProject);
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

			// Set up project tracking
			const projectElements = document.querySelectorAll("[data-project]");
			projectElements.forEach((project, i) => {
				ScrollTrigger.create({
					trigger: project,
					start: "top center",
					end: "bottom center",
					onEnter: () => setActiveProject(i),
					onEnterBack: () => setActiveProject(i),
					scroller: "[data-scroll-container]",
				});
			});
		}, 500);

		return () => {
			clearTimeout(timer);
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	}, [isMounted]);

	const handleProjectClick = (url: string) => {
		window.open(url, "_blank");
	};

	return (
		<section
			ref={sectionRef}
			className="relative py-24 md:py-32 bg-black min-h-screen"
			id="projects"
			data-scroll-section
		>
			<div className="absolute inset-0 z-0">
				<div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-black to-violet-900/10" />
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
							Featured Projects
						</span>
					</h2>
					<p
						ref={descriptionRef}
						className="max-w-2xl mx-auto text-gray-300"
						data-scroll
						data-scroll-speed="0.2"
					>
						A selection of my most recent and impactful work, showcasing my
						skills in web development, 3D graphics, and interactive design.
					</p>
				</div>

				<div className="space-y-32">
					{projects.map((project, index) => (
						<div
							key={project.id}
							data-project={project.id}
							className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
						>
							<motion.div
								initial={{ opacity: 0, y: 100 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, ease: "easeOut" }}
								viewport={{ once: true, margin: "-100px" }}
								className={`order-1 ${
									index % 2 === 0 ? "md:order-1" : "md:order-2"
								}`}
								data-scroll
								data-scroll-speed="0.1"
							>
								<div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-xl group">
									<div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-violet-500/20 mix-blend-overlay z-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									<Image
										src={project.image || "/placeholder.svg"}
										alt={project.title}
										fill
										className="object-cover transition-transform duration-700 group-hover:scale-105"
										sizes="(max-width: 768px) 100vw, 50vw"
									/>
									<div className="absolute bottom-4 right-4 z-20 flex space-x-2">
										<Button
											size="icon"
											variant="outline"
											className="bg-black/50 backdrop-blur-sm border-white/20 hover:bg-white/10"
											data-cursor-hover
											onClick={() => handleProjectClick(project.github_url)}
										>
											<Github className="h-4 w-4" />
										</Button>
										<Button
											size="icon"
											variant="outline"
											className="bg-black/50 backdrop-blur-sm border-white/20 hover:bg-white/10"
											data-cursor-hover
											onClick={() => handleProjectClick(project.url)}
										>
											<ExternalLink className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 100 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
								viewport={{ once: true, margin: "-100px" }}
								className={`order-2 ${
									index % 2 === 0 ? "md:order-2" : "md:order-1"
								}`}
								data-scroll
								data-scroll-speed="0.2"
							>
								<h3 className="text-2xl md:text-3xl font-bold mb-4">
									{project.title}
								</h3>
								<p className="text-gray-300 mb-6">{project.description}</p>

								<div className="flex flex-wrap gap-2 mb-8">
									{project.tags.map((tag, i) => (
										<span
											key={i}
											className="px-3 py-1 flex items-center gap-2 justify-center text-sm bg-white/5 backdrop-blur-sm rounded-full border border-white/10"
										>
											{tag.title}
											{tag.icon}
										</span>
									))}
								</div>

								<Button
									className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-0"
									data-cursor-hover
									onClick={() => handleProjectClick(project.url)}
								>
									View Project <ArrowUpRight className="ml-2 h-4 w-4" />
								</Button>
							</motion.div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
