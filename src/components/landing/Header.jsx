import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import logo from "@/assets/images/remember-me.png"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    // A helper component to avoid repeating classes and logic for mobile links
    const MobileNavLink = ({ to, children }) => (
        <Link
            to={to}
            className="text-lg text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
        >
            {children}
        </Link>
    )

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm dark:bg-gray-900/90" : "bg-[#f8f4f0] dark:bg-gray-900"
            }`}
        >
            <div className="container mx-auto px-4 flex h-16 items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <img src={logo} alt="Memories Logo" width={100} height={50} className="h-14 w-auto" />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                        Home
                    </Link>
                    <Link to="/memorials" className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                        Memories
                    </Link>
                    <Link to="/features" className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                        Features
                    </Link>
                    <Link to="/pricing" className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                        Pricing
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors flex items-center space-x-1"
                            >
                                Resources <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48 bg-white dark:bg-gray-900 shadow-lg">
                            <DropdownMenuItem asChild className="text-base">
                                <Link to="/about-us" className="block w-full text-left">About Us</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="text-base">
                                <Link to="/" className="block w-full text-left">Blog</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center space-x-4">
                    <Link to="/login" className="text-base font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                        Log In
                    </Link>
                    <Button asChild className="bg-amber-400 hover:bg-amber-500 text-gray-800 hover:text-gray-900 text-base font-medium">
                        <Link to="/signup">Sign Up</Link>
                    </Button>
                </div>

                <button
                    onClick={toggleMobileMenu}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Toggle mobile menu"
                >
                    {isMobileMenuOpen ? (
                        <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    ) : (
                        <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
                    <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                        <MobileNavLink to="/">Home</MobileNavLink>
                        <MobileNavLink to="/memorials">Memories</MobileNavLink>
                        <MobileNavLink to="/features">Features</MobileNavLink>
                        <MobileNavLink to="/pricing">Pricing</MobileNavLink>

                        <div className="flex flex-col space-y-2 pl-4 border-l border-gray-200 dark:border-gray-700">
                            <span className="text-base font-semibold text-gray-500 pt-2">Resources</span>
                            <MobileNavLink to="/about-us">About Us</MobileNavLink>
                            <MobileNavLink to="/">Blog</MobileNavLink>
                        </div>

                        <div className="flex flex-col space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <MobileNavLink to="/login">Log In</MobileNavLink>
                            <Button
                                asChild
                                className="bg-amber-400 hover:bg-amber-500 text-gray-800 hover:text-gray-900 w-full text-lg"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Link to="/signup">Sign Up</Link>
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}