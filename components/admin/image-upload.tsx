"use client";

import type React from "react";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload, X, ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploadProps {
	value: string;
	onChange: (url: string) => void;
	bucket: string;
	className?: string;
}

export function ImageUpload({
	value,
	onChange,
	bucket,
	className,
}: ImageUploadProps) {
	const [uploading, setUploading] = useState(false);
	const [dragActive, setDragActive] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const uploadImage = async (file: File) => {
		try {
			setUploading(true);

			// Validate file type
			if (!file.type.startsWith("image/")) {
				toast.error("Invalid file type", {
					description: "Please upload an image file",
				});
				return;
			}

			// Validate file size (5MB max)
			if (file.size > 5 * 1024 * 1024) {
				toast.error("File too large", {
					description: "Please upload an image smaller than 5MB",
				});
				return;
			}

			// Generate unique filename
			const fileExt = file.name.split(".").pop();
			const fileName = `${Date.now()}-${Math.random()
				.toString(36)
				.substring(2)}.${fileExt}`;

			// Upload to Supabase Storage
			const { data, error } = await supabase.storage
				.from(bucket)
				.upload(fileName, file, {
					cacheControl: "3600",
					upsert: false,
				});

			if (error) throw error;

			// Get public URL
			const {
				data: { publicUrl },
			} = supabase.storage.from(bucket).getPublicUrl(data.path);

			onChange(publicUrl);
			toast.success("Success", {
				description: "Image uploaded successfully",
			});
		} catch (error) {
			console.error("Error uploading image:", error);
			toast.error("Upload failed", {
				description: "Failed to upload image. Please try again.",
			});
		} finally {
			setUploading(false);
		}
	};

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			uploadImage(e.dataTransfer.files[0]);
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			uploadImage(e.target.files[0]);
		}
	};

	const removeImage = () => {
		onChange("");
	};

	return (
		<div className={cn("space-y-4", className)}>
			<AnimatePresence>
				{value ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						className="relative group"
					>
						<div className="relative h-48 rounded-lg overflow-hidden bg-gray-800 border border-white/10">
							<Image
								height={100}
								width={100}
								src={value || "/placeholder.svg"}
								alt="Uploaded"
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
								<Button
									type="button"
									variant="destructive"
									size="sm"
									onClick={removeImage}
									className="bg-red-500/80 hover:bg-red-500"
								>
									<X className="h-4 w-4 mr-1" />
									Remove
								</Button>
							</div>
						</div>
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className={cn(
							"relative h-48 border-2 border-dashed rounded-lg transition-all duration-300",
							dragActive
								? "border-blue-500 bg-blue-500/10"
								: "border-white/20 hover:border-white/40",
							uploading && "pointer-events-none opacity-50"
						)}
						onDragEnter={handleDrag}
						onDragLeave={handleDrag}
						onDragOver={handleDrag}
						onDrop={handleDrop}
					>
						<div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
							{uploading ? (
								<div className="space-y-2">
									<div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
									<p className="text-white text-sm">Uploading...</p>
								</div>
							) : (
								<>
									<ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
									<p className="text-white font-medium mb-2">
										Drop your image here
									</p>
									<p className="text-gray-400 text-sm mb-4">
										or click to browse
									</p>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => fileInputRef.current?.click()}
										className="border-white/20 hover:bg-white/10"
									>
										<Upload className="h-4 w-4 mr-2" />
										Choose File
									</Button>
								</>
							)}
						</div>

						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleFileSelect}
							className="hidden"
						/>
					</motion.div>
				)}
			</AnimatePresence>

			<p className="text-xs text-gray-500">
				Supported formats: JPG, PNG, GIF. Max size: 5MB
			</p>
		</div>
	);
}
