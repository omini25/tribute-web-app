import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const ThemePreviewModal = ({ isOpen, onClose, theme }) => {
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
                <div className="mt-4">
                    <img
                        src={theme.image || "/placeholder.svg"}
                        alt={`${theme.name} Theme Preview`}
                        className="w-full h-auto rounded-lg"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ThemePreviewModal
