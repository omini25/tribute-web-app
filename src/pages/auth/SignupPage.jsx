import { useState } from "react";
import Signup1 from "@/components/auth/Signup1.jsx";
import Signup2 from "@/components/auth/Signup2.jsx";
import AuthHeader from "@/components/auth/AuthHeader.jsx";
import Pricing from "@/components/auth/Pricing.jsx";

export const SignupPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showPricing, setShowPricing] = useState(false);

    const handleNext = () => {
        if (currentStep === 1) {
            setCurrentStep(2);
        } else if (currentStep === 2) {
            setShowPricing(true);
        }
    };

    const handlePrevious = () => {
        if (currentStep === 2) {
            setCurrentStep(1);
        } else if (showPricing) {
            setShowPricing(false);
            setCurrentStep(2); // Go back to Signup2 from Pricing
        }
    };

    return (
        <>
            <AuthHeader />
            {currentStep === 1 && <Signup1 onNext={handleNext} />}
            {currentStep === 2 && <Signup2 onNext={handleNext} onPrevious={handlePrevious} />}
            {showPricing && <Pricing onPrevious={handlePrevious} />}
        </>
    );
};