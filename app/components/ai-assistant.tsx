"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, X, Minimize2, Maximize2 } from "lucide-react";

type Message = {
	role: "user" | "assistant";
	content: string;
	timestamp?: Date;
};

export function AIAssistant() {
	const [isOpen, setIsOpen] = useState(false);
	const [isMinimized, setIsMinimized] = useState(false);
	const [messages, setMessages] = useState<Message[]>([
		{
			role: "assistant",
			content:
				"Hi there! I'm Favour Opia's AI assistant. I can answer questions about his skills, experience, projects, and background. What would you like to know?",
			timestamp: new Date(),
		},
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const toggleOpen = () => setIsOpen(!isOpen);
	const toggleMinimize = () => setIsMinimized(!isMinimized);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!input.trim() || isLoading) return;

		const userMessage: Message = {
			role: "user",
			content: input.trim(),
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		try {
			const response = await fetch("/api/ai-assistant/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					question: userMessage.content,
					conversationHistory: messages.slice(-5), // Send last 5 messages for context
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			const assistantMessage: Message = {
				role: "assistant",
				content:
					data.answer ||
					"I apologize, but I couldn't process your question. Please try again.",
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, assistantMessage]);
		} catch (error) {
			console.error("Error getting AI response:", error);
			const errorMessage: Message = {
				role: "assistant",
				content:
					"I'm sorry, I'm having trouble connecting right now. Please try again in a moment or feel free to contact Favour directly.",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	// Suggested questions for better UX
	const suggestedQuestions = [
		"What are Favour's main skills?",
		"Tell me about his recent projects",
		"What's his experience with React?",
		"How many years of experience does he have?",
		"What technologies does he work with?",
	];

	const handleSuggestedQuestion = (question: string) => {
		setInput(question);
	};

	return (
		<>
			{/* Chat Toggle Button */}
			<AnimatePresence>
				{!isOpen && (
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="fixed bottom-6 right-6 z-50"
					>
						<Button
							onClick={toggleOpen}
							className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-lg hover:shadow-xl transition-all duration-300"
							size="icon"
							data-cursor-hover
						>
							<Bot className="h-6 w-6" />
							<span className="sr-only">Open AI Assistant</span>
						</Button>

						{/* Notification dot for new users */}
						<div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
							<div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Chat Window */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 20, scale: 0.95 }}
						animate={{
							opacity: 1,
							y: 0,
							scale: 1,
							height: isMinimized ? "60px" : "500px",
						}}
						exit={{ opacity: 0, y: 20, scale: 0.95 }}
						transition={{ duration: 0.3, ease: "easeOut" }}
						className="fixed bottom-6 right-6 z-50 w-[350px] md:w-[400px] rounded-xl bg-black/90 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden"
					>
						{/* Header */}
						<div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-violet-600/20">
							<div className="flex items-center space-x-3">
								<div className="relative">
									<div className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600">
										<Bot className="h-4 w-4 text-white" />
									</div>
									<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
								</div>
								<div>
									<h3 className="font-semibold text-white">
										Portfolio Assistant
									</h3>
									<p className="text-xs text-gray-300">Ask me about Favour</p>
								</div>
							</div>
							<div className="flex items-center space-x-1">
								<Button
									onClick={toggleMinimize}
									variant="ghost"
									size="icon"
									className="h-8 w-8 rounded-full hover:bg-white/10 text-white"
									data-cursor-hover
								>
									{isMinimized ? (
										<Maximize2 className="h-4 w-4" />
									) : (
										<Minimize2 className="h-4 w-4" />
									)}
								</Button>
								<Button
									onClick={toggleOpen}
									variant="ghost"
									size="icon"
									className="h-8 w-8 rounded-full hover:bg-white/10 text-white"
									data-cursor-hover
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</div>

						{!isMinimized && (
							<>
								{/* Messages */}
								<div className="h-[350px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
									{messages.map((message, index) => (
										<motion.div
											key={index}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3 }}
											className={`flex ${
												message.role === "user"
													? "justify-end"
													: "justify-start"
											}`}
										>
											<div
												className={`max-w-[85%] rounded-2xl p-3 ${
													message.role === "user"
														? "bg-gradient-to-r from-blue-600 to-violet-600 text-white"
														: "bg-white/10 border border-white/10 text-gray-100"
												}`}
											>
												<p className="text-sm leading-relaxed">
													{message.content}
												</p>
												{message.timestamp && (
													<p className="text-xs opacity-60 mt-1">
														{message.timestamp.toLocaleTimeString([], {
															hour: "2-digit",
															minute: "2-digit",
														})}
													</p>
												)}
											</div>
										</motion.div>
									))}

									{/* Suggested Questions (show only if no conversation yet) */}
									{messages.length === 1 && (
										<div className="space-y-2">
											<p className="text-xs text-gray-400 px-1">Try asking:</p>
											{suggestedQuestions.slice(0, 3).map((question, index) => (
												<button
													key={index}
													onClick={() => handleSuggestedQuestion(question)}
													className="block w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 transition-colors"
												>
													{question}
												</button>
											))}
										</div>
									)}

									{/* Loading indicator */}
									{isLoading && (
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											className="flex justify-start"
										>
											<div className="max-w-[85%] rounded-2xl p-3 bg-white/10 border border-white/10">
												<div className="flex space-x-1">
													{[0, 1, 2].map((i) => (
														<div
															key={i}
															className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
															style={{ animationDelay: `${i * 150}ms` }}
														/>
													))}
												</div>
											</div>
										</motion.div>
									)}

									<div ref={messagesEndRef} />
								</div>

								{/* Input Form */}
								<form
									onSubmit={handleSubmit}
									className="p-4 border-t border-white/10 bg-white/5"
								>
									<div className="flex space-x-2">
										<Input
											value={input}
											onChange={(e) => setInput(e.target.value)}
											placeholder="Ask me anything about Favour..."
											className="bg-white/10 border-white/20 focus-visible:ring-blue-500 text-white placeholder:text-gray-400"
											disabled={isLoading}
										/>
										<Button
											type="submit"
											size="icon"
											className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 disabled:opacity-50"
											disabled={isLoading || !input.trim()}
											data-cursor-hover
										>
											<Send className="h-4 w-4" />
										</Button>
									</div>
									<p className="text-xs text-gray-400 mt-2">
										Powered by AI • Ask about skills, projects, or experience
									</p>
								</form>
							</>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
