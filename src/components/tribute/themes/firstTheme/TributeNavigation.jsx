import { Button } from "@/components/ui/button.jsx"
import { Heart, Instagram, Twitter, Facebook, Globe, ArrowUp } from 'lucide-react'
import {NavLink, Outlet} from "react-router-dom";
import {Tribute} from "@/pages/tribute/Tribute.jsx";
import Life from "@/pages/tribute/Life.jsx";
import {Events} from "@/pages/tribute/Events.jsx";
import {Memories} from "@/pages/tribute/Memories.jsx";
import {FamilyTree} from "@/pages/tribute/FamilyTree.jsx";
import {Gallery} from "@/pages/tribute/Gallery.jsx";
import {Posts} from "@/pages/tribute/Posts.jsx";
import {Donations} from "@/pages/tribute/Donations.jsx";
import {Conclusions} from "@/pages/tribute/Conclusions.jsx";
import Header from "@/components/tribute/themes/Header.jsx";


export default function TributeNavigation() {

    const navLinks = [
        { text: "TRIBUTE", path: "overview" , element: <Tribute/>},
        { text: "LIFE", path: "life", element: <Life/> },
        { text: "EVENTS", path: "events", element: <Events/> },
        {text: "MEMORIES", path:"memories", element: <Memories/>},
        {text: "FAMILY TREE", path:"family-tree", element: <FamilyTree/>},
        {text: "GALLERY", path:"gallery", element: <Gallery/>},
        {text: "POSTS", path:"posts", element: <Posts/>},
        {text: "DONATIONS", path:"donations", element: <Donations/>},
        {text: "CONCLUSIONS", path:"conclusions", element: <Conclusions/>}
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-white flex mt-16">
                <nav className="fixed top-0 left-0 w-64 h-screen p-8 border-r hidden md:block overflow-y-auto">
                    <div className="space-y-6">
                        {/* Navigation Links */}
                        <div className="space-y-6 mt-16">
                            {navLinks.map(link => (
                                <NavLink
                                    key={link.text}
                                    to={link.path}   // Use 'to' prop for routing
                                    className={({isActive}) =>  // Use activeClassName for styling
                                        `block text-sm ${isActive ? 'text-secondary' : 'text-primary'} hover:text-secondary`
                                    }
                                    end={link.text === "TRIBUTE"} // Set 'end' prop for exact match on root route
                                >
                                    {link.text}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-32">
                        <h2 className="text-gray-600 mb-4">JOHN DOE TRIBUTE</h2>
                        <a
                            href="http://www.tfpd/tribute/johndoe"
                            className="text-primary hover:text-secondary flex items-center gap-2 text-sm"
                        >
                            <Globe className="h-4 w-4"/>
                            www.tfpd/tribute/johndoe
                        </a>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <a href="#" className="text-gray-400 hover:text-gray-600">
                            <Instagram className="h-5 w-5"/>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-600">
                            <Twitter className="h-5 w-5"/>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-600">
                            <Facebook className="h-5 w-5"/>
                        </a>
                        <a href="#" className="text-gray-400 hover:text-gray-600">
                            <Globe className="h-5 w-5"/>
                        </a>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="ml-64 flex-1  overflow-y-auto">
                    <Outlet/>
                </main>

                {/* Footer */}
                <footer className="fixed bottom-0 left-0 right-0 bg-transparent p-4">
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="flex gap-4 text-sm">
                            {/*<a href="#" className="text-gray-500 hover:text-gray-700">About</a>*/}
                            {/*<a href="#" className="text-gray-500 hover:text-gray-700">Create Tribute</a>*/}
                            {/*<a href="#" className="text-gray-500 hover:text-gray-700">Privacy</a>*/}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full bg-white"
                            onClick={scrollToTop}
                        >
                            <ArrowUp className="h-4 w-4"/>
                        </Button>
                    </div>
                </footer>
            </div>
        </>

    )
}

