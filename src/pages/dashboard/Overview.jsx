import {TributeCard} from "@/components/dashboard/TributeCard.jsx";
import {Post} from "@/components/dashboard/Posts.jsx";

export const Overview = () => {
    return (
        <>
            <div className="mb-8">
                <div className="flex gap-4">
                    <TributeCard/>
                    <TributeCard variant="dashed"/>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <Post
                    name="Name Surname"
                    time="1h ago"
                    content="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco portis laboris"
                    likes={509}
                />
                <Post
                    name="Name Surname"
                    time="1h ago"
                    content="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
                />
            </div>
        </>
    )
}