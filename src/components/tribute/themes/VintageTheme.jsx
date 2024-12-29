import { HeroBanner } from "@/components/tribute/themes/layout/HeroBanner.jsx"
import { MemorialNav } from "@/components/tribute/themes/layout/MemorialNav.jsx"
import { AboutSection } from "@/components/tribute/themes/sections/AboutSection.jsx"
import { FamilySection } from "@/components/tribute/themes/sections/FamilySection.jsx"
import { TimelineSection } from "@/components/tribute/themes/sections/TimelineSection.jsx"
import { Sidebar } from "@/components/tribute/themes/sections/Sidebar.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GiftIcon } from "lucide-react"

export function VintageTheme({ memorialData }) {
    return (
        <div className="min-h-screen bg-sepia-100 text-sepia-900 font-serif">
            <HeroBanner
                name={memorialData.name}
                dates={memorialData.dates}
                profileImage={memorialData.profileImage}
                bannerImage={memorialData.bannerImage}
                theme="vintage"
            />

            <div className="h-16" />

            <MemorialNav theme="vintage" />

            <main className="container mx-auto px-4 py-8">
                <div className="grid gap-8 md:grid-cols-[1fr_300px]">
                    <div className="space-y-8">
                        <Card className="bg-sepia-50 border border-sepia-200">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold border-b border-sepia-200 pb-2">
                                    About
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AboutSection
                                    biography={memorialData.biography}
                                    birthDate={memorialData.birthDate}
                                    birthPlace={memorialData.birthPlace}
                                    deathDate={memorialData.deathDate}
                                    deathPlace={memorialData.deathPlace}
                                />
                            </CardContent>
                        </Card>

                        <Card className="bg-sepia-50 border border-sepia-200">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold border-b border-sepia-200 pb-2">
                                    Family
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FamilySection
                                    immediateFamily={memorialData.immediateFamily}
                                    extendedFamily={memorialData.extendedFamily}
                                />
                            </CardContent>
                        </Card>

                        <Card className="bg-sepia-50 border border-sepia-200">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold border-b border-sepia-200 pb-2">
                                    Life Events
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <TimelineSection events={memorialData.timeline} />
                            </CardContent>
                        </Card>

                        <Card className="bg-sepia-50 border border-sepia-200">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold border-b border-sepia-200 pb-2 flex items-center">
                                    <GiftIcon className="mr-2 h-5 w-5" />
                                    Memorial Donations
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4">
                                    In memory of {memorialData.name}, please consider a donation
                                    to:
                                </p>
                                <h3 className="text-lg font-semibold mb-2">
                                    {memorialData.donationOrg}
                                </h3>
                                <p className="mb-4">{memorialData.donationDescription}</p>
                                <Button className="bg-sepia-600 hover:bg-sepia-700 text-sepia-50">
                                    Make a Donation
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <Sidebar
                        photoCount={memorialData.stats.photoCount}
                        viewCount={memorialData.stats.viewCount}
                        contributorCount={memorialData.stats.contributorCount}
                        recentUpdates={memorialData.recentUpdates}
                    />
                </div>
            </main>

            <footer className="bg-sepia-200 text-sepia-800 py-8">
                <div className="container mx-auto px-4">
                    <p className="text-center">
                        &copy; {new Date().getFullYear()} Memorial Site. All rights
                        reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
