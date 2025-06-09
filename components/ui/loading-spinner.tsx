"use client";

import { motion } from "framer-motion";

export function LoadingSpinner() {
	return (
		<div className="flex items-center justify-center">
			<motion.div
				className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full"
				animate={{ rotate: 360 }}
				transition={{
					duration: 1,
					repeat: Number.POSITIVE_INFINITY,
					ease: "linear",
				}}
			/>
		</div>
	);
}
