import { useState, useEffect } from "react";
import { Search, Share2, Building, Users, HelpCircle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Interview } from "@/types/interview";
import { CardTitle, Card, CardContent, CardHeader } from "./ui/card";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "./ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion"
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { fetchInterviews } from "../lib/utils";

export default function PublicInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [companies, setCompanies] = useState<string[]>([]);

  useEffect(() => {
    fetchPublicInterviews();
  }, []);

  const fetchPublicInterviews = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInterviews(`?is_public=true&status=completed`);
      setInterviews(data?.interviews);
      setFilteredInterviews(data?.interviews);
      const uniqueCompanies = [...new Set<string>(data.interviews?.map((i: Interview) => i.company))].sort();
      setCompanies(uniqueCompanies);
    } catch (error) {
      console.error("Error fetching public interviews:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    let results = [...interviews];

    // Apply company filter
    if (companyFilter !== "all") {
      results = results.filter((i: Interview) => i.company === companyFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      results = results.filter((i: Interview) => i.type === typeFilter);
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(i =>
        i.company?.toLowerCase().includes(term) ||
        i.role?.toLowerCase().includes(term) ||
        i.questions?.some(q => q.toLowerCase().includes(term))
      );
    }

    // Apply sorting
    if (sortOrder === "newest") {
      results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortOrder === "oldest") {
      results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortOrder === "company") {
      results.sort((a, b) => a.company.localeCompare(b.company));
    }

    setFilteredInterviews(results);
  }, [searchTerm, companyFilter, typeFilter, sortOrder, interviews]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            <Share2 className="mr-2 h-6 w-6 text-indigo-600" />
            Community Interview Questions
          </h1>
          <p className="text-gray-500 mt-1">
            Learn from others' interview experiences
          </p>
        </div>
      </div>

      {/* Filter section */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search companies, roles, or questions..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map(company => (
                  <SelectItem key={company} value={company}>{company}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="in-person">In-person</SelectItem>
                <SelectItem value="panel">Panel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <div className="text-sm text-gray-500">
            {filteredInterviews.length} {filteredInterviews.length === 1 ? 'interview' : 'interviews'} found
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Newest
                  </div>
                </SelectItem>
                <SelectItem value="oldest">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Oldest
                  </div>
                </SelectItem>
                <SelectItem value="company">
                  <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4" />
                    Company
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Interviews list */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="p-6">
                <div className="h-6 bg-gray-200 rounded-md w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-100 rounded-md w-1/4"></div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredInterviews.length > 0 ? (
        <div className="grid gap-4">
          {filteredInterviews.map((interview) => (
            <Card key={interview.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-xl font-bold">{interview.role}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="text-indigo-700 bg-indigo-50 border-indigo-200">
                      {interview.type}
                    </Badge>
                    <Badge className="text-grey-700 bg-grey-50 border-grey-200">
                      {format(new Date(interview.date), "MMM yyyy")}
                    </Badge>
                  </div>
                </div>
                <h3 className="text-base font-medium text-gray-700 mt-1">
                  <Building className="inline mr-1 h-4 w-4" /> {interview.company}
                </h3>
              </CardHeader>
              <CardContent className="p-6 pt-1">
                <Accordion type="single" collapsible className="w-full">
                  {interview.interviewers && interview.interviewers.length > 0 && (
                    <AccordionItem value="interviewers">
                      <AccordionTrigger className="text-base font-medium text-gray-700">
                        <div className="flex items-center">
                          <Users className="mr-2 h-5 w-5" />
                          Interviewers
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pl-9">
                          {interview.interviewers.map((interviewer, idx) => (
                            <li key={idx} className="text-gray-700">
                              <span className="font-medium">{interviewer.name}</span>
                              {interviewer.title && <span className="text-gray-500"> — {interviewer.title}</span>}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}

                  {interview.questions && interview.questions.length > 0 && (
                    <AccordionItem value="questions">
                      <AccordionTrigger className="text-base font-medium text-gray-700">
                        <div className="flex items-center">
                          <HelpCircle className="mr-2 h-5 w-5" />
                          Interview Questions ({interview.questions.length})
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pl-9">
                          {interview.questions.map((question, idx) => (
                            <li key={idx} className="text-gray-700 list-disc ml-1">
                              {question}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
          <HelpCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No interviews found</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchTerm || companyFilter !== "all" || typeFilter !== "all"
              ? "Try adjusting your filters to see more interviews"
              : "No shared interviews yet. Be the first to share your interview experience!"}
          </p>
        </div>
      )}
    </div>
  );
}