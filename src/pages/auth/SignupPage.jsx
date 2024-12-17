import { useState } from "react";
import Signup1 from "@/components/auth/Signup1.jsx";
import Signup2 from "@/components/auth/Signup2.jsx";
import AuthHeader from "@/components/auth/AuthHeader.jsx";

export const SignupPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const handleNext = () => {
        setCurrentStep(2);
    };
    const handlePrevious = () => {
        setCurrentStep(1)
    }
    return (
        <>
            <AuthHeader />
            {currentStep === 1 && <Signup1 onNext={handleNext} />}
            {currentStep === 2 && <Signup2 onPrevious={handlePrevious} />}
        </>
    );
};