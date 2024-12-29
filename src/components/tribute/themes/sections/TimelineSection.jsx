import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

export function TimelineSection({ events }) {
    return (
        <div className="relative space-y-8">
            {events.map((event, index) => (
                <div key={index} className="relative pl-8">
                    <div className="absolute left-0 top-0 h-full w-px bg-border">
                        <div className="absolute left-[-4px] top-6 h-2 w-2 rounded-full bg-primary" />
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="space-y-1">
                                <CardTitle>{event.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {format(event.date, "MMMM d, yyyy")}
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">{event.description}</p>
                            {event.img && (
                                <div className="relative aspect-video overflow-hidden rounded-lg">
                                    <img
                                        src={event.img}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    )
}
