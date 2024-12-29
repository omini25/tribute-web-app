import {useEffect, useState} from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button.jsx";

const navigation = [
    { name: 'About', href: '#' },
    { name: 'Tributes', href: '#' },
    { name: 'Resources', href: '#' },
    { name: 'Blog', href: '#' },
]

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false); // State for scroll tracking


    useEffect(() => {  // useEffect to handle scroll events
        const handleScroll = () => {
            if (window.scrollY > 0) { // Check if scrolled down
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll); // Attach scroll listener

        return () => { // Cleanup on unmount
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); // Empty dependency array means this runs once on mount

    return (
        <header
            className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container h-16 items-center justify-between mx-auto flex max-w-7xl">
                <Link to="/" className="flex items-center space-x-2">
                    <img
                        src="/placeholder.svg"
                        alt="Memories Logo"
                        width={150}
                        height={40}
                        className="h-10 w-auto"
                    />
                </Link>
                <nav className="hidden space-x-6 md:flex">
                    <Link
                        to="/features"
                        className="text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                        Features
                    </Link>
                    <Link
                        to="#testimonials"
                        className="text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                        Testimonials
                    </Link>
                    <Link
                        to="/pricing"
                        className="text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                        Pricing
                    </Link>

                    <Link
                        to="/contact"
                        className="text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                        Contact
                    </Link>
                </nav>
                <div className="flex items-center space-x-4">
                    <Link to="/login">
                        <Button variant="ghost">Log in</Button>
                    </Link>
                    <Link to="/signup">
                        <Button>Get Started</Button>
                    </Link>

                </div>
            </div>
        </header>
    )
}
