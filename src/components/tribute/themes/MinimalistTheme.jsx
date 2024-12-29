import { HeroBanner } from "@/components/tribute/themes/layout/HeroBanner.jsx"
import { MemorialNav } from "@/components/tribute/themes/layout/MemorialNav.jsx"
import { AboutSection } from "@/components/tribute/themes/sections/AboutSection.jsx"
import { FamilySection } from "@/components/tribute/themes/sections/FamilySection.jsx"
import { TimelineSection } from "@/components/tribute/themes/sections/TimelineSection.jsx"
import { Sidebar } from "@/components/tribute/themes/sections/Sidebar.jsx"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function MinimalistTheme({ memorialData }) {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <HeroBanner
                name={memorialData.name}
                dates={memorialData.dates}
                profileImage={memorialData.profileImage}
                bannerImage={memorialData.bannerImage}
                theme="minimalist"
            />

            <div className="h-16" />

            <MemorialNav theme="minimalist" />

            <main className="container mx-auto px-4 py-8">
                <div className="grid gap-8 md:grid-cols-[1fr_300px]">
                    <div className="space-y-8">
                        <AboutSection
                            biography={memorialData.biography}
                            birthDate={memorialData.birthDate}
                            birthPlace={memorialData.birthPlace}
                            deathDate={memorialData.deathDate}
                            deathPlace={memorialData.deathPlace}
                        />

                        <Separator />

                        <FamilySection
                            immediateFamily={memorialData.immediateFamily}
                            extendedFamily={memorialData.extendedFamily}
                        />

                        <Separator />

                        <TimelineSection events={memorialData.timeline} />

                        <Separator />

                        <section>
                            <h2 className="text-2xl font-light mb-4">Donations</h2>
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="mb-4">
                                        To honor {memorialData.name}'s memory, please consider a
                                        donation to:
                                    </p>
                                    <h3 className="text-lg font-medium mb-2">
                                        {memorialData.donationOrg}
                                    </h3>
                                    <p className="mb-4 text-gray-600">
                                        {memorialData.donationDescription}
                                    </p>
                                    <Button variant="outline">Make a Donation</Button>
                                </CardContent>
                            </Card>
                        </section>
                    </div>

                    <Sidebar
                        photoCount={memorialData.stats.photoCount}
                        viewCount={memorialData.stats.viewCount}
                        contributorCount={memorialData.stats.contributorCount}
                        recentUpdates={memorialData.recentUpdates}
                    />
                </div>
            </main>

            <footer className="border-t py-8">
                <div className="container mx-auto px-4">
                    <p className="text-center text-gray-500">
                        &copy; {new Date().getFullYear()} Memorial Site. All rights
                        reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
