import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Project {
	id: string;
	title: string;
	description: string;
	url?: string;
	github_url?: string;
	technologies: string[];
	image?: string;
	featured: boolean;
	created_at: string;
	updated_at: string;
}

export interface Skill {
	id: string;
	title: string;
	description: string;
	technologies: string[];
	category: string;
	level: number;
	created_at: string;
	updated_at: string;
}

export interface Experience {
	id: string;
	role: string;
	company: string;
	location: string;
	period: string;
	duration: string;
	description: string;
	skills: string[];
	current: boolean;
	created_at: string;
	updated_at: string;
}
