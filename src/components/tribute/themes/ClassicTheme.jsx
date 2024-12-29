import { HeroBanner } from "@/components/tribute/themes/layout/HeroBanner.jsx"
import { MemorialNav } from "@/components/tribute/themes/layout/MemorialNav.jsx"
import { AboutSection } from "@/components/tribute/themes/sections/AboutSection.jsx"
import { FamilySection } from "@/components/tribute/themes/sections/FamilySection.jsx"
import { TimelineSection } from "@/components/tribute/themes/sections/TimelineSection.jsx"
import { Sidebar } from "@/components/tribute/themes/sections/Sidebar.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ClassicTheme({ memorialData }) {
    return (
        <div className="min-h-screen bg-stone-100 text-stone-800 font-serif">
            <HeroBanner
                name={memorialData.name}
                dates={memorialData.dates}
                profileImage={memorialData.profileImage}
                bannerImage={memorialData.bannerImage}
                theme="classic"
            />

            <div className="h-16" />

            <MemorialNav theme="classic" />

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

                        <FamilySection
                            immediateFamily={memorialData.immediateFamily}
                            extendedFamily={memorialData.extendedFamily}
                        />

                        <TimelineSection events={memorialData.timeline} />

                        <Card className="bg-white shadow-md">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">Donations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4">
                                    In lieu of flowers, please consider donating to the following
                                    organization in memory of {memorialData.name}:
                                </p>
                                <h3 className="text-lg font-semibold mb-2">
                                    {memorialData.donationOrg}
                                </h3>
                                <p className="mb-4">{memorialData.donationDescription}</p>
                                <Button className="bg-stone-800 hover:bg-stone-700 text-white">
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

            <footer className="bg-stone-200 text-stone-600 py-8">
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
