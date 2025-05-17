"use client";

import type React from "react";
import { useEffect, useRef, useState, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Define proper types for Locomotive Scroll
// interface DeviceOptions {
// 	smooth: boolean;
// 	breakpoint: number;
// }

// interface LocomotiveScrollOptions {
// 	el: HTMLElement;
// 	smooth?: boolean;
// 	multiplier?: number;
// 	class?: string;
// 	lerp?: number;
// 	getDirection?: boolean;
// 	getSpeed?: boolean;
// 	smartphone?: DeviceOptions;
// 	tablet?: DeviceOptions;
// }

interface LocomotiveScrollInstance {
	destroy: () => void;
	update: () => void;
	on: (event: string, callback: () => void) => void;
	scrollTo: (
		target: string | HTMLElement | number,
		options?: {
			offset?: number;
			duration?: number;
			disableLerp?: boolean;
			easing?: number[] | ((t: number) => number);
		}
	) => void;
	scroll: {
		instance: {
			scroll: {
				y: number;
			};
		};
	};
}

interface ScrollContextType {
	scrollToSection: (sectionId: string) => void;
}

const ScrollContext = createContext<ScrollContextType>({
	scrollToSection: () => {},
});

export function useLocomotiveScroll() {
	return useContext(ScrollContext);
}

interface LocomotiveScrollProviderProps {
	children: React.ReactNode;
}

export function LocomotiveScrollProvider({
	children,
}: LocomotiveScrollProviderProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isMounted, setIsMounted] = useState(false);
	const pathname = usePathname();
	const locomotiveScrollRef = useRef<LocomotiveScrollInstance | null>(null);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isMounted) return;

		// Register GSAP plugins
		gsap.registerPlugin(ScrollTrigger);

		// Import and initialize Locomotive Scroll with a delay
		const initLocomotiveScroll = async () => {
			try {
				const LocomotiveScroll = (await import("locomotive-scroll")).default;

				// Cleanup previous instance
				if (locomotiveScrollRef.current) {
					locomotiveScrollRef.current.destroy();
					locomotiveScrollRef.current = null;
				}

				if (!containerRef.current) return;

				// Create new instance with minimal config
				// Using a more direct type assertion to bypass TypeScript's strict checking
				const locoScroll = new LocomotiveScroll({
					el: containerRef.current,
					smooth: true,
					lerp: 0.1, // Lower value for smoother scrolling
					multiplier: 1,
					class: "is-revealed",
					getDirection: true,
					getSpeed: true,
					smartphone: {
						smooth: true,
						// breakpoint: 767,
					},
					tablet: {
						smooth: true,
						breakpoint: 1024,
					},
				}) as unknown as LocomotiveScrollInstance;

				// Store the instance
				locomotiveScrollRef.current = locoScroll;

				// Update ScrollTrigger when locomotive scroll updates
				locoScroll.on("scroll", () => {
					ScrollTrigger.update();
				});

				// Setup ScrollTrigger to use Locomotive Scroll
				ScrollTrigger.scrollerProxy(containerRef.current, {
					scrollTop(value) {
						if (arguments.length && value !== undefined) {
							locoScroll.scrollTo(value as number, {
								duration: 0,
								disableLerp: true,
							});
							return;
						}
						return locoScroll.scroll.instance.scroll.y;
					},
					getBoundingClientRect() {
						return {
							top: 0,
							left: 0,
							width: window.innerWidth,
							height: window.innerHeight,
						};
					},
					pinType: containerRef.current.style.transform ? "transform" : "fixed",
				});

				// Each time the window updates, refresh ScrollTrigger and Locomotive Scroll
				const refreshHandler = () => {
					locoScroll.update();
				};
				ScrollTrigger.addEventListener("refresh", refreshHandler);

				// After everything is set up, refresh ScrollTrigger
				ScrollTrigger.refresh();

				// Update on resize
				const resizeHandler = () => {
					locoScroll.update();
					ScrollTrigger.refresh();
				};
				window.addEventListener("resize", resizeHandler);

				// Force update after a short delay to ensure all content is properly measured
				setTimeout(() => {
					locoScroll.update();
					ScrollTrigger.refresh();
				}, 1000);

				// Force update multiple times to ensure all content is properly measured
				const forceUpdateInterval = setInterval(() => {
					if (locoScroll) {
						locoScroll.update();
						ScrollTrigger.refresh();
					}
				}, 1000);

				// Clear the interval after 5 seconds
				setTimeout(() => {
					clearInterval(forceUpdateInterval);
				}, 5000);

				return () => {
					if (locoScroll) {
						locoScroll.destroy();
						locomotiveScrollRef.current = null;
					}
					ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
					ScrollTrigger.clearScrollMemory();
					ScrollTrigger.removeEventListener("refresh", refreshHandler);
					window.removeEventListener("resize", resizeHandler);
				};
			} catch (error) {
				console.error("Failed to initialize Locomotive Scroll:", error);
			}
		};

		// Delay initialization to ensure DOM is fully ready
		const timer = setTimeout(() => {
			initLocomotiveScroll();
		}, 500); // Increased delay for better initialization

		return () => {
			clearTimeout(timer);
			if (locomotiveScrollRef.current) {
				locomotiveScrollRef.current.destroy();
				locomotiveScrollRef.current = null;
			}
		};
	}, [isMounted, pathname]);

	// Handle navigation
	const scrollToSection = (sectionId: string) => {
		if (locomotiveScrollRef.current) {
			const section = document.getElementById(sectionId);
			if (section) {
				locomotiveScrollRef.current.scrollTo(section, {
					offset: 0,
					duration: 1000,
					easing: [0.25, 0.0, 0.35, 1.0],
				});
			}
		} else {
			// Fallback to native scrolling if locomotive scroll is not available
			const section = document.getElementById(sectionId);
			if (section) {
				section.scrollIntoView({ behavior: "smooth" });
			}
		}
	};

	if (!isMounted) {
		return <>{children}</>;
	}

	return (
		<ScrollContext.Provider value={{ scrollToSection }}>
			<div ref={containerRef} data-scroll-container>
				{children}
			</div>
		</ScrollContext.Provider>
	);
}
