"use client"
import { useState } from "react"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {Link} from "react-router-dom";
import {AuthHeader} from "@/components/auth/AuthHeader.jsx";
import { AuthFooter } from "@/components/auth/AuthFooter.jsx"


const formSchema = z.object({
    email: z.string().email("Please enter a valid email address")
})

export default function PasswordResetPage() {
    // const router = useRouter()
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault()
        setError("")

        try {
            // Validate the email
            const result = formSchema.parse({ email })

            setIsLoading(true)

            // Send the password reset request to the API
            const response = await fetch("/api/auth/reset-password/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to send password reset email")
            }

            // Show success message
            setSuccess(true)
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors[0].message)
            } else if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("An unexpected error occurred")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <AuthHeader />
            <div className="container flex h-screen max-w-md items-center justify-center">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">Reset Password</CardTitle>
                        <CardDescription>
                            Enter your email address and we'll send you a link to reset your
                            password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {success ? (
                            <Alert className="bg-green-50 border-green-200">
                                <AlertDescription className="text-green-800">
                                    If an account exists with that email, we've sent password reset
                                    instructions to {email}. Please check your inbox and spam
                                    folder.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email Address
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Link to="/login" className="text-sm text-primary hover:underline">
                            Back to Login
                        </Link>
                    </CardFooter>
                </Card>
            </div>
            <AuthFooter />
        </>
    )
}
