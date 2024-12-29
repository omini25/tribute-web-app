import { ContactForm } from "@/components/ContactForm.jsx"
import { ContactInfo } from "@/components/ContactInfo.jsx"
import { Toaster } from "@/components/ui/toaster"
import {Footer} from "@/components/landing/Footer.jsx";
import Header from "@/components/landing/Header.jsx";

export default function ContactPage() {
    return (
        <>

            <Header />

            <div className="container mx-auto px-4 py-24 max-w-7xl mt-20">
                <h1 className="text-4xl font-bold text-center mb-4">Contact Us</h1>
                <p className="text-xl text-center text-muted-foreground mb-12">
                    We're here to help. Reach out to us with any questions or concerns.
                </p>

                <div className="grid gap-8 md:grid-cols-2">
                    <div>
                        <ContactForm/>
                    </div>
                    <div className="space-y-8">
                        <ContactInfo/>
                    </div>
                </div>
                <Toaster/>
            </div>

            <Footer />

        </>
    )
}

