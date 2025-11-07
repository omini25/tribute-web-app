import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Palette } from "lucide-react"

const ThemePreviewModal = ({ theme, onClose }) => {
    if (!theme) return null;

    return (
        <Dialog open={!!theme} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl h-[90vh] bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-[#2a3342] flex items-center">
                        <Palette className="h-6 w-6 mr-2 text-[#fcd34d]" />
                        {theme.name} Theme Preview
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4 flex-1 h-full bg-[#f8f4f0] rounded-lg p-6">
                    <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                            {/* Theme Preview */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-[#2a3342]">Theme Preview</h4>
                                <div
                                    className="h-48 rounded-lg border-2 p-4 flex flex-col justify-between"
                                    style={{
                                        backgroundColor: theme.colors.background,
                                        color: theme.colors.text,
                                        borderColor: `${theme.colors.primary}20`
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div
                                            className="w-8 h-8 rounded flex items-center justify-center text-white font-bold"
                                            style={{ backgroundColor: theme.colors.primary }}
                                        >
                                            M
                                        </div>
                                        <span className="font-bold" style={{ color: theme.colors.primary }}>
                                            Memorial Site
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold" style={{ color: theme.colors.primary }}>
                                            In Loving Memory
                                        </h3>
                                        <p style={{ color: theme.colors.text }}>Sample tribute content</p>
                                    </div>
                                    <div className="flex justify-center">
                                        <div
                                            className="px-4 py-2 rounded text-white text-sm"
                                            style={{ backgroundColor: theme.colors.accent }}
                                        >
                                            View Tribute
                                        </div>
                                    </div>
                                </div>

                                {/* Color Palette */}
                                <div>
                                    <h4 className="font-medium text-[#2a3342] mb-3">Color Palette</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(theme.colors).map(([key, color]) => (
                                            <div key={key} className="flex items-center space-x-2">
                                                <div
                                                    className="w-6 h-6 rounded border"
                                                    style={{ backgroundColor: color }}
                                                />
                                                <div className="text-xs">
                                                    <div className="font-medium capitalize">{key}</div>
                                                    <div className="text-[#4a5568]">{color}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Theme Details */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-[#2a3342]">Theme Details</h4>
                                <div className="space-y-3">
                                    <div>
                                        <strong>Name:</strong> {theme.name}
                                    </div>
                                    <div>
                                        <strong>Description:</strong> {theme.description}
                                    </div>
                                    <div>
                                        <strong>Layout Type:</strong>
                                        <Badge className="ml-2 capitalize" variant="outline">
                                            {theme.layout_type}
                                        </Badge>
                                    </div>
                                    <div>
                                        <strong>Available Plans:</strong>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {theme.allowed_plans?.map(plan => (
                                                <Badge key={plan} variant="secondary" className="text-xs capitalize">
                                                    {plan.replace('_', ' ')}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#f8f4f0] p-4 rounded-lg">
                                    <h5 className="font-medium text-[#2a3342] mb-2">About This Theme</h5>
                                    <p className="text-sm text-[#4a5568]">
                                        This theme features a {theme.layout_type} layout with carefully chosen colors to create
                                        a respectful and beautiful memorial experience. The design ensures your tribute looks
                                        professional across all devices.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogClose asChild>
                    <Button variant="outline" className="border-[#fcd34d] text-[#fcd34d] hover:bg-[#f5f0ea]">
                        Close Preview
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default ThemePreviewModal;