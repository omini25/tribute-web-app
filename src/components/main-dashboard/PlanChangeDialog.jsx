import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * A dialog component for displaying and changing subscription plans.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls if the dialog is open.
 * @param {() => void} props.onClose - Function to call when the dialog should close.
 * @param {string} props.currentPlanId - The ID of the user's current plan.
 * @param {(planId: string) => void} props.onChangePlan - Callback function when a new plan is selected.
 * @param {Array<object>} props.plans - An array of plan objects to display.
 * @param {object} props.expandedFeatures - State for tracking expanded feature lists.
 * @param {(planId: string) => void} props.toggleFeatures - Function to toggle feature list expansion.
 * @param {React.ComponentType<any>} props.FeatureItem - Component to render a feature item.
 * @param {(plan: object) => string} props.getPriceDisplay - Function to get the display price for a plan.
 */
const PlanChangeDialog = ({
    isOpen,
    onClose,
    currentPlanId,
    onChangePlan,
    plans,
    expandedFeatures,
    toggleFeatures,
    FeatureItem,
    getPriceDisplay,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-medium text-[#2a3342]">Change Your Plan</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-[#4a5568] mb-6">
                        Upgrade your plan to access premium themes, unlimited music options, and more features.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {plans.map((plan) => {
                            const isActive = currentPlanId === plan.id;
                            const isExpanded = expandedFeatures[plan.id];

                            return (
                                <Card
                                    key={plan.id}
                                    className={`flex flex-col transition-all hover:shadow-lg ${
                                        isActive ? "ring-2 ring-[#fcd34d] shadow-xl" : "border-[#e5e0d9]"
                                    } ${plan.popular ? "border-2 border-[#fcd34d]" : ""}`}
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-lg text-[#2a3342]">{plan.name}</CardTitle>
                                            {plan.popular && (
                                                <span className="bg-[#fcd34d] text-white text-xs font-bold px-2 py-1 rounded-full">
                                                    POPULAR
                                                </span>
                                            )}
                                        </div>
                                        <CardDescription className="text-sm text-[#4a5568] pt-1 h-12">
                                            {plan.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow space-y-4">
                                        <div className="text-2xl font-bold text-[#2a3342]">
                                            {getPriceDisplay(plan)}
                                        </div>
                                        <div className="space-y-2">
                                            {plan.features.slice(0, 3).map((feature, index) => (
                                                <FeatureItem key={index} {...feature} />
                                            ))}
                                        </div>
                                        {plan.features.length > 3 && (
                                            <>
                                                {isExpanded && (
                                                    <div className="space-y-2">
                                                        {plan.features.slice(3).map((feature, index) => (
                                                            <FeatureItem key={index + 3} {...feature} />
                                                        ))}
                                                    </div>
                                                )}
                                                <Button
                                                    variant="link"
                                                    className="text-[#fcd34d] p-0 h-auto"
                                                    onClick={() => toggleFeatures(plan.id)}
                                                >
                                                    {isExpanded ? "Show less" : `Show all ${plan.features.length} features`}
                                                    {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                                                </Button>
                                            </>
                                        )}
                                    </CardContent>
                                    <CardFooter className="mt-auto pt-4">
                                        <Button
                                            className={`w-full ${
                                                isActive
                                                    ? "bg-[#645a52] text-white cursor-default"
                                                    : "bg-[#fcd34d] hover:bg-[#eab308] text-white"
                                            }`}
                                            onClick={() => { if (!isActive) onChangePlan(plan.id); }}
                                            disabled={isActive}
                                        >
                                            {isActive ? "Current Plan" : "Select Plan"}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t mt-6">
                    <p className="text-sm text-[#4a5568]">
                        Need help choosing?{" "}
                        <a href="#" className="text-[#fcd34d] hover:underline">
                            Contact support
                        </a>
                    </p>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={onClose} className="border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]">
                            Cancel
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PlanChangeDialog;