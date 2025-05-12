"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, Instagram, Linkedin, Mail, Send, Twitter } from "lucide-react";

export function Contact() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const [formState, setFormState] = useState({
		name: "",
		email: "",
		message: "",
	});

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"],
	});

	const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
	const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormState({
			...formState,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission
		console.log(formState);
	};

	useEffect(() => {
		if (typeof window === "undefined") return;

		gsap.registerPlugin(ScrollTrigger);

		const formElements = formRef.current?.querySelectorAll(
			"input, textarea, button"
		);

		if (!formElements) return;

		gsap.fromTo(
			formElements,
			{
				y: 30,
				opacity: 0,
			},
			{
				y: 0,
				opacity: 1,
				duration: 0.6,
				stagger: 0.1,
				ease: "power3.out",
				scrollTrigger: {
					trigger: formRef.current,
					start: "top 80%",
					toggleActions: "play none none none",
				},
			}
		);

		return () => {
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	}, []);

	return (
		<section
			ref={sectionRef}
			className="relative py-24 md:py-32 bg-black"
			data-scroll-section
		>
			<div className="absolute inset-0 z-0">
				<div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-black to-violet-900/10" />
			</div>

			<div className="container mx-auto px-4">
				<motion.div
					style={{ y, opacity }}
					className="text-center mb-16"
					data-scroll
					data-scroll-speed="0.2"
				>
					<h2 className="text-3xl md:text-5xl font-bold mb-6 inline-block">
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
							Get In Touch
						</span>
					</h2>
					<p className="max-w-2xl mx-auto text-gray-300">
						Have a project in mind or want to discuss a potential collaboration?
						I&apos;d love to hear from you.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
						viewport={{ once: true, margin: "-100px" }}
						className="space-y-8"
						data-scroll
						data-scroll-speed="0.1"
					>
						<div>
							<h3 className="text-2xl font-bold mb-4">Contact Information</h3>
							<p className="text-gray-300 mb-6">
								Feel free to reach out through the form or directly via email or
								social media.
							</p>
						</div>

						<div className="flex items-center space-x-3">
							<div className="p-3 rounded-full bg-white/5 backdrop-blur-sm">
								<Mail className="h-5 w-5" />
							</div>
							<span className="text-gray-300">hello@example.com</span>
						</div>

						<div>
							<h4 className="text-lg font-medium mb-4">Connect with me</h4>
							<div className="flex space-x-4">
								{[Twitter, Github, Linkedin, Instagram].map((Icon, index) => (
									<Button
										key={index}
										size="icon"
										variant="outline"
										className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 hover:border-white/20"
										data-cursor-hover
									>
										<Icon className="h-5 w-5" />
									</Button>
								))}
							</div>
						</div>

						<div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
							<h4 className="text-lg font-medium mb-4">Office Hours</h4>
							<p className="text-gray-300 mb-2">Monday - Friday: 9am - 6pm</p>
							<p className="text-gray-300">Weekend: By appointment</p>
						</div>
					</motion.div>

					<motion.form
						ref={formRef}
						onSubmit={handleSubmit}
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
						viewport={{ once: true, margin: "-100px" }}
						className="space-y-6 p-6 md:p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
						data-scroll
						data-scroll-speed="0.2"
					>
						<div className="space-y-4">
							<label className="text-sm font-medium block">Your Name</label>
							<Input
								name="name"
								value={formState.name}
								onChange={handleChange}
								className="bg-white/5 border-white/10 focus-visible:ring-blue-500"
								placeholder="John Doe"
								required
							/>
						</div>

						<div className="space-y-4">
							<label className="text-sm font-medium block">Email Address</label>
							<Input
								name="email"
								type="email"
								value={formState.email}
								onChange={handleChange}
								className="bg-white/5 border-white/10 focus-visible:ring-blue-500"
								placeholder="john@example.com"
								required
							/>
						</div>

						<div className="space-y-4">
							<label className="text-sm font-medium block">Your Message</label>
							<Textarea
								name="message"
								value={formState.message}
								onChange={handleChange}
								className="bg-white/5 border-white/10 focus-visible:ring-blue-500 min-h-[120px]"
								placeholder="Tell me about your project..."
								required
							/>
						</div>

						<Button
							type="submit"
							className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-0"
							data-cursor-hover
						>
							Send Message <Send className="ml-2 h-4 w-4" />
						</Button>
					</motion.form>
				</div>
			</div>
		</section>
	);
}
