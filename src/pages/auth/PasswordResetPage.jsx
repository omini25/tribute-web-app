"use client"
import { useState } from "react"
import { z } from "zod"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label" // Import Label
import { Card, CardContent } from "@/components/ui/card" // Import CardContent
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Link } from "react-router-dom"
import logo from "@/assets/images/remember-me.png" // Assuming you want to use the logo
import { server } from "@/server.js"
import { AuthHeader } from "@/components/auth/AuthHeader.jsx" // Import AuthHeader
import { AuthFooter } from "@/components/auth/AuthFooter.jsx" // Import AuthFooter
import {useRouter} from 'next/navigation'; // OR 'next/router' for older Next.js Pages Router

const formSchema = z.object({
    email: z.string().email("Please enter a valid email address")
})

export default function PasswordResetPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault()
        setError("")
        setSuccess(false)

        try {
            formSchema.parse({ email })
            setIsLoading(true)

            const response = await fetch(`${server}/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to send password reset email")
            }

            setSuccess(true)
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors[0].message)
            } else if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("An unexpected error occurred. Please try again.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-white"> {/* Matches example LoginPage root style */}
            <AuthHeader />
            <main className="flex-1 flex items-center justify-center bg-[#f8f4f0] py-16 sm:py-20 lg:py-24 px-4"> {/* Matches example LoginSection style */}
                <div className="w-full max-w-md"> {/* Constrains card width */}
                    <Card className="border-none shadow-lg bg-white"> {/* Matches example Card style */}
                        <CardContent className="p-8 sm:p-10"> {/* Matches example CardContent padding */}
                            <div className="text-center mb-8">
                                <Link to="/"> {/* Link logo to homepage */}
                                    <img src={logo} alt="Remember Me Logo" className="w-28 h-auto mx-auto mb-6" />
                                </Link>
                                <h2 className="text-2xl font-serif font-medium text-[#2a3342]">
                                    Reset Your Password
                                </h2>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Enter your email and we&apos;ll send you a reset link.
                                </p>
                            </div>

                            {success ? (
                                <Alert className="bg-green-50 border-green-200 text-green-700">
                                    <AlertDescription>
                                        If an account with <span className="font-semibold">{email}</span> exists, a password reset email has been sent. Please check your inbox (and spam folder).
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-[#4a5568] font-medium">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                            disabled={isLoading}
                                            className="w-full border-gray-300 focus:border-[#fcd34d] focus:ring-[#fcd34d]"
                                        />
                                    </div>

                                    {error && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    <Button type="submit" className="w-full bg-[#fcd34d] hover:bg-[#645a52] text-white" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending Link...
                                            </>
                                        ) : (
                                            "Send Reset Link"
                                        )}
                                    </Button>
                                </form>
                            )}

                            {!success && (
                                <div className="mt-8 text-center">
                                    <Link to="/login" className="text-[#fcd34d] hover:text-[#645a52] font-medium inline-flex items-center">
                                        <ArrowLeft className="mr-1.5 h-4 w-4" />
                                        Back to Login
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
            <AuthFooter />
        </div>
    )
}