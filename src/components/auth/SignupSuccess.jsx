import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail, AlertCircle, RefreshCw } from "lucide-react"
import { useSearchParams, Link } from "react-router-dom"
import { toast } from "react-hot-toast"
import { server } from "@/server.js"
import axios from "axios"

export default function SignupSuccess() {
    const [searchParams] = useSearchParams()
    const [isResending, setIsResending] = useState(false)
    const userEmail = searchParams.get('email')

    const handleResendVerification = async () => {
        if (!userEmail) return

        setIsResending(true)
        try {
            const response = await axios.post(`${server}/resend-verification`, {
                email: userEmail
            })

            if (response.status === 200) {
                toast.success('Verification email sent successfully!')
            }
        } catch (error) {
            console.error('Error resending verification:', error)
            if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error('Failed to resend verification email. Please try again.')
            }
        } finally {
            setIsResending(false)
        }
    }

    useEffect(() => {
        // Clear the signup form data from localStorage
        localStorage.removeItem('signupFormData')
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8f4f0] to-[#f5f0ea] flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-[#2a3342] mb-2">
                        Registration Successful!
                    </h1>
                    <p className="text-[#4a5568]">
                        Welcome to Remembered Always
                    </p>
                </div>

                {/* Main Card */}
                <Card className="border-none shadow-lg">
                    <CardHeader className="text-center pb-4">
                        <CardTitle className="text-xl text-[#2a3342]">
                            Verify Your Email Address
                        </CardTitle>
                        <CardDescription className="text-base">
                            We've sent a verification link to
                        </CardDescription>
                        <div className="flex items-center justify-center space-x-2 mt-2">
                            <Mail className="h-4 w-4 text-[#fcd34d]" />
                            <span className="font-medium text-[#2a3342]">{userEmail || 'your email'}</span>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Instructions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="space-y-2">
                                    <h3 className="font-medium text-blue-900">Next Steps:</h3>
                                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                        <li>Check your email inbox for the verification link</li>
                                        <li>Click the link to verify your account</li>
                                        <li>Start building your memorial after verification</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Check Spam Note */}
                        <div className="text-center text-sm text-[#4a5568]">
                            <p>Can't find the email? Check your spam folder or</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Button
                                onClick={handleResendVerification}
                                disabled={isResending || !userEmail}
                                className="w-full bg-[#fcd34d] hover:bg-[#e6b52f] text-black"
                            >
                                {isResending ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Resend Verification Email
                                    </>
                                )}
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                className="w-full border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]"
                            >
                                <Link to="/login">
                                    Return to Login
                                </Link>
                            </Button>
                        </div>

                        {/* Support Info */}
                        <div className="text-center text-xs text-[#4a5568] pt-4 border-t">
                            <p>Need help? <Link to="/contact" className="text-[#fcd34d] hover:underline">Contact our support team</Link></p>
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Info */}
                <div className="text-center text-sm text-[#4a5568]">
                    <p>Your memorial has been created and will be fully accessible after email verification.</p>
                </div>
            </div>
        </div>
    )
}