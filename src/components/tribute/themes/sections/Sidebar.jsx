import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, ImageIcon, Eye } from "lucide-react"

export function Sidebar({
                            photoCount,
                            viewCount,
                            contributorCount,
                            recentUpdates
                        }) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Contribute</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button className="w-full">Share a Memory</Button>
                    <Button variant="outline" className="w-full">
                        Add Photos
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Memorial Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">{photoCount}</p>
                                <p className="text-sm text-muted-foreground">Photos</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">{contributorCount}</p>
                                <p className="text-sm text-muted-foreground">Contributors</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Eye className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">{viewCount}</p>
                                <p className="text-sm text-muted-foreground">Views</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Updates</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentUpdates.map(update => (
                            <div key={update.id} className="flex items-start gap-4">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={update.user.image} />
                                    <AvatarFallback>{update.user.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <p className="text-sm">
                                        <span className="font-medium">{update.user.name}</span>{" "}
                                        {update.action}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{update.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
