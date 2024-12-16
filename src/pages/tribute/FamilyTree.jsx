import {FamilyTreeCard} from "@/components/tribute/themes/firstTheme/FamilyTreeCard.jsx";


export const FamilyTree = () => {
    const profiles = Array(6).fill({ name: "JOHN DOE" })

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                {profiles.map((profile, index) => (
                    <div
                        key={index}
                        className={`
              ${index === 2 || index === 3 ? "md:translate-y-16" : ""}
              ${index === 4 || index === 5 ? "md:translate-y-32" : ""}
            `}
                    >
                        <FamilyTreeCard name={profile.name} />
                    </div>
                ))}
            </div>
        </div>
    )
}
