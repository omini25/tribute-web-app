"use client"

import { useEffect, useRef } from "react"

export function CandlesBackground() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas dimensions
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        // Candle class
        class Candle {
            constructor(x, y, size) {
                this.x = x
                this.y = y
                this.size = size
                this.flickerSpeed = 0.05 + Math.random() * 0.1
                this.flickerIntensity = 0.5 + Math.random() * 0.5
                this.opacity = 0.1 + Math.random() * 0.1
                this.hue = 30 + Math.random() * 10 // Warm yellow/orange
            }

            draw(ctx, time) {
                const flicker =
                    Math.sin(time * this.flickerSpeed) * this.flickerIntensity
                const size = this.size * (0.9 + flicker * 0.1)

                // Create gradient for glow
                const gradient = ctx.createRadialGradient(
                    this.x,
                    this.y,
                    0,
                    this.x,
                    this.y,
                    size * 2
                )

                gradient.addColorStop(
                    0,
                    `hsla(${this.hue}, 100%, 70%, ${this.opacity})`
                )
                gradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`)

                ctx.fillStyle = gradient
                ctx.beginPath()
                ctx.arc(this.x, this.y, size * 2, 0, Math.PI * 2)
                ctx.fill()
            }
        }

        // Create candles
        const candles = []
        const candleCount = Math.floor((canvas.width * canvas.height) / 20000) // Adjust density

        for (let i = 0; i < candleCount; i++) {
            const x = Math.random() * canvas.width
            const y = Math.random() * canvas.height
            const size = 5 + Math.random() * 10
            candles.push(new Candle(x, y, size))
        }

        // Animation loop
        let animationId
        const startTime = Date.now()

        const animate = () => {
            const time = (Date.now() - startTime) / 1000

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw candles
            candles.forEach(candle => {
                candle.draw(ctx, time)
            })

            animationId = requestAnimationFrame(animate)
        }

        animate()

        // Cleanup
        return () => {
            window.removeEventListener("resize", resizeCanvas)
            cancelAnimationFrame(animationId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        />
    )
}
