import { Card } from "@/components/ui/card"


export const Gallerys = () => {
    // Create an array of 8 items for the grid
    const items = Array(8).fill(null)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {items.map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                        <div className="aspect-square relative bg-slate-50">
                            <img
                                src="/placeholder.svg"
                                alt="Placeholder image"
                                fill
                                className="object-contain p-16"
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
