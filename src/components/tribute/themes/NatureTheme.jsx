import { HeroBanner } from "@/components/tribute/themes/layout/HeroBanner.jsx"
import { MemorialNav } from "@/components/tribute/themes/layout/MemorialNav.jsx"
import { AboutSection } from "@/components/tribute/themes/sections/AboutSection.jsx"
import { FamilySection } from "@/components/tribute/themes/sections/FamilySection.jsx"
import { TimelineSection } from "@/components/tribute/themes/sections/TimelineSection.jsx"
import { Sidebar } from "@/components/tribute/themes/sections/Sidebar.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf } from "lucide-react"

export function NatureTheme({ memorialData }) {
    return (
        <div className="min-h-screen bg-green-50 text-green-900 font-sans">
            <HeroBanner
                name={memorialData.name}
                dates={memorialData.dates}
                profileImage={memorialData.profileImage}
                bannerImage={memorialData.bannerImage}
                theme="nature"
            />

            <div className="h-16" />

            <MemorialNav theme="nature" />

            <main className="container mx-auto px-4 py-8">
                <div className="grid gap-8 md:grid-cols-[1fr_300px]">
                    <div className="space-y-8">
                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardContent className="pt-6">
                                <AboutSection
                                    biography={memorialData.biography}
                                    birthDate={memorialData.birthDate}
                                    birthPlace={memorialData.birthPlace}
                                    deathDate={memorialData.deathDate}
                                    deathPlace={memorialData.deathPlace}
                                />
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardContent className="pt-6">
                                <FamilySection
                                    immediateFamily={memorialData.immediateFamily}
                                    extendedFamily={memorialData.extendedFamily}
                                />
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardContent className="pt-6">
                                <TimelineSection events={memorialData.timeline} />
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Leaf className="mr-2 h-5 w-5 text-green-600" />
                                    Plant a Tree in Memory
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4">
                                    Honour {memorialData.name}'s love for nature by planting a tree
                                    through:
                                </p>
                                <h3 className="text-lg font-semibold mb-2">
                                    {memorialData.donationOrg}
                                </h3>
                                <p className="mb-4">{memorialData.donationDescription}</p>
                                <Button className="bg-green-600 hover:bg-green-700 text-white">
                                    Plant a Tree
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

            <footer className="bg-green-100 text-green-800 py-8">
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
