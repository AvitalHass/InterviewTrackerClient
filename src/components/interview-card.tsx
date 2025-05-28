import { Interview } from "@/types/interview";
import { format } from "date-fns";
import { CalendarClock, Clock, Award, Building, User, Edit } from "lucide-react";
import { CardTitle, Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";

// Status badge colors
const statusColors = {
  scheduled: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  completed: "bg-green-100 text-green-800 hover:bg-green-200",
  canceled: "bg-red-100 text-red-800 hover:bg-red-200",
  waiting_for_feedback: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  none: "bg-green-100 text-green-800 hover:bg-green-200"
};

// Type icon mapping
const typeIcons = {
  phone: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
  video: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>,
  "in-person": <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  panel: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
};

export default function InterviewCard({ interview }:{interview: Interview}) {
  const isPast = new Date(interview.date) < new Date();

  return (
    <Card className="h-full flex flex-col gap-0.5">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold line-clamp-1">{interview.role}</CardTitle>
          <Badge className={statusColors[interview.status as keyof typeof statusColors ?? 'none']}>
            {interview.status?.replace('_', ' ')}
          </Badge>
        </div>
        <div className="text-base font-medium text-gray-700 flex items-center mt-1">
          <Building className="h-4 w-4 mr-1 text-gray-500" />
          {interview.company}
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <CalendarClock className="h-4 w-4 mr-2 text-gray-400" />
            {format(new Date(interview.date), "MMM d, yyyy")}
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            {format(new Date(interview.date), "h:mm a")}
          </div>
          <div className="flex items-center text-gray-600">
            <div className="mr-2 text-gray-400">
              {typeIcons[interview.type as keyof typeof typeIcons]}
            </div>
            {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Interview
          </div>
          
          {interview.interviewers && interview.interviewers.length > 0 && (
            <div className="flex items-start text-gray-600 mt-3">
              <User className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
              <div>
                <span className="block text-xs text-gray-500 mb-1">Interviewer{interview.interviewers.length > 1 ? 's' : ''}</span>
                {interview.interviewers.map((interviewer, index) => (
                  <div key={index} className="text-sm">
                    {interviewer.name}{interviewer.title ? `, ${interviewer.title}` : ''}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {interview.passed !== undefined && (
            <div className="flex items-center mt-3">
              <Award className="h-4 w-4 mr-2 text-gray-400" />
              <span className={`font-medium ${interview.passed ? 'text-green-600' : 'text-gray-600'}`}>
                {interview.passed ? 'Passed' : 'Did not pass'}
              </span>
            </div>
          )}
          
          {interview.performance_rating && (
            <div className="mt-3">
              <div className="text-xs text-gray-500 mb-1">Self-rating</div>
              <div className="flex items-center">
                <div className="relative w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-indigo-600" 
                    style={{width: `${interview.performance_rating * 10}%`}}
                  />
                </div>
                <span className="ml-2 text-sm font-medium">{interview.performance_rating}/10</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <div className="pt-2">
        <Link 
          to={`/interviewForm?id=${interview.id}`} 
          className="w-full"
        >
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            {isPast ? 'View Details' : 'Edit Details'}
          </Button>
        </Link>
      </div>
    </Card>
  );
}