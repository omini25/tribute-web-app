import EventCard from "@/components/tribute/themes/firstTheme/EventCard.jsx";

export const Events = () => {
    return (
        <>
            <div className="max-w-6xl mx-auto p-6">
                <EventCard
                    title="Event Name"
                    location="ST GORGES CHURCH OHIO USA"
                    description="Culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,"
                    tags={["RSVP", "SERVICE", "OTHER"]}
                    buttonText="RSVP"
                    date="19TH"
                    imageUrl="/placeholder.svg?height=400&width=600"
                />

                <EventCard
                    title="EVENT NAME"
                    location="ZOOM"
                    description="Culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,"
                    tags={["WEB", "ONLINE", "OTHER"]}
                    buttonText="JOIN"
                    date="19TH"
                    imageUrl="/placeholder.svg?height=400&width=600"
                />
            </div>


        </>
    )
}