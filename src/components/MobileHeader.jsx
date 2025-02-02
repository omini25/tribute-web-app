import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function MobileHeader({ isMobileMenuOpen, setIsMobileMenuOpen }) {
    return (
        <header className="md:hidden bg-gray-50 dark:bg-gray-900 border-b p-4 flex items-center justify-between">
            <Button
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Dashboard
            </h1>
        </header>
    );
}

export function Backdrop({ isMobileMenuOpen, setIsMobileMenuOpen }) {
    return (
        isMobileMenuOpen && (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
            />
        )
    );
}