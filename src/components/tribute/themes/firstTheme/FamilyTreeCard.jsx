import { Card, CardHeader, CardContent } from "@/components/ui/card.jsx"

export const FamilyTreeCard = ({ name }) => {
    return (
        <Card className="w-full max-w-[200px]">
            <CardHeader className="bg-blue-100 p-4">
                <h3 className="text-sm font-semibold text-blue-600">{name}</h3>
            </CardHeader>
            <CardContent className="p-0">
                <div className="bg-slate-50 h-[150px] w-full" />
            </CardContent>
        </Card>
    )
}
