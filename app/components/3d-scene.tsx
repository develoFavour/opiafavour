"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Float } from "@react-three/drei";
import * as THREE from "three";

// Simple 3D object instead of loading external model
function SimpleModel({
	position = [0, 0, 0] as [number, number, number],
	scale = 1,
}) {
	const groupRef = useRef<THREE.Group>(null);
	const [hovered, setHovered] = useState(false);
	const [clicked, setClicked] = useState(false);

	useFrame((state) => {
		if (!groupRef.current) return;

		const t = state.clock.getElapsedTime();

		// Apply floating animation
		groupRef.current.position.y = position[1] + Math.sin(t / 1.5) / 10;

		// Apply scale animation
		const targetScale = clicked ? scale * 1.4 : hovered ? scale * 1.2 : scale;
		groupRef.current.scale.x = THREE.MathUtils.lerp(
			groupRef.current.scale.x,
			targetScale,
			0.1
		);
		groupRef.current.scale.y = THREE.MathUtils.lerp(
			groupRef.current.scale.y,
			targetScale,
			0.1
		);
		groupRef.current.scale.z = THREE.MathUtils.lerp(
			groupRef.current.scale.z,
			targetScale,
			0.1
		);

		// Apply rotation animation
		groupRef.current.rotation.y += 0.01; // Continuous slow rotation

		if (clicked) {
			groupRef.current.rotation.y += 0.05; // Faster rotation when clicked
		}
	});

	return (
		<group
			ref={groupRef}
			position={position}
			scale={[scale, scale, scale]}
			onPointerOver={() => setHovered(true)}
			onPointerOut={() => setHovered(false)}
			onClick={() => setClicked(!clicked)}
		>
			{/* Main sphere */}
			<mesh castShadow>
				<sphereGeometry args={[0.5, 32, 32]} />
				<meshStandardMaterial color="#6366f1" roughness={0.2} metalness={0.8} />
			</mesh>

			{/* Orbiting smaller spheres */}
			<group rotation={[0, 0, Math.PI / 6]}>
				<mesh position={[0.8, 0, 0]} castShadow>
					<sphereGeometry args={[0.15, 16, 16]} />
					<meshStandardMaterial
						color="#8b5cf6"
						roughness={0.3}
						metalness={0.6}
					/>
				</mesh>
			</group>

			<group rotation={[0, 0, -Math.PI / 4]}>
				<mesh position={[0.7, 0, 0]} castShadow>
					<sphereGeometry args={[0.1, 16, 16]} />
					<meshStandardMaterial
						color="#3b82f6"
						roughness={0.3}
						metalness={0.6}
					/>
				</mesh>
			</group>

			{/* Ring */}
			<mesh rotation={[Math.PI / 2, 0, 0]}>
				<torusGeometry args={[0.8, 0.05, 16, 100]} />
				<meshStandardMaterial
					color="#a855f7"
					roughness={0.5}
					metalness={0.8}
					emissive="#a855f7"
					emissiveIntensity={0.2}
				/>
			</mesh>
		</group>
	);
}

function AnimatedText({
	position,
	children,
	delay = 0,
}: {
	position: [number, number, number];
	children: React.ReactNode;
	delay?: number;
}) {
	const textRef = useRef<THREE.Mesh>(null);
	const startTime = useRef<number | null>(null);

	useFrame(({ clock }) => {
		if (!textRef.current) return;

		if (startTime.current === null) {
			startTime.current = clock.elapsedTime + delay;
		}

		const elapsed = Math.max(0, clock.elapsedTime - startTime.current);
		const duration = 1;
		const progress = Math.min(elapsed / duration, 1);

		// Ease out cubic
		const eased = 1 - Math.pow(1 - progress, 3);

		// Animate position
		textRef.current.position.y = position[1] - (1 - eased);

		// Animate opacity
		if (textRef.current.material && !Array.isArray(textRef.current.material)) {
			(textRef.current.material as THREE.Material).opacity = eased;
		}
	});

	return (
		<Text
			ref={textRef}
			fontSize={0.5}
			color="white"
			anchorX="center"
			anchorY="middle"
			position={[position[0], position[1] - 1, position[2]]}
			material-transparent={true}
		>
			{children}
		</Text>
	);
}

function Scene() {
	const { camera } = useThree();

	useEffect(() => {
		camera.position.set(0, 0, 5);
	}, [camera]);

	return (
		<>
			<color attach="background" args={["#000000"]} />
			<fog attach="fog" args={["#000000", 5, 15]} />

			<ambientLight intensity={0.5} />
			<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
			<pointLight position={[-10, -10, -10]} intensity={0.5} />

			<SimpleModel position={[0, -0.5, 0]} scale={1.5} />

			<Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
				<AnimatedText position={[0, 1, 0]} delay={0.5}>
					FAVOUR OPIA
				</AnimatedText>
			</Float>

			<Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
				<AnimatedText position={[0, 0.3, 0]} delay={0.8}>
					SOFTWARE DEVELOPER
				</AnimatedText>
			</Float>

			{/* Reduce particle count for better performance */}
			{Array.from({ length: 50 }).map((_, i) => (
				<mesh
					key={i}
					position={[
						(Math.random() - 0.5) * 20,
						(Math.random() - 0.5) * 20,
						(Math.random() - 0.5) * 20,
					]}
				>
					<sphereGeometry args={[0.02, 8, 8]} />
					<meshBasicMaterial color="white" />
				</mesh>
			))}

			<OrbitControls enableZoom={false} enablePan={false} />
		</>
	);
}

export function ThreeDScene() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<div className="h-screen w-full absolute inset-0 z-0 pointer-events-none">
			<Canvas shadows>
				<Scene />
			</Canvas>
		</div>
	);
}
