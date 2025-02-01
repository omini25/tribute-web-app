import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function FamilyGroup({ title, members }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {members && members.map((member, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={member.image} />
                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {member.relation}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export function FamilySection({ immediateFamily, extendedFamily }) {
    return (
        <div className="space-y-6">
            <FamilyGroup title="Immediate Family" members={immediateFamily} />
            <FamilyGroup title="Extended Family" members={extendedFamily} />
        </div>
    )
}
