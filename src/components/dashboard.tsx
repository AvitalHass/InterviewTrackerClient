import { useState, useEffect } from "react";
import { Interview } from "../types/interview";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import StatsBar from "./stats-bar";
import FilterBar from "./filter-bar";
import InterviewCard from "./interview-card";
import { Link } from "react-router-dom";
import { Filter } from "@/types/filter";
import { fetchInterviews } from "@/lib/utils";

export default function Dashboard() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<Filter>({
    freeText: "",
    status: "all",
    type: "all",
    passed: "all"
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchInterviews();
        setInterviews(data?.interviews);
        setFilteredInterviews(data?.interviews);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const applyFilters = (interviews: Interview[], filters: Filter) => {
    let result = [...interviews];
    if (filters.freeText) {
      const searchTerm = filters.freeText?.toLowerCase();
      result = result.filter(
        interview =>
          interview?.company?.toLowerCase().includes(searchTerm) ||
          interview?.role?.toLowerCase().includes(searchTerm)
      );
    }
    if (filters.status !== "all") {
      result = result.filter(interview => interview?.status === filters.status);
    }
    if (filters.type !== "all") {
      result = result.filter(interview => interview?.type === filters.type);
    }
    if (filters.passed !== "all") {
      if (filters.passed === "undefined") {
        result = result.filter(interview => interview?.passed === undefined);
      } else {
        result = result.filter(
          interview => interview?.passed === (filters.passed === "true")
        );
      }
    }
    return result;
  };
  
  useEffect(() => {
    const timeout = setTimeout(() => {      
      setFilteredInterviews(applyFilters(interviews, filters));
    }, 400);
    return () => clearTimeout(timeout);
  }, [filters, interviews]);

  const resetFilters = () => {
    setFilters({
      freeText: "",
      status: "all",
      type: "all",
      passed: "all"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Interview Dashboard</h1>
          <p className="text-gray-500 mt-1">Track and manage your job interviews</p>
        </div>
        <Link to={"/interviewForm"}>
          <Button className="bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
            <CalendarPlus className="h-5 w-5 mr-2" />
            Add New Interview
          </Button>
        </Link>
      </div>

      {interviews?.length > 0 && (
        <StatsBar interviews={interviews} />
      )}

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6 h-64 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredInterviews?.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredInterviews?.map((interview: Interview) => (
            <motion.div
              key={interview?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <InterviewCard interview={interview} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          {interviews?.length === 0 ? (
            <div className="space-y-4">
              <CalendarPlus className="h-12 w-12 mx-auto text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900">No interviews yet</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Start tracking your job search by adding your first interview
              </p>
              <Link to={"/interviewForm"}>
                <Button className="mt-2 bg-indigo-600 hover:bg-indigo-700">
                  Add Your First Interview
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="h-12 w-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No matching interviews</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your filters to find what you're looking for
              </p>
              <Button
                variant="outline"
                onClick={resetFilters}
                className="mt-2"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
