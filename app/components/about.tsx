"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
	SiExpo,
	SiExpress,
	SiJavascript,
	SiMongodb,
	SiNextdotjs,
	SiTypescript,
} from "react-icons/si";
import Image from "next/image";
import { FaReact } from "react-icons/fa";
import { TbBrandThreejs } from "react-icons/tb";
import { FiFramer } from "react-icons/fi";
import { FaCircleNodes, FaGolang } from "react-icons/fa6";
import { RiNodejsLine, RiTailwindCssFill } from "react-icons/ri";
// import {} from "lucide-react";

export function About() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const textRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLDivElement>(null);
	const [isMounted, setIsMounted] = useState(false);

	// Use regular scroll instead of Framer Motion's useScroll for better compatibility
	// with Locomotive Scroll
	// const [scrollProgress, setScrollProgress] = useState(0);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isMounted) return;

		gsap.registerPlugin(ScrollTrigger);

		// Small delay to ensure DOM is ready
		const timer = setTimeout(() => {
			const splitTextAnimation = () => {
				const textElements = textRef.current?.querySelectorAll("p");

				if (!textElements) return;

				textElements.forEach((text, i) => {
					gsap.fromTo(
						text,
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
								trigger: text,
								start: "top 80%",
								toggleActions: "play none none none",
								scroller: "[data-scroll-container]",
							},
							delay: i * 0.1,
						}
					);
				});
			};

			const imageAnimation = () => {
				if (!imageRef.current) return;

				gsap.fromTo(
					imageRef.current,
					{
						clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
					},
					{
						clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
						duration: 1.2,
						ease: "power3.inOut",
						scrollTrigger: {
							trigger: imageRef.current,
							start: "top 70%",
							toggleActions: "play none none none",
							scroller: "[data-scroll-container]",
						},
					}
				);
			};

			splitTextAnimation();
			imageAnimation();
		}, 500);

		return () => {
			clearTimeout(timer);
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	}, [isMounted]);

	return (
		<section
			ref={sectionRef}
			className="relative py-24 md:py-32 min-h-screen overflow-hidden bg-black"
			id="about"
			data-scroll-section
		>
			<div className="absolute inset-0 z-0">
				<div className="absolute inset-0 bg-gradient-to-tl from-blue-900/10 via-black to-violet-900/10" />
			</div>

			<div className="container mx-auto px-4">
				<h2
					className="text-4xl md:text-5xl font-bold mb-12 text-center"
					data-scroll
					data-scroll-speed="0.1"
				>
					<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
						About Me
					</span>
					<div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 to-violet-500 mt-4"></div>
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
					<motion.div
						ref={textRef}
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="order-2 md:order-1"
						data-scroll
						data-scroll-speed="0.3"
					>
						<div className="space-y-4 text-gray-300">
							<p>
							I&apos;m a creative fullstack developer with a passion for building immersive digital experiences that blend cutting-edge technology with thoughtful design.,
			
							</p>
							<p>
							With 2+ years of experience in frontend and backend development, I specialize in crafting engaging web applications and interactive user interfaces,
							with expertise in frontend and backend development, 3D graphics, and interactive animations, I create websites that not only look stunning but also provide meaningful user experiences
			
							</p>
							<p>
								My approach combines technical precision with artistic vision,
								resulting in digital products that stand out in today&apos;s
								crowded online landscape.
							</p>
						</div>

						<div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
							{[
								{ title: "Next.js", icon: <SiNextdotjs /> },
								{ title: "React", icon: <FaReact /> },
								{ title: "React Native", icon: <FaReact /> },
								{ title: "Expo", icon: <SiExpo /> },
								{ title: "Three.js", icon: <TbBrandThreejs /> },
								{ title: "Framer Motion", icon: <FiFramer /> },
								{ title: "GSAP", icon: <FaCircleNodes /> },
								{ title: "TypeScript", icon: <SiTypescript /> },
								{ title: "Javascript", icon: <SiJavascript /> },
								{ title: "Node.js", icon: <RiNodejsLine /> },
								{ title: "Express.js", icon: <SiExpress /> },
								{ title: "Golang", icon: <FaGolang /> },
								{ title: "Tailwind CSS", icon: <RiTailwindCssFill /> },
								{ title: "MongoDB", icon: <SiMongodb /> },
							].map((skill, i) => (
								<div
									key={i}
									className="px-4 py-2 flex items-center gap-2 justify-center bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 text-center"
								>
									{skill.title}
									{skill.icon}
								</div>
							))}
						</div>
					</motion.div>

					<motion.div
						ref={imageRef}
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						viewport={{ once: true }}
						className="relative order-1 md:order-2 h-[400px] md:h-[500px] overflow-hidden rounded-2xl"
						data-scroll
						data-scroll-speed="-0.2"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-violet-500/20 mix-blend-overlay z-10 rounded-2xl"></div>
						<Image
							src="/assets/favour-opia.jpeg"
							alt="Favour Opia"
							fill
							className="object-cover"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
