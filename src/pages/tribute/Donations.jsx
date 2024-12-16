import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const Donations = () => {
    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <Card className="mb-8">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="text-gray-600 text-lg font-medium">
                            JOHN DOE TRIBUTE
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-blue-500">
                                <div className="text-xs uppercase tracking-wider mb-1">
                                    DONATOR NAME
                                </div>
                                <div className="text-sm">John Smith</div>
                            </div>
                            <div className="text-blue-500">
                                <div className="text-xs uppercase tracking-wider mb-1">
                                    RELATIONSHIP
                                </div>
                                <div className="text-sm">Friend</div>
                            </div>
                            <div className="text-gray-700 text-xl font-medium">$ 1,500</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-center">
                <Button
                    variant="outline"
                    className="px-8 text-blue-500 border-blue-500 hover:bg-blue-50"
                >
                    NEXT
                </Button>
            </div>
        </div>
    )
}
