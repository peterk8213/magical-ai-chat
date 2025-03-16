"use client"

import { useEffect, useRef } from "react"

interface SparkleParticle {
  x: number
  y: number
  size: number
  color: string
  speedX: number
  speedY: number
  life: number
  maxLife: number
}

export function MagicalSparkles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Sparkle colors
    const colors = [
      "#D9BCA6", // Dark Vanilla
      "#787775", // Sonic Silver
      "#626260", // Granite Gray
      "#40403E", // Black Olive
      "#393939", // Dark Grey
    ]

    // Particles array
    const particles: SparkleParticle[] = []

    // Create particles
    const createParticles = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x,
          y,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: Math.random() * 2 - 1,
          speedY: Math.random() * 2 - 1,
          life: 0,
          maxLife: Math.random() * 60 + 60,
        })
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        p.life++
        if (p.life >= p.maxLife) {
          particles.splice(i, 1)
          i--
          continue
        }

        p.x += p.speedX
        p.y += p.speedY

        // Fade out
        const opacity = 1 - p.life / p.maxLife

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle =
          p.color +
          Math.floor(opacity * 255)
            .toString(16)
            .padStart(2, "0")
        ctx.fill()
      }

      // Randomly create particles
      if (Math.random() < 0.1) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        createParticles(x, y, 1)
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
}

