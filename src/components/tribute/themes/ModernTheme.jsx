import { HeroBanner } from "@/components/tribute/themes/layout/HeroBanner.jsx"
import { MemorialNav } from "@/components/tribute/themes/layout/MemorialNav.jsx"
import { AboutSection } from "@/components/tribute/themes/sections/AboutSection.jsx"
import { FamilySection } from "@/components/tribute/themes/sections/FamilySection.jsx"
import { TimelineSection } from "@/components/tribute/themes/sections/TimelineSection.jsx"
import { Sidebar } from "@/components/tribute/themes/sections/Sidebar.jsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ModernTheme({ memorialData }) {
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
            <HeroBanner
                name={memorialData.name}
                dates={memorialData.dates}
                profileImage={memorialData.profileImage}
                bannerImage={memorialData.bannerImage}
                theme="modern"
            />

            <div className="h-16" />

            <MemorialNav theme="modern" />

            <main className="container mx-auto px-4 py-8">
                <div className="grid gap-8 md:grid-cols-[1fr_300px]">
                    <div className="space-y-8">
                        <Tabs defaultValue="about" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="about">About</TabsTrigger>
                                <TabsTrigger value="family">Family</TabsTrigger>
                                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                                <TabsTrigger value="donate">Donate</TabsTrigger>
                            </TabsList>
                            <TabsContent value="about">
                                <Card>
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
                            </TabsContent>
                            <TabsContent value="family">
                                <Card>
                                    <CardContent className="pt-6">
                                        <FamilySection
                                            immediateFamily={memorialData.immediateFamily}
                                            extendedFamily={memorialData.extendedFamily}
                                        />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="timeline">
                                <Card>
                                    <CardContent className="pt-6">
                                        <TimelineSection events={memorialData.timeline} />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="donate">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Support a Cause</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="mb-4">
                                            Honor {memorialData.name}'s memory by supporting:
                                        </p>
                                        <h3 className="text-lg font-semibold mb-2">
                                            {memorialData.donationOrg}
                                        </h3>
                                        <p className="mb-4">{memorialData.donationDescription}</p>
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                            Donate Now
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <Sidebar
                        photoCount={memorialData.stats.photoCount}
                        viewCount={memorialData.stats.viewCount}
                        contributorCount={memorialData.stats.contributorCount}
                        recentUpdates={memorialData.recentUpdates}
                    />
                </div>
            </main>

            <footer className="bg-gray-200 text-gray-600 py-8">
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
