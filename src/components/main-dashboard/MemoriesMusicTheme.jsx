import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Upload, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Warm from "../../assets/Landing/images/2948b129-4e43-47d4-b0f5-2b4db8eec2e3.png"
import Cool from "../../assets/Landing/images/8ffeac91-b6be-40e2-80e8-70b2c42e0a57.png"
import Autumn from "../../assets/Landing/images/5e5bc4bb-31c3-4994-b66c-d53a887a3447.png"

const themes = [
    { name: "Warm", color: "#FFA07A", image: Warm },
    { name: "Cool", color: "#00BFFF", image: Cool },
    { name: "Autumn", color: "#FF7F50", image: Autumn }
]

export default function MemoriesMusicTheme() {
    const { id } = useParams()
    const [tribute, setTribute] = useState({
        no_music: false,
        default_music: false,
        theme: "",
        music: null
    })
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState("TRIBUTE")

    useEffect(() => {
        fetchTributeTitle()
        fetchTributeDetails()
    }, [])

    const fetchTributeTitle = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}")
            const response = await axios.get(
                `${server}/tribute/title/image/${user.id}`
            )
            setTitle(response.data.title || "TRIBUTE")
        } catch (error) {
            console.error("Error fetching tribute title:", error)
        }
    }

    const fetchTributeDetails = async () => {
        try {
            const response = await axios.get(`${server}/tribute/details/${id}`)
            const data = response.data
            setTribute({
                no_music: data.no_music,
                default_music: data.default_music,
                theme: data.theme || "",
                music: null
            })
        } catch (error) {
            console.error("Error fetching tribute details:", error)
            toast({
                title: "Error",
                description: "Failed to load tribute details. Please try again.",
                variant: "destructive"
            })
        }
    }

    const handleMusicOptionChange = value => {
        setTribute(prev => ({
            ...prev,
            no_music: value === "no_music",
            default_music: value === "default_music"
        }))
    }

    const handleThemeChange = theme => {
        setTribute(prev => ({ ...prev, theme }))
    }

    const handleFileChange = e => {
        const file = e.target.files?.[0]
        if (file) {
            setTribute(prev => ({ ...prev, music: file }))
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("no_music", tribute.no_music.toString())
        formData.append("default_music", tribute.default_music.toString())
        formData.append("theme", tribute.theme)
        if (tribute.music) {
            formData.append("music_file", tribute.music)
        }

        try {
            const response = await axios.put(`${server}/tributes/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: "Tribute updated successfully!"
                })
            } else {
                throw new Error("Failed to update tribute")
            }
        } catch (error) {
            console.error("Error updating tribute:", error)
            toast({
                title: "Error",
                description: "Failed to update tribute. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-warm-800 text-center">
                            {title}
                        </CardTitle>
                        <p className="text-xl text-warm-600 text-center">THEME AND MUSIC</p>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <MusicOptions
                            tribute={tribute}
                            onChange={handleMusicOptionChange}
                            onFileChange={handleFileChange}
                        />
                        <ThemeSelection
                            tribute={tribute}
                            themes={themes}
                            onChange={handleThemeChange}
                        />
                        <div className="flex justify-center">
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="bg-warm-500 hover:bg-warm-600 "
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                        <NavigationButtons id={id} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

const MusicOptions = ({ tribute, onChange, onFileChange }) => (
    <div className="space-y-4">
        <h3 className="text-xl font-semibold text-warm-700">Music Options</h3>
        <RadioGroup
            defaultValue={
                tribute.no_music
                    ? "no_music"
                    : tribute.default_music
                        ? "default_music"
                        : "custom_music"
            }
            onValueChange={onChange}
        >
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="no_music" id="no_music" />
                <Label htmlFor="no_music">No Music</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="default_music" id="default_music" />
                <Label htmlFor="default_music">Default Music</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom_music" id="custom_music" />
                <Label htmlFor="custom_music">Custom Music</Label>
            </div>
        </RadioGroup>
        <div className="pt-2">
            <Label htmlFor="music-upload" className="cursor-pointer">
                <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
          <span className="flex items-center space-x-2">
            <Upload className="w-6 h-6 text-warm-500" />
            <span className="font-medium text-warm-600">
              {tribute.music ? tribute.music.name : "Click to upload music"}
            </span>
          </span>
                    <input
                        id="music-upload"
                        type="file"
                        className="hidden"
                        onChange={onFileChange}
                        accept="audio/*"
                    />
                </div>
            </Label>
        </div>
    </div>
)

const ThemeSelection = ({ tribute, themes, onChange }) => (
    <div className="space-y-4">
        <h3 className="text-xl font-semibold text-warm-700">Select Theme</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map(theme => (
                <Card
                    key={theme.name}
                    className={`cursor-pointer transition-all ${
                        tribute.theme === theme.name ? "ring-2 ring-warm-500" : ""
                    }`}
                    onClick={() => onChange(theme.name)}
                >
                    <div
                        className="aspect-video"
                        style={{ backgroundColor: theme.color }}
                    >
                        <img
                            src={theme.image || "/placeholder.svg"}
                            alt={theme.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <CardContent className="p-4">
                        <h4 className="font-semibold text-warm-700">{theme.name}</h4>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
)

const NavigationButtons = ({ id, title }) => (
    <div className="flex justify-between pt-8">
        <Link to={`/dashboard/memories/donations/${id}`}>
            <Button variant="outline" className="text-warm-700">
                <ChevronLeft className="h-4 w-4 mr-2" /> Donations
            </Button>
        </Link>
        <Link to={`/theme-warm/${id}/${title}`}>
            <Button variant="outline" className="text-warm-700">
                Preview <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
        </Link>
    </div>
)
