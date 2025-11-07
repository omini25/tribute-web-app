"use client" // This directive is for Next.js App Router, but might not cause issues here if not strictly enforced.
             // However, since you're using react-router-dom, it's generally not needed for this file.
import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation" // REMOVE THIS LINE
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
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom'; // ADD useNavigate
import {AuthFooter} from "@/components/auth/AuthFooter.jsx";
import {AuthHeader} from "@/components/auth/AuthHeader.jsx";
import {server} from "@/server.js";
// const { useParams, useSearchParams } = require('react-router-dom'); // This line seems like a duplicate or incorrect import style, remove if present. The import above is correct.

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

// The 'params' prop here is not used because you correctly use `useParams` hook.
// You can remove it from the function signature if it's not intended for other purposes.
export default function PasswordPage() {
    const navigate = useNavigate(); // USE THIS for navigation
    const { token } = useParams(); // This is correct for getting URL parameters
    const [searchParams] = useSearchParams(); // This is correct for getting query parameters
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
                // Ensure your server is running and this endpoint is correct
                // For a Vite/CRA setup, this would typically be a full URL to your backend
                // or a proxied request. If your backend is also part of this Vite project
                // and serving API routes, ensure the path is correct.
                const response = await fetch(
                    `/api/auth/reset-password/validate?token=${token}` // This path implies a backend API route
                )
                const data = await response.json()

                if (response.ok) {
                    setIsTokenValid(true)
                } else {
                    setError(data.message || "Invalid or expired reset link")
                }
            } catch (err) {
                setError("Failed to validate reset link. Please check your connection or try again.")
                console.error("Token validation error:", err);
            } finally {
                setIsValidatingToken(false)
            }
        }

        if (token) { // Only validate if token exists
            validateToken()
        } else {
            setError("No reset token provided.");
            setIsValidatingToken(false);
        }
    }, [token])

    const handleSubmit = async e => {
        e.preventDefault()
        setError("")

        try {
            // Validate the form data
            formSchema.parse({ password, confirmPassword })

            setIsLoading(true)

            // Send the new password to the API
            const response = await fetch(`${server}/reset-password`, { // Ensure 'server' variable is correctly defined and points to your Laravel backend URL
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json" // Good practice to include Accept header
                },
                body: JSON.stringify({
                    token,
                    email,
                    password,
                    password_confirmation: confirmPassword // Send 'confirmPassword' value as 'password_confirmation'
                })
            })

            const data = await response.json()

            if (!response.ok) {
                // Use the specific message from Laravel if available
                throw new Error(data.message || "Failed to reset password")
            }

            // Show success message
            setSuccess(true)

            // Redirect to login page after a delay
            setTimeout(() => {
                navigate("/login");
            }, 3000)
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError(err.errors[0].message)
            } else if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("An unexpected error occurred")
            }
            console.error("Password reset submission error:", err);
        } finally {
            setIsLoading(false)
        }
    }

    if (isValidatingToken) {
        return (
            <div className="flex min-h-screen flex-col bg-white">
                <AuthHeader />
                <main className="flex-1 flex items-center justify-center bg-[#f8f4f0] py-16 sm:py-20 lg:py-24 px-4">
                    <Card className="w-full max-w-md border-none shadow-lg bg-white">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-serif font-medium text-[#2a3342]">Reset Password</CardTitle>
                            <CardDescription className="text-sm text-muted-foreground mt-2">Validating your reset link...</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center py-6">
                            <Loader2 className="h-8 w-8 animate-spin text-[#fcd34d]" />
                        </CardContent>
                    </Card>
                </main>
                <AuthFooter />
            </div>
        )
    }

    // if (!isTokenValid) {
    //     return (
    //         <div className="flex min-h-screen flex-col bg-white">
    //             <AuthHeader />
    //             <main className="flex-1 flex items-center justify-center bg-[#f8f4f0] py-16 sm:py-20 lg:py-24 px-4">
    //                 <Card className="w-full max-w-md border-none shadow-lg bg-white">
    //                     <CardHeader className="text-center">
    //                         <CardTitle className="text-2xl font-serif font-medium text-[#2a3342]">Invalid Reset Link</CardTitle>
    //                         <CardDescription className="text-sm text-muted-foreground mt-2">
    //                             {error || "The password reset link is invalid or has expired."}
    //                         </CardDescription>
    //                     </CardHeader>
    //                     <CardContent>
    //                         <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
    //                             <AlertCircle className="h-4 w-4" />
    //                             <AlertDescription>{error || "Please request a new password reset link."}</AlertDescription>
    //                         </Alert>
    //                     </CardContent>
    //                     <CardFooter className="flex justify-center mt-6">
    //                         <Button asChild className="bg-[#fcd34d] hover:bg-[#645a52] text-white">
    //                             <Link to="/forgot-password">Request a new link</Link>
    //                         </Button>
    //                     </CardFooter>
    //                 </Card>
    //             </main>
    //             <AuthFooter />
    //         </div>
    //     )
    // }

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <AuthHeader />
            <main className="flex-1 flex items-center justify-center bg-[#f8f4f0] py-16 sm:py-20 lg:py-24 px-4">
                <Card className="w-full max-w-md border-none shadow-lg bg-white">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-serif font-medium text-[#2a3342]">Reset Password</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground mt-2">Enter your new password below.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 sm:p-10">
                        {success ? (
                            <div className="space-y-4 text-center">
                                <Alert className="bg-green-50 border-green-200 text-green-700">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertDescription>
                                        Your password has been reset successfully.
                                    </AlertDescription>
                                </Alert>
                                <p className="text-sm text-muted-foreground">You will be redirected to the login page shortly.</p>
                                <div className="flex justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-[#fcd34d]" />
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium text-[#4a5568]">
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
                                        className="w-full border-gray-300 focus:border-[#fcd34d] focus:ring-[#fcd34d]"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Must be at least 8 characters and include uppercase, lowercase, and numbers.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="text-sm font-medium text-[#4a5568]"
                                    >
                                        Confirm New Password
                                    </label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm your new password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        className="w-full border-gray-300 focus:border-[#fcd34d] focus:ring-[#fcd34d]"
                                    />
                                </div>

                                {/*{error && (*/}
                                {/*    <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">*/}
                                {/*        <AlertCircle className="h-4 w-4" />*/}
                                {/*        <AlertDescription>{error}</AlertDescription>*/}
                                {/*    </Alert>*/}
                                {/*)}*/}

                                <Button type="submit" className="w-full bg-[#fcd34d] hover:bg-[#645a52] text-white" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Resetting Password...
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                    {!success && (
                        <CardFooter className="flex justify-center pt-6">
                            <Link to="/login" className="text-sm text-[#fcd34d] hover:text-[#645a52] font-medium">
                                Back to Login
                            </Link>
                        </CardFooter>
                    )}
                </Card>
            </main>
            <AuthFooter />
        </div>
    )
}