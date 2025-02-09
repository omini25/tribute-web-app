import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import DeceasedInfoForm from "@/components/auth/DeceasedInfoForm.jsx";
import UserInfoForm from "@/components/auth/UserInfoForm.jsx";
import PlanSelection from "@/components/auth/PlanSelection.jsx";
import Header from "@/components/landing/Header"
import { toast } from "react-hot-toast";
import {server} from "@/server.js";
import axios from "axios";

export const SignupPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        deceased: {},
        user: {},
        plan: null,
        theme: null
    });

    const updateFormData = (section, data) => {
        setFormData(prev => ({ ...prev, [section]: { ...prev[section], ...data } }));
    };

    const nextStep = () => {
        if (step === 1 && (
            !formData.deceased.dateOfBirth ||
            !formData.deceased.dateOfDeath

        )) {
            toast.error("Please fill all required fields in the Deceased Information form.");
            return;
        }
        if (step === 2 && (
            !formData.user.firstName ||
            !formData.user.lastName ||
            !formData.user.email ||
            !formData.user.phone ||
            !formData.user.password ||
            !formData.user.confirmPassword
        )) {
            toast.error("Please fill all required fields in the User Information form.");
            return;
        }
        setStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleFinalSubmit = async (data) => {
        updateFormData("plan", data);
        const payload = {
            ...formData.deceased,
            ...formData.user,
            plan: data.plan,
            theme: data.theme
        };

        try {
            const response = await axios.post(`${server}/register`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                window.location.href = response.data.redirect_url; // Redirect to Paystack payment page
            } else {
                toast.error(response.data.message || "An error occurred during signup.");
                console.error("Error during signup:", response.data);
            }
        } catch (error) {
            toast.error("An error occurred during signup.");
            console.error("Error during signup:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Header />

            <div className="container mx-auto max-w-3xl mt-16">
                <h1 className="mb-8 text-center text-3xl font-bold">
                    Create a Memorial
                </h1>
                <Progress value={step * 33.33} className="mb-8" />

                {step === 1 && (
                    <DeceasedInfoForm
                        onSubmit={data => {
                            updateFormData("deceased", data);
                            nextStep();
                        }}
                    />
                )}
                {step === 2 && (
                    <UserInfoForm
                        onSubmit={data => {
                            updateFormData("user", data);
                            nextStep();
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
                        <Button onClick={prevStep} variant="outline">
                            Previous
                        </Button>
                    )}
                    {/*{step < 3 && (*/}
                    {/*    <Button onClick={nextStep} className="ml-auto">*/}
                    {/*        Next*/}
                    {/*    </Button>*/}
                    {/*)}*/}
                </div>
            </div>
        </div>
    );
};