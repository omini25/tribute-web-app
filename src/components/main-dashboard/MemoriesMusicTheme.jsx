import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import {
    Upload,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Play,
    Pause,
    Eye
} from "lucide-react"
import { server } from "@/server.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import Warm from "../../assets/Landing/images/2948b129-4e43-47d4-b0f5-2b4db8eec2e3.png"
import Cool from "../../assets/Landing/images/8ffeac91-b6be-40e2-80e8-70b2c42e0a57.png"
import Autumn from "../../assets/Landing/images/5e5bc4bb-31c3-4994-b66c-d53a887a3447.png"

const themes = [
    { id: 1, name: "Warm", color: "#FFA07A", image: Warm, title: "Warm" },
    { id: 1, name: "Cool", color: "#00BFFF", image: Cool, title: "Cool" },
    { id: 1, name: "Autumn", color: "#FF7F50", image: Autumn, title: "Autumn" }
]

const musicOptions = [
    {
        id: "peaceful_memories",
        name: "Peaceful Memories",
        file: "/music/farewell-to-w-111721.mp3"
    },
    {
        id: "gentle_reflection",
        name: "Gentle Reflection",
        file: "/music/funeral-165257.mp3"
    },
    {
        id: "celebration_of_life",
        name: "Celebration of Life",
        file: "/music/our-young-king-has-died-glbml-20940.mp3"
    },
    {
        id: "forever_remembered",
        name: "Forever Remembered",
        file: "/music/theme-1.mp3"
    }
]

export default function MemoriesMusicTheme() {
    const { id } = useParams()
    const [tribute, setTribute] = useState({
        music_option: "",
        selected_music_id: "",
        theme: "",
        music: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [title, setTitle] = useState("TRIBUTE")
    const [previewTheme, setPreviewTheme] = useState(null)
    const [audioPlaying, setAudioPlaying] = useState(false)
    const [audioElement, setAudioElement] = useState(null)

    useEffect(() => {
        setIsLoading(true)
        fetchTributeTitle()
        fetchTributeDetails()

        return () => {
            // Clean up audio on unmount
            if (audioElement) {
                audioElement.pause()
                audioElement.src = ""
            }
        }
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
        } finally {
            setIsLoading(false)
        }
    }


    const fetchTributeDetails = async () => {
        try {
            const response = await axios.get(`${server}/tribute/details/${id}`)
            const data = response.data
            console.log('API Response:', data) // Add this to debug

            // Set music option based on API response
            let musicOption = "no_music"
            if (data.music_type === "default") {
                musicOption = "select_music"
            } else if (data.music_type === "custom") {
                musicOption = "upload_music"
            }

            setTribute({
                music_option: musicOption,
                selected_music_id: data.selected_music_id || "",
                // Make sure to use the correct field name from your API
                theme: data.theme_name || data.theme || "", // Try alternative field names
                music: data.custom_music || null
            })

            // Debug the state update
            console.log('Updated tribute state:', {
                music_option: musicOption,
                selected_music_id: data.selected_music_id || "",
                theme: data.theme_name || data.theme || "",
                music: data.custom_music || null
            })
        } catch (error) {
            console.error("Error fetching tribute details:", error)
            toast.error("Failed to load tribute details")
        } finally {
            setIsLoading(false)
        }
    }


    const handleMusicOptionChange = value => {
        setTribute(prev => ({
            ...prev,
            music_option: value
        }))
    }

    const handleSelectedMusicChange = value => {
        setTribute(prev => ({
            ...prev,
            selected_music_id: value
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

        // Add theme
        formData.append("theme", tribute.theme || "")

        // Handle music options
        if (tribute.music_option === "select_music" && tribute.selected_music_id) {
            const selectedMusic = musicOptions.find(m => m.id === tribute.selected_music_id)
            if (selectedMusic) {
                formData.append("default_music", selectedMusic.file)
            }
        } else if (tribute.music_option === "upload_music" && tribute.music) {
            // Check if it's a File object before validating
            if (tribute.music instanceof File) {
                // Get the actual MIME type from the file
                const fileType = tribute.music.type.toLowerCase()
                // Check for both MIME types and file extensions
                if (fileType === "audio/mp3" ||
                    fileType === "audio/mpeg" ||
                    fileType === "audio/wav" ||
                    tribute.music.name.toLowerCase().endsWith(".mp3") ||
                    tribute.music.name.toLowerCase().endsWith(".wav")) {
                    formData.append("music_file", tribute.music)
                } else {
                    toast.error("Only MP3 and WAV files are allowed")
                    setIsLoading(false)
                    return
                }
            } else {
                toast.error("Invalid file format")
                setIsLoading(false)
                return
            }
        }



        try {
            const response = await axios.post(`${server}/tributes/${id}/music`, formData)

            if (response.data.message) {
                toast.success(response.data.message)
                // Reset audio player if needed
                if (audioElement) {
                    audioElement.pause()
                    setAudioElement(null)
                    setAudioPlaying(false)
                }
            }
        } catch (error) {
            console.error("Error updating tribute:", error)
            const message = error.response?.data?.message || "Failed to update tribute"
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    const openThemePreview = theme => {
        setPreviewTheme(theme)
    }

    const playMusic = musicFile => {
        if (audioElement) {
            audioElement.pause()
        }

        const audio = new Audio(musicFile)
        audio.addEventListener("ended", () => setAudioPlaying(false))
        audio.play()
        setAudioElement(audio)
        setAudioPlaying(true)
    }

    const pauseMusic = () => {
        if (audioElement) {
            audioElement.pause()
            setAudioPlaying(false)
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
                        {isLoading && (
                            <div className="flex justify-center items-center">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        )}
                        {!isLoading && (
                            <>
                                <MusicOptions
                                    tribute={tribute}
                                    musicOptions={musicOptions}
                                    onOptionChange={handleMusicOptionChange}
                                    onSelectedMusicChange={handleSelectedMusicChange}
                                    onFileChange={handleFileChange}
                                    playMusic={playMusic}
                                    pauseMusic={pauseMusic}
                                    isPlaying={audioPlaying}
                                    setAudioElement={setAudioElement}  // Add these props
                                    setAudioPlaying={setAudioPlaying}
                                />
                                <ThemeSelection
                                    tribute={tribute}
                                    themes={themes}
                                    onChange={handleThemeChange}
                                    onPreview={openThemePreview}
                                />
                                <div className="flex justify-center">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="bg-warm-500 hover:bg-warm-600"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : null}
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                                <NavigationButtons id={id} />
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Theme Preview Modal */}
            <ThemePreviewModal
                theme={previewTheme}
                onClose={() => setPreviewTheme(null)}
            />
        </div>
    )
}

const MusicOptions = ({
                          tribute,
                          musicOptions,
                          onOptionChange,
                          onSelectedMusicChange,
                          onFileChange,
                          playMusic,
                          pauseMusic,
                          isPlaying,
                          setAudioElement,  // Add these props
                          setAudioPlaying
                      }) => {
    const handlePlayPause = (music) => {
        if (isPlaying) {
            pauseMusic()
        } else {
            const audio = new Audio()
            audio.src = music.file
            audio.addEventListener('ended', () => {
                setAudioPlaying(false)
                setAudioElement(null)
            })
            setAudioElement(audio)
            audio.play().then(() => {
                setAudioPlaying(true)
            }).catch((error) => {
                console.error('Error playing audio:', error)
                toast.error('Failed to play audio')
            })
        }
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-warm-700">Music Options</h3>
            <RadioGroup value={tribute.music_option} onValueChange={onOptionChange}>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no_music" id="no_music"/>
                    <Label htmlFor="no_music">No Music</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="select_music" id="select_music"/>
                    <Label htmlFor="select_music">Select Music</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upload_music" id="upload_music"/>
                    <Label htmlFor="upload_music">Upload Music</Label>
                </div>
            </RadioGroup>

            {tribute.music_option === "select_music" && (
                <div className="pt-2 space-y-4">
                    <Select
                        value={tribute.selected_music_id}
                        onValueChange={onSelectedMusicChange}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a music track"/>
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            {musicOptions.map(option => (
                                <SelectItem key={option.id} value={option.id}>
                                    {option.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {tribute.selected_music_id && (
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const music = musicOptions.find(
                                        m => m.id === tribute.selected_music_id
                                    )
                                    if (music) {
                                        handlePlayPause(music)
                                    }
                                }}
                            >
                                {isPlaying ? (
                                    <Pause className="h-4 w-4"/>
                                ) : (
                                    <Play className="h-4 w-4"/>
                                )}
                                {isPlaying ? "Pause" : "Preview"}
                            </Button>
                            <span className="text-sm text-muted-foreground">
                    {musicOptions.find(m => m.id === tribute.selected_music_id)?.name}
                </span>
                        </div>
                    )}
                </div>
            )}

            {tribute.music_option === "upload_music" && (
                <div className="pt-2">
                    <Label htmlFor="music-upload" className="cursor-pointer">
                        <div
                            className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                <span className="flex items-center space-x-2">
                                  <Upload className="w-6 h-6 text-warm-500"/>
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
                    {tribute.music && (
                        <div className="flex items-center space-x-2 mt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (tribute.music) {
                                        isPlaying
                                            ? pauseMusic()
                                            : playMusic(URL.createObjectURL(tribute.music))
                                    }
                                }}
                            >
                                {isPlaying ? (
                                    <Pause className="h-4 w-4"/>
                                ) : (
                                    <Play className="h-4 w-4"/>
                                )}
                                {isPlaying ? "Pause" : "Preview"}
                            </Button>
                            <span className="text-sm text-muted-foreground">
                              {tribute.music.name}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>

    )
}

const ThemeSelection = ({ tribute, themes, onChange, onPreview }) => (
    <div className="space-y-4">
        <h3 className="text-xl font-semibold text-warm-700">Select Theme</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map(theme => (
                <Card
                    key={theme.id} // Changed from theme.name to theme.id
                    className={`cursor-pointer transition-all ${
                        tribute.theme === theme.name ? "ring-2 ring-warm-500" : ""
                    }`}
                    onClick={() => onChange(theme.name)}
                >
                    <div
                        className="aspect-video relative group"
                        style={{ backgroundColor: theme.color }}
                    >
                        <img
                            src={theme.image || "/placeholder.svg"}
                            alt={theme.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                onClick={e => {
                                    e.preventDefault()
                                    onPreview({
                                        id: theme.id,
                                        name: theme.name,
                                        title: theme.title,
                                        url: `/${theme.name}/${theme.id}/${theme.title}`
                                    })
                                }}
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </Button>
                        </div>
                    </div>
                    <CardContent className="p-4">
                        <h4 className="font-semibold text-warm-700">{theme.name}</h4>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
)

const ThemePreviewModal = ({ theme, onClose }) => {
    if (!theme) return null

    return (
        <Dialog open={!!theme} onOpenChange={() => onClose()}>
            <DialogContent className="max-w-6xl h-[90vh] bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">
                        {theme.name} Theme Preview
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4 flex-1 h-full">
                    <iframe
                        src={theme.url}
                        title={`${theme.name} Preview`}
                        className="w-full h-[calc(90vh-8rem)] border-0 rounded-lg"
                    />
                </div>
                <DialogClose asChild>
                    <Button variant="outline">Close Preview</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}

const NavigationButtons = ({ tribute, id }) => (
    <div className="flex justify-between pt-8">
        <Link to={`/dashboard/memories/donations/${id}`}>
            <Button variant="outline" className="text-warm-700">
                <ChevronLeft className="h-4 w-4 mr-2" /> Donations
            </Button>
        </Link>
        <Link to={`/${tribute?.theme?.toLowerCase()}/${id}/${tribute?.title}`}>
            <Button variant="outline" className="text-warm-700">
                Preview <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
        </Link>
    </div>
)