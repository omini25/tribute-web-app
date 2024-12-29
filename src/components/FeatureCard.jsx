import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function FeatureCard({ icon: Icon, title, description }) {
    return (
        <Card className="flex flex-col items-center text-center">
            <CardHeader>
                <Icon className="h-12 w-12 text-primary mb-4" />
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>{description}</CardDescription>
            </CardContent>
        </Card>
    );
}

