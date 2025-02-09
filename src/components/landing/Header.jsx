import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import logo from "../../assets/images/remember-me.png"

const navigation = [
    { name: "Features", href: "/features" },
    { name: "Testimonials", href: "/#testimonials" },
    { name: "Pricing", href: "/pricing" },
    { name: "Contact", href: "/contact" }
]

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300",
                isScrolled
                    ? "bg-background/100 backdrop-blur-lg shadow-md"
                    : "bg-background"
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <img
                                src={logo || "/placeholder.svg"}
                                alt="Memories Logo"
                                width={150}
                                height={40}
                                className="h-8 w-auto"
                            />
                        </Link>
                        <nav className="hidden md:ml-10 md:flex md:space-x-8">
                            {navigation.map(item => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <form className="hidden sm:block">
                            <div className="relative">
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    className="w-full sm:w-[200px] pl-8"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                                    <svg
                                        className="h-5 w-5 text-muted-foreground"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                            </div>
                        </form>
                        <div className="hidden sm:flex sm:items-center sm:space-x-2">
                            <Button variant="ghost" asChild>
                                <Link to="/login">Log in</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/signup">Get Started</Link>
                            </Button>
                        </div>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <span className="sr-only">Open menu</span>
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <nav className="flex flex-col space-y-4 mt-4">
                                    {navigation.map(item => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                    <form className="mt-4">
                                        <Input
                                            type="search"
                                            placeholder="Search..."
                                            className="w-full"
                                        />
                                    </form>
                                    <div className="flex flex-col space-y-2 mt-4">
                                        <Button variant="ghost" asChild>
                                            <Link to="/login">Log in</Link>
                                        </Button>
                                        <Button asChild>
                                            <Link to="/signup">Get Started</Link>
                                        </Button>
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}
