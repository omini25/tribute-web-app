import PropTypes from 'prop-types';
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

export function FamilyTreeMinimal({ data = [] }) {
    // Group family members by relationship
    const groupedMembers = data.reduce((acc, member) => {
        if (!acc[member.relationship]) {
            acc[member.relationship] = [];
        }
        acc[member.relationship].push(member);
        return acc;
    }, {});

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="relative">
                {/* Central Node (Deceased) */}
                <div className="flex justify-center mb-16">
                    <Card className="bg-warm-100 border-warm-300 p-4 relative">
                        <div className="flex items-center gap-3">
                            <div className="bg-warm-200 p-2 rounded-full">
                                <User className="h-6 w-6 text-warm-700" />
                            </div>
                            <div>
                                <p className="text-warm-900 font-medium">Deceased</p>
                                <p className="text-warm-600 text-sm">Memorial Owner</p>
                            </div>
                        </div>
                        {/* Vertical line connector */}
                        <div className="absolute bottom-0 left-1/2 w-px h-8 bg-warm-300 -mb-8 transform -translate-x-1/2" />
                    </Card>
                </div>

                {/* Family Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {Object.entries(groupedMembers).map(
                        ([relationship, members]) => (
                            <div key={relationship} className="relative">
                                {/* Relationship Label */}
                                <div className="mb-4">
                                    <h3 className="text-warm-600 font-medium capitalize">
                                        {relationship}s ({members.length})
                                    </h3>
                                </div>

                                {/* Members List */}
                                <div className="space-y-4">
                                    {members.map((member, index) => (
                                        <Card
                                            key={index}
                                            className="bg-warm-50 border-warm-200 p-4 transition-all duration-200 hover:shadow-md"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="bg-warm-100 p-2 rounded-full">
                                                    <User className="h-5 w-5 text-warm-600" />
                                                </div>
                                                <div>
                                                    <p className="text-warm-800 font-medium">
                                                        {member.full_name}
                                                    </p>
                                                    <p className="text-warm-500 text-sm capitalize">
                                                        {member.relationship}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Connector Lines */}
                                            <div className="absolute top-0 left-1/2 w-px h-4 bg-warm-300 -mt-4 transform -translate-x-1/2" />
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

FamilyTreeMinimal.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            full_name: PropTypes.string.isRequired,
            relationship: PropTypes.string.isRequired,
        })
    ),
};