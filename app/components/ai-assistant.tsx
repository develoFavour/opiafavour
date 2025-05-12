"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, X } from "lucide-react";

type Message = {
	role: "user" | "assistant";
	content: string;
};

export function AIAssistant() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<Message[]>([
		{
			role: "assistant",
			content: "Hi there! Welcome to my portfolio. How can I help you today?",
		},
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const toggleOpen = () => setIsOpen(!isOpen);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!input.trim()) return;

		const userMessage: Message = { role: "user", content: input };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		// Simulate AI response
		setTimeout(() => {
			const assistantMessage: Message = {
				role: "assistant",
				content:
					"This is a simulated response. In a real implementation, this would use the Vercel AI SDK to generate a response based on your portfolio content.",
			};
			setMessages((prev) => [...prev, assistantMessage]);
			setIsLoading(false);
		}, 1000);
	};

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	return (
		<>
			<Button
				onClick={toggleOpen}
				className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-lg"
				size="icon"
				data-cursor-hover
			>
				<Bot className="h-6 w-6" />
			</Button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 20, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 20, scale: 0.95 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="fixed bottom-24 right-6 z-50 w-[350px] md:w-[400px] rounded-xl bg-black/80 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden"
					>
						<div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
							<div className="flex items-center space-x-2">
								<div className="p-1.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600">
									<Bot className="h-4 w-4 text-white" />
								</div>
								<h3 className="font-medium">Portfolio Assistant</h3>
							</div>
							<Button
								onClick={toggleOpen}
								variant="ghost"
								size="icon"
								className="h-8 w-8 rounded-full hover:bg-white/10"
								data-cursor-hover
							>
								<X className="h-4 w-4" />
							</Button>
						</div>

						<div className="h-[350px] overflow-y-auto p-4 space-y-4">
							{messages.map((message, index) => (
								<div
									key={index}
									className={`flex ${
										message.role === "user" ? "justify-end" : "justify-start"
									}`}
								>
									<div
										className={`max-w-[80%] rounded-lg p-3 ${
											message.role === "user"
												? "bg-gradient-to-r from-blue-600 to-violet-600 text-white"
												: "bg-white/10 border border-white/10"
										}`}
									>
										<p className="text-sm">{message.content}</p>
									</div>
								</div>
							))}

							{isLoading && (
								<div className="flex justify-start">
									<div className="max-w-[80%] rounded-lg p-3 bg-white/10 border border-white/10">
										<div className="flex space-x-1">
											<div
												className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
												style={{ animationDelay: "0ms" }}
											></div>
											<div
												className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
												style={{ animationDelay: "150ms" }}
											></div>
											<div
												className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
												style={{ animationDelay: "300ms" }}
											></div>
										</div>
									</div>
								</div>
							)}

							<div ref={messagesEndRef} />
						</div>

						<form
							onSubmit={handleSubmit}
							className="p-4 border-t border-white/10 bg-white/5"
						>
							<div className="flex space-x-2">
								<Input
									value={input}
									onChange={(e) => setInput(e.target.value)}
									placeholder="Ask me anything..."
									className="bg-white/5 border-white/10 focus-visible:ring-blue-500"
								/>
								<Button
									type="submit"
									size="icon"
									className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
									disabled={isLoading}
									data-cursor-hover
								>
									<Send className="h-4 w-4" />
								</Button>
							</div>
						</form>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
