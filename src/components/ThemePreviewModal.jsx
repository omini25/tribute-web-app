import { useState, useEffect, lazy, Suspense } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

// Dynamic theme components
const WarmTheme = lazy(() => import('@/components/tribute/themes/MinimalistTheme.jsx'))
const CoolTheme = lazy(() => import('@/components/tribute/themes/ElegantTabTheme.jsx'))
const AutumnTheme = lazy(() => import('@/components/tribute/themes/MinimalistTheme.jsx'))

const ThemePreviewModal = ({ isOpen, onClose, theme }) => {
    const [ThemeComponent, setThemeComponent] = useState(null)

    useEffect(() => {
        // Map theme IDs to their corresponding components
        const themeComponents = {
            warm: WarmTheme,
            cool: CoolTheme,
            autumn: AutumnTheme
        }

        // Set the component based on the theme ID
        setThemeComponent(themeComponents[theme.id] || null)
    }, [theme])

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-full">
                <DialogHeader>
                    <DialogTitle>{theme.name} Theme Preview</DialogTitle>
                    <Button
                        variant="ghost"
                        className="absolute right-4 top-4"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>
                <div className="mt-4 h-96 overflow-auto">
                    {ThemeComponent ? (
                        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading theme preview...</div>}>
                            <ThemeComponent />
                        </Suspense>
                    ) : (
                        <div className="text-center p-8">
                            <p>Theme preview not available</p>
                            <img
                                src={theme.image || "/placeholder.svg"}
                                alt={`${theme.name} Theme Preview`}
                                className="w-full h-auto rounded-lg mt-4"
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ThemePreviewModal