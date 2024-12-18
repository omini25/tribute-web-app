import * as React from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardGallery() {
    const [selectedFiles, setSelectedFiles] = React.useState([])
    const [previews, setPreviews] = React.useState([])
    const fileInputRef = React.useRef(null)

    const handleFileSelect = event => {
        const files = Array.from(event.target.files || [])
        setSelectedFiles(prev => [...prev, ...files])

        // Create preview URLs
        files.forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result])
            }
            reader.readAsDataURL(file)
        })
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col items-center gap-8">
                {/* Upload Button */}
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*,video/*"
                        multiple
                        className="hidden"
                        aria-label="Upload image or video"
                    />
                    <Button
                        variant="outline"
                        onClick={handleUploadClick}
                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        UPLOAD IMAGE OR VIDEO
                    </Button>
                </div>

                {/* Preview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                    {[...Array(3)].map((_, index) => (
                        <div
                            key={index}
                            className="aspect-square relative bg-blue-50 rounded-lg overflow-hidden"
                        >
                            {previews[index] ? (
                                <img
                                    src={previews[index]}
                                    alt={`Uploaded preview ${index + 1}`}
                                    className="object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-blue-200">
                                    <Upload size={40} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
