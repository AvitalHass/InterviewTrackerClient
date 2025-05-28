
import { Building, CheckCircle, Clock, CalendarCheck } from "lucide-react";
import { Interview } from "../types/interview";
import { Card, CardContent } from "./ui/card";

export default function StatsBar({ interviews }: { interviews: Interview[] }) {
    // Calculate stats
    const totalInterviews = interviews.length;
    const uniqueCompanies = new Set(interviews.map(i => i.company)).size;
    const completedInterviews = interviews.filter(i => i.status === "completed").length;
    const passedInterviews = interviews.filter(i => i.passed === true).length;
    const passRate = completedInterviews > 0 ? Math.round((passedInterviews / completedInterviews) * 100) : 0;
    const upcomingInterviews = interviews.filter(i =>
        i.status === "scheduled" && new Date(i.date) > new Date()
    ).length;

    const stats = [
        {
            label: "Total Interviews",
            value: totalInterviews,
            icon: <CalendarCheck className="h-5 w-5 text-indigo-600" />,
        },
        {
            label: "Companies",
            value: uniqueCompanies,
            icon: <Building className="h-5 w-5 text-violet-600" />,
        },
        {
            label: "Upcoming",
            value: upcomingInterviews,
            icon: <Clock className="h-5 w-5 text-blue-600" />,
        },
        {
            label: "Pass Rate",
            value: `${passRate}%`,
            icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <Card key={index} className="shadow-sm">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="rounded-full p-2 bg-gray-100 mb-2">
                            {stat.icon}
                        </div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}