
import { Facebook, Globe, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button.jsx"
import { Badge } from "@/components/ui/badge.jsx"

export default function EventCard({
                                      title,
                                      location,
                                      description,
                                      tags,
                                      buttonText,
                                      date,
                                      imageUrl
                                  }) {
    return (
        <div className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden mb-6">
            <div className="md:w-1/2 h-64 md:h-auto relative">
                <img src={imageUrl} alt={title} fill className="object-cover" />
            </div>

            <div className="md:w-1/2 p-6 bg-[#f8fafc]">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-medium text-gray-800 mb-1">{title}</h2>
                        <p className="text-[#38bdf8] uppercase text-sm">{location}</p>
                    </div>
                    <span className="text-4xl font-bold">{date}</span>
                </div>

                <p className="text-[#38bdf8] mb-6 leading-relaxed">{description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map(tag => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="text-[#38bdf8] bg-white"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                        <a href="#" className="text-[#38bdf8] hover:text-[#0284c7]">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-[#38bdf8] hover:text-[#0284c7]">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-[#38bdf8] hover:text-[#0284c7]">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-[#38bdf8] hover:text-[#0284c7]">
                            <Globe className="w-5 h-5" />
                        </a>
                    </div>

                    <Button className="bg-[#38bdf8] hover:bg-[#0284c7]">
                        {buttonText}
                    </Button>
                </div>
            </div>
        </div>
    )
}
