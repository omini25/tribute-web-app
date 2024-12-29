import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import DeceasedInfoForm from "@/components/auth/DeceasedInfoForm.jsx"
import UserInfoForm from "@/components/auth/UserInfoForm.jsx"
import PlanSelection from "@/components/auth/PlanSelection.jsx"
import Header from "@/components/landing/Header.jsx";

export const SignupPage = () => {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        deceased: {},
        user: {},
        plan: null,
        theme: null
    })

    const updateFormData = (section, data) => {
        setFormData(prev => ({ ...prev, [section]: { ...prev[section], ...data } }))
    }

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3))
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Header />


            <div className="container mx-auto max-w-3xl mt-10">
                <h1 className="mb-8 text-center text-3xl font-bold">
                    Create a Memorial
                </h1>
                <Progress value={step * 33.33} className="mb-8" />

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
                        onSubmit={data => {
                            updateFormData("plan", data) /* Proceed to payment */
                        }}
                    />
                )}

                <div className="mt-8 flex justify-between">
                    {step > 1 && (
                        <Button onClick={prevStep} variant="outline">
                            Previous
                        </Button>
                    )}
                    {step < 3 && (
                        <Button onClick={nextStep} className="ml-auto">
                            Next
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
