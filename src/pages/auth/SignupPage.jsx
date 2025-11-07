import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import DeceasedInfoForm from "@/components/auth/DeceasedInfoForm"
import UserInfoForm from "@/components/auth/UserInfoForm"
import PlanSelection from "@/components/auth/PlanSelection"
import { toast } from "react-hot-toast"
import { server } from "@/server.js"
import axios from "axios"
import { Check } from "lucide-react"
import { AuthHeader } from "@/components/auth/AuthHeader.jsx";
import { AuthFooter } from "@/components/auth/AuthFooter.jsx"
import { Link } from "react-router-dom"

export const SignupPage = () => {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem('signupFormData');
        return savedData ? JSON.parse(savedData) : {
            deceased: {},
            user: {},
            plan: null,
            theme: null
        };
    });

    const updateFormData = (section, data) => {
        setFormData(prev => {
            const newData = { ...prev, [section]: { ...prev[section], ...data } };
            localStorage.setItem('signupFormData', JSON.stringify(newData));
            return newData;
        });
    };

    const nextStep = () => {
        if (step === 1 && (
            !formData.deceased.dateOfBirth ||
            !formData.deceased.dateOfDeath ||
            !formData.deceased.deadFirstName ||
            !formData.deceased.deadLastName ||
            !formData.deceased.relationshipWithBereaved
        )) {
            toast.error("Please fill all required fields in the Deceased Information form.")
            return
        }
        if (step === 2 && (
            !formData.user.firstName ||
            !formData.user.lastName ||
            !formData.user.email ||
            !formData.user.password ||
            !formData.user.confirmPassword
        )) {
            toast.error("Please fill all required fields in the User Information form.")
            return
        }
        setStep(prev => Math.min(prev + 1, 3))
    }

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

    const handleFinalSubmit = async (data) => {
        updateFormData("plan", data);

        // Prepare the payload with proper data types
        const payload = {
            ...formData.deceased,
            ...formData.user,
            plan: String(data.plan || ''),
            theme: String(data.theme || ''),
            amount: Number(data.amount || 0),
        };

        // Remove confirmPassword from payload as it's not needed in backend
        delete payload.confirmPassword;

        try {
            const response = await axios.post(`${server}/register`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200 || response.status === 201) {
                localStorage.removeItem('signupFormData');
                if (response.data.redirect_url) {
                    window.location.href = response.data.redirect_url;
                } else {
                    toast.success("Registration successful!");
                    window.location.href = "/login";
                }
            } else {
                toast.error(response.data.message || "An error occurred during signup.");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            if (error.response?.data?.errors) {
                // Display specific validation errors
                const errors = error.response.data.errors;
                Object.keys(errors).forEach(key => {
                    toast.error(errors[key][0]);
                });
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred during signup.");
            }
        }
    };

    const steps = [
        { name: "Deceased Information", description: "Enter details about your loved one" },
        { name: "Your Information", description: "Tell us about yourself" },
        { name: "Select Plan", description: "Choose a memorial plan" }
    ]

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <AuthHeader />
            <main className="flex-1">
                <FormSection
                    step={step}
                    steps={steps}
                    formData={formData}
                    updateFormData={updateFormData}
                    nextStep={nextStep}
                    prevStep={prevStep}
                    handleFinalSubmit={handleFinalSubmit}
                />
                <SupportSection />
            </main>
            <AuthFooter />
        </div>
    )
}

function HeroSection() {
    return (
        <section className="relative min-h-[30vh] bg-[#f5f0ea]">
            {/* Animated cloud background - use multiple layers for parallax effect */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Background cloud layer - slowest moving */}
                <div className="absolute inset-0 bg-repeat-x animate-cloud-slow"
                     style={{
                         backgroundImage: "url('/images/cloud-bg-layer1.png')",
                         backgroundPosition: "0 80%",
                         backgroundSize: "1200px auto",
                     }}
                />

                {/* Middle cloud layer - medium speed */}
                <div className="absolute inset-0 bg-repeat-x animate-cloud-medium"
                     style={{
                         backgroundImage: "url('/images/cloud-bg-layer2.png')",
                         backgroundPosition: "0 60%",
                         backgroundSize: "1000px auto",
                         opacity: 0.7,
                     }}
                />

                {/* Foreground cloud layer - fastest moving */}
                <div className="absolute inset-0 bg-repeat-x animate-cloud-fast"
                     style={{
                         backgroundImage: "url('/images/cloud-bg-layer3.png')",
                         backgroundPosition: "0 90%",
                         backgroundSize: "800px auto",
                         opacity: 0.5,
                     }}
                />

                <style jsx="true">{`
                    @keyframes cloud-move-slow {
                        0% { background-position: 0% 80%; }
                        100% { background-position: 1200px 80%; }
                    }
                    @keyframes cloud-move-medium {
                        0% { background-position: 0% 60%; }
                        100% { background-position: 1000px 60%; }
                    }
                    @keyframes cloud-move-fast {
                        0% { background-position: 0% 90%; }
                        100% { background-position: 800px 90%; }
                    }
                    .animate-cloud-slow {
                        animation: cloud-move-slow 60s linear infinite;
                    }
                    .animate-cloud-medium {
                        animation: cloud-move-medium 40s linear infinite;
                    }
                    .animate-cloud-fast {
                        animation: cloud-move-fast 30s linear infinite;
                    }
                `}</style>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-[#f5f0ea]/80 to-[#f5f0ea]/60 flex flex-col items-center justify-center text-center px-4">
                <div className="max-w-4xl mx-auto space-y-4 relative">
                    <h1 className="text-4xl md:text-5xl font-serif text-[#2a3342] tracking-wide">
                        Create a Memorial
                    </h1>

                    <p className="text-lg md:text-xl text-[#4a5568] font-light max-w-2xl mx-auto">
                        Honour your loved one with a beautiful online memorial
                    </p>
                </div>
            </div>
        </section>
    )
}

function FormSection({ step, steps, formData, updateFormData, nextStep, prevStep, handleFinalSubmit }) {
    return (
        <section className="bg-[#f8f4f0] py-24">
            <div className="container px-4 md:px-6 max-w-6xl mx-auto">
                <div className="mb-12">
                    <div className="flex items-center justify-center mb-8">
                        {steps.map((s, i) => (
                            <div key={i} className="flex items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center
                                        ${i + 1 <= step
                                        ? "bg-[#fcd34d] text-white"
                                        : "bg-white border border-[#fcd34d] text-[#fcd34d]"
                                    }
                                    `}
                                >
                                    {i + 1 < step ? <Check className="w-5 h-5" /> : i + 1}
                                </div>
                                {i < steps.length - 1 && (
                                    <div
                                        className={`h-1 w-16 mx-2
                                            ${i + 1 < step ? "bg-[#fcd34d]" : "bg-gray-300"}
                                        `}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-serif font-medium tracking-wide text-[#2a3342]">
                            {steps[step - 1].name}
                        </h2>
                        <p className="text-[#4a5568]">
                            {steps[step - 1].description}
                        </p>
                    </div>

                    <Progress
                        value={step * 33.33}
                        className="h-2 bg-gray-200"
                        indicatorClassName="bg-[#fcd34d]"
                    />
                </div>

                <Card className="border-none shadow-lg bg-white">
                    <CardContent className="p-6 md:p-8">
                        {step === 1 && (
                            <DeceasedInfoForm
                                onSubmit={data => {
                                    updateFormData("deceased", data)
                                    nextStep()
                                }}
                            />
                        )}
                        {step === 2 && (
                            <UserInfoForm
                                onSubmit={data => {
                                    updateFormData("user", data)
                                    nextStep()
                                }}
                            />
                        )}
                        {step === 3 && (
                            <PlanSelection
                                onSubmit={handleFinalSubmit}
                            />
                        )}

                        <div className="mt-8 flex justify-between">
                            {step > 1 && (
                                <Button
                                    onClick={prevStep}
                                    variant="outline"
                                    className="border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea] hover:text-[#645a52]"
                                >
                                    Previous
                                </Button>
                            )}
                            {/*{step < 3 && step === 1 && (*/}
                            {/*    <Button*/}
                            {/*        onClick={() => {*/}
                            {/*            if (!formData.deceased.dateOfBirth ||*/}
                            {/*                !formData.deceased.dateOfDeath) {*/}
                            {/*                toast.error("Please fill all required fields in the Deceased Information form.")*/}
                            {/*                return*/}
                            {/*            }*/}
                            {/*            nextStep()*/}
                            {/*        }}*/}
                            {/*        className="ml-auto bg-[#fcd34d] hover:bg-[#645a52] text-white"*/}
                            {/*    >*/}
                            {/*        Next*/}
                            {/*    </Button>*/}
                            {/*)}*/}
                            {/*{step < 3 && step === 2 && (*/}
                            {/*    <Button*/}
                            {/*        onClick={() => {*/}
                            {/*            if (!formData.user.firstName ||*/}
                            {/*                !formData.user.lastName ||*/}
                            {/*                !formData.user.email ||*/}
                            {/*                !formData.user.phone ||*/}
                            {/*                !formData.user.password ||*/}
                            {/*                !formData.user.confirmPassword) {*/}
                            {/*                toast.error("Please fill all required fields in the User Information form.")*/}
                            {/*                return*/}
                            {/*            }*/}
                            {/*            nextStep()*/}
                            {/*        }}*/}
                            {/*        className="ml-auto bg-[#fcd34d] hover:bg-[#645a52] text-white"*/}
                            {/*    >*/}
                            {/*        Next*/}
                            {/*    </Button>*/}
                            {/*)}*/}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

function SupportSection() {
    return (
        <section className="relative overflow-hidden py-24 bg-[#2a3342] text-white">
            <div className="container relative z-10 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-serif font-medium tracking-wide sm:text-4xl mb-6">
                        Need Help Creating Your Memorial?
                    </h2>
                    <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
                        Our support team is here to assist you every step of the way.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Button
                            size="lg"
                            className="bg-white text-[#2a3342] hover:bg-gray-100 px-8"
                        >
                            <Link to="/contact">Contact Us</Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white/10 px-8"
                        >
                            <Link to="/faq">View FAQ</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SignupPage