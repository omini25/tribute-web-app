import { HeroBanner } from "@/components/tribute/themes/layout/HeroBanner.jsx"
import { MemorialNav } from "@/components/tribute/themes/layout/MemorialNav.jsx"
import { AboutSection } from "@/components/tribute/themes/sections/AboutSection.jsx"
import { FamilySection } from "@/components/tribute/themes/sections/FamilySection.jsx"
import { TimelineSection } from "@/components/tribute/themes/sections/TimelineSection.jsx"
import { Sidebar } from "@/components/tribute/themes/sections/Sidebar.jsx"
import Header from "@/components/landing/Header.jsx";

// This would normally come from your database
const MEMORIAL_DATA = {
    name: "Phil Booker",
    dates: "1975 - 2024",
    profileImage: "/placeholder.svg",
    bannerImage: "/placeholder.svg",
    biography:
        "BELOVED HUSBAND, loving father, grateful son, faithful and fun-loving friend, a minister of ministers and a servant of the Lord Almighty.",
    birthDate: "January 4, 1975",
    birthPlace: "Baltimore, Maryland, United States",
    deathDate: "November 27, 2024",
    deathPlace: "Baltimore, Maryland, United States",
    immediateFamily: [
        { name: "Sarah Booker", relation: "Wife", image: "/placeholder.svg" },
        { name: "James Booker", relation: "Son", image: "/placeholder.svg" }
    ],
    extendedFamily: [
        { name: "Robert Booker", relation: "Brother", image: "/placeholder.svg" },
        { name: "Mary Booker", relation: "Sister", image: "/placeholder.svg" }
    ],
    timeline: [
        {
            date: new Date("1975-01-04"),
            title: "Born in Baltimore",
            description:
                "Phil was born at Memorial Hospital to loving parents James and Mary Booker.",
            image: "/placeholder.svg"
        },
        {
            date: new Date("1993-06-15"),
            title: "Graduated High School",
            description: "Graduated with Honours from Baltimore High School.",
            image: "/placeholder.svg"
        }
    ],
    stats: {
        photoCount: 108,
        viewCount: 2001,
        contributorCount: 45
    },
    recentUpdates: [
        {
            id: "1",
            user: { name: "Ryan Pomicter", image: "/placeholder.svg" },
            action: "left a tribute",
            date: "December 25"
        },
        {
            id: "2",
            user: { name: "Stephanie Pierre-Louis", image: "/placeholder.svg" },
            action: "added 4 photos",
            date: "December 24"
        }
    ]
}

export const LandingTributePage = () => {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-background mx-auto max-w-7xl mt-20">
                <HeroBanner
                    name={MEMORIAL_DATA.name}
                    dates={MEMORIAL_DATA.dates}
                    profileImage={MEMORIAL_DATA.profileImage}
                    bannerImage={MEMORIAL_DATA.bannerImage}
                />
                <div className="h-16"/>
                {/* Spacing for profile image overflow */}
                <MemorialNav/>
                <main className="container mx-auto px-4 py-8">
                    <div className="grid gap-8 md:grid-cols-[1fr_300px]">
                        <div className="space-y-8">
                            <AboutSection
                                biography={MEMORIAL_DATA.biography}
                                birthDate={MEMORIAL_DATA.birthDate}
                                birthPlace={MEMORIAL_DATA.birthPlace}
                                deathDate={MEMORIAL_DATA.deathDate}
                                deathPlace={MEMORIAL_DATA.deathPlace}
                            />

                            <FamilySection
                                immediateFamily={MEMORIAL_DATA.immediateFamily}
                                extendedFamily={MEMORIAL_DATA.extendedFamily}
                            />

                            <TimelineSection events={MEMORIAL_DATA.timeline}/>
                        </div>

                        <Sidebar
                            photoCount={MEMORIAL_DATA.stats.photoCount}
                            viewCount={MEMORIAL_DATA.stats.viewCount}
                            contributorCount={MEMORIAL_DATA.stats.contributorCount}
                            recentUpdates={MEMORIAL_DATA.recentUpdates}
                        />
                    </div>
                </main>
            </div>

        </>
    )
}
