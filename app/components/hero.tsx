"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLocomotiveScroll } from "@/app/components/locomotive-scroll-provider";

export function Hero() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const subheadingRef = useRef<HTMLParagraphElement>(null);
	const { scrollToSection } = useLocomotiveScroll();

	useEffect(() => {
		if (typeof window === "undefined") return;

		gsap.registerPlugin(ScrollTrigger);

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: sectionRef.current,
				start: "top top",
				end: "bottom top",
				scrub: 1,
				scroller: "[data-scroll-container]",
			},
		});

		tl.to(headingRef.current, {
			y: 100,
			opacity: 0.2,
			ease: "power2.inOut",
		});

		tl.to(
			subheadingRef.current,
			{
				y: 50,
				opacity: 0,
				ease: "power2.inOut",
			},
			"<"
		);

		return () => {
			tl.kill();
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	}, []);

	return (
		<section
			ref={sectionRef}
			className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
			id="home"
			data-scroll-section
		>
			<div className="absolute inset-0 z-0">
				<div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-black to-blue-900/20" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,rgba(0,0,0,0.5)_100%)]" />
			</div>

			<div className="container relative z-10 px-4 mx-auto text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className="mb-6"
					data-scroll
					data-scroll-speed="0.1"
				>
					<span className="inline-block px-3 py-1 text-xs font-medium tracking-wider text-white uppercase bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
						Portfolio 2024
					</span>
				</motion.div>

				<h1
					ref={headingRef}
					className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-violet-200"
					data-scroll
					data-scroll-speed="0.3"
				>
					<motion.span
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 1, delay: 0.2 }}
					>
						Favour
					</motion.span>{" "}
					<motion.span
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 1, delay: 0.4 }}
						className="relative inline-block bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent"
					>
						Opia
						<span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-violet-500"></span>
					</motion.span>
				</h1>

				<p
					ref={subheadingRef}
					className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 mb-8"
					data-scroll
					data-scroll-speed="0.5"
				>
					<motion.span
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 1, delay: 0.6 }}
					>
						Software Developer crafting immersive digital experiences with
						cutting-edge technologies and creative design solutions.
					</motion.span>
				</p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
					className="flex flex-col sm:flex-row gap-4 justify-center"
					data-scroll
					data-scroll-speed="0.7"
				>
					<Button
						size="lg"
						className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-0"
						data-cursor-hover
						onClick={() => scrollToSection("projects")}
					>
						View Projects <ArrowRight className="ml-2 h-4 w-4" />
					</Button>
					<Button
						size="lg"
						variant="outline"
						className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10"
						data-cursor-hover
						onClick={() => scrollToSection("contact")}
					>
						Contact Me
					</Button>
				</motion.div>
			</div>

			<div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 1,
						delay: 1.2,
						repeat: Number.POSITIVE_INFINITY,
						repeatType: "reverse",
						repeatDelay: 0.5,
					}}
					className="flex flex-col items-center cursor-pointer"
					onClick={() => scrollToSection("about")}
					data-scroll
					data-scroll-speed="0.9"
				>
					<span className="text-sm text-gray-400 mb-2">Scroll Down</span>
					<div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
						<motion.div
							className="w-1 h-1 bg-white rounded-full"
							animate={{
								y: [0, 12, 0],
							}}
							transition={{
								duration: 1.5,
								repeat: Number.POSITIVE_INFINITY,
								ease: "easeInOut",
							}}
						/>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
