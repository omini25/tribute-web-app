"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
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
import {AuthFooter} from "@/components/auth/AuthFooter.jsx";
import {AuthHeader} from "@/components/auth/AuthHeader.jsx";
import { useParams, useSearchParams } from 'react-router-dom';

const formSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
        confirmPassword: z.string()
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    })

export default function PasswordPage({ params }) {
    const router = useRouter()
    const { token } = useParams();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');


    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [isValidatingToken, setIsValidatingToken] = useState(true)
    const [isTokenValid, setIsTokenValid] = useState(false)

    useEffect(() => {
        // Validate the token when the component mounts
        const validateToken = async () => {
            try {
                const response = await fetch(
                    `/api/auth/reset-password/validate?token=${token}`
                )
                const data = await response.json()

                if (response.ok) {
                    setIsTokenValid(true)
                } else {
                    setError(data.message || "Invalid or expired reset link")
                }
            } catch (err) {
                setError("Failed to validate reset link")
            } finally {
                setIsValidatingToken(false)
            }
        }

        validateToken()
    }, [token])

    const handleSubmit = async e => {
        e.preventDefault()
        setError("")

        try {
            // Validate the form data
            const result = formSchema.parse({ password, confirmPassword })

            setIsLoading(true)

            // Send the new password to the API
            const response = await fetch("/api/auth/reset-password/reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token, password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to reset password")
            }

            // Show success message
            setSuccess(true)

            // Redirect to login page after a delay
            setTimeout(() => {
                router.push("/login")
            }, 3000)
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

    if (isValidatingToken) {
        return (
            <div className="container flex h-screen max-w-md items-center justify-center">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">Reset Password</CardTitle>
                        <CardDescription>Validating your reset link...</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center py-6">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!isTokenValid) {
        return (
            <>
                <AuthHeader />
                <div className="container flex h-screen max-w-md items-center justify-center">
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
                            <CardDescription>
                                The password reset link is invalid or has expired.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Link to="/reset-password/request">
                                <Button>Request a new reset link</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
                <AuthFooter />
            </>
        )
    }

    return (
        <>
            <AuthHeader />
            <div className="container flex h-screen max-w-md items-center justify-center">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">Reset Password</CardTitle>
                        <CardDescription>Enter your new password below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {success ? (
                            <div className="space-y-4">
                                <Alert className="bg-green-50 border-green-200">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        Your password has been reset successfully. You will be
                                        redirected to the login page.
                                    </AlertDescription>
                                </Alert>
                                <div className="flex justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium">
                                        New Password
                                    </label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your new password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Password must be at least 8 characters and include uppercase,
                                        lowercase, and numbers.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="text-sm font-medium"
                                    >
                                        Confirm Password
                                    </label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your new password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
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
                                            Resetting...
                                        </>
                                    ) : (
                                        "Reset Password"
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
