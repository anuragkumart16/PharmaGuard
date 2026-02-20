"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Dna } from "lucide-react";

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    rotation: number;
    speedX: number;
    speedY: number;
    opacity: number;
}

export default function DnaBackground() {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize particles
        const initialParticles: Particle[] = Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 20 + 20,
            rotation: Math.random() * 360,
            speedX: (Math.random() - 0.5) * 0.05,
            speedY: (Math.random() - 0.5) * 0.05,
            opacity: Math.random() * 0.2 + 0.15,
        }));
        setParticles(initialParticles);

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setParticles((prev) =>
                prev.map((p) => {
                    // Drifting movement
                    let nextX = p.x + p.speedX;
                    let nextY = p.y + p.speedY;

                    // Mouse reactivity: subtle attraction/repulsion
                    const dx = mousePosition.x - p.x;
                    const dy = mousePosition.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 20) {
                        nextX -= dx * 0.001;
                        nextY -= dy * 0.001;
                    }

                    // Boundary check (wrap around)
                    if (nextX < 0) nextX = 100;
                    if (nextX > 100) nextX = 0;
                    if (nextY < 0) nextY = 100;
                    if (nextY > 100) nextY = 0;

                    return { ...p, x: nextX, y: nextY, rotation: p.rotation + 0.1 };
                })
            );
        }, 50);

        return () => clearInterval(interval);
    }, [mousePosition]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
        >
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute text-primary"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        opacity: p.opacity,
                        rotate: p.rotation,
                    }}
                    animate={{
                        x: (mousePosition.x - 50) * (p.size / 100),
                        y: (mousePosition.y - 50) * (p.size / 100),
                    }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                >
                    <Dna size={p.size} strokeWidth={1.5} />
                </motion.div>
            ))}
        </div>
    );
}
