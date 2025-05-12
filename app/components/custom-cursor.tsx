"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isHovering, setIsHovering] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		// Set mounted state to true when component mounts on client
		setIsMounted(true);

		const updatePosition = (e: MouseEvent) => {
			setPosition({ x: e.clientX, y: e.clientY });
			if (!isVisible) setIsVisible(true);
		};

		const handleMouseEnter = () => {
			setIsVisible(true);
		};

		const handleMouseLeave = () => {
			setIsVisible(false);
		};

		const handleHoverStart = (e: MouseEvent) => {
			if (
				(e.target as HTMLElement).tagName === "A" ||
				(e.target as HTMLElement).tagName === "BUTTON" ||
				(e.target as HTMLElement).closest("[data-cursor-hover]")
			) {
				setIsHovering(true);
			} else {
				setIsHovering(false);
			}
		};

		window.addEventListener("mousemove", updatePosition);
		window.addEventListener("mouseenter", handleMouseEnter);
		window.addEventListener("mouseleave", handleMouseLeave);
		window.addEventListener("mouseover", handleHoverStart);

		return () => {
			window.removeEventListener("mousemove", updatePosition);
			window.removeEventListener("mouseenter", handleMouseEnter);
			window.removeEventListener("mouseleave", handleMouseLeave);
			window.removeEventListener("mouseover", handleHoverStart);
		};
	}, [isVisible]); // Only depend on isVisible, not position

	// Don't render anything on the server or before mounting
	if (!isMounted) return null;

	return (
		<motion.div
			className="fixed top-0 left-0 z-50 pointer-events-none mix-blend-difference"
			animate={{
				x: position.x,
				y: position.y,
				opacity: isVisible ? 1 : 0,
				scale: isHovering ? 1.5 : 1,
			}}
			transition={{
				type: "spring",
				damping: 20,
				stiffness: 300,
				mass: 0.5,
			}}
		>
			<div className="relative flex items-center justify-center">
				<div className="absolute w-6 h-6 bg-white rounded-full" />
				<motion.div
					className="absolute w-10 h-10 border border-white rounded-full"
					animate={{
						scale: isHovering ? 1.2 : 0.5,
						opacity: isHovering ? 1 : 0,
					}}
				/>
			</div>
		</motion.div>
	);
}
