import {PostInput} from "@/components/tribute/themes/firstTheme/PostInput.jsx";
import {PostCard} from "@/components/tribute/themes/firstTheme/PostCard.jsx";


const posts = [
    {
        name: "Name Surname",
        time: "1h ago",
        content:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut ero labore et dolore magna aliqua. Ut enim ad minim veniam."
    },
    {
        name: "Name Surname",
        time: "1h ago",
        content:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut ero labore et dolore magna aliqua. Ut enim ad minim veniam."
    },
    {
        name: "Name Surname",
        time: "1h ago",
        content:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut ero labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
    },
    {
        name: "Name Surname",
        time: "1h ago",
        content:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut ero labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
    },
    {
        name: "Name Surname",
        time: "1h ago",
        content:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut ero labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
    },
    {
        name: "Name Surname",
        time: "1h ago",
        content:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut ero labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation"
    }
]

export const Posts = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <PostInput />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post, index) => (
                    <PostCard
                        key={index}
                        name={post.name}
                        time={post.time}
                        content={post.content}
                    />
                ))}
            </div>
        </div>
    )
}
