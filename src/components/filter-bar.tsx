import { Search, X } from "lucide-react";
import { Filter } from "@/types/filter";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export default function FilterBar({ filters, setFilters, resetFilters }: { filters: Filter, setFilters: (value: Filter) => void, resetFilters: () => void }) {
  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="search" className="text-sm">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Company or role..."
              value={filters.freeText}
              onChange={(e) => handleFilterChange("freeText", e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="status" className="text-sm">
            Status
          </Label>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
            
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="waiting_for_feedback">Waiting for feedback</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="type" className="text-sm">
            Interview Type
          </Label>
          <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange("type", value)}
          >
            <SelectTrigger id="type" className="w-full">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="in-person">In-person</SelectItem>
              <SelectItem value="panel">Panel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="result" className="text-sm">
            Result
          </Label>
          <Select
            value={filters.passed}
            onValueChange={(value) => handleFilterChange("passed", value)}
          >
            <SelectTrigger id="result" className="w-full">
              <SelectValue placeholder="All results" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All results</SelectItem>
              <SelectItem value="true">Passed</SelectItem>
              <SelectItem value="false">Did not pass</SelectItem>
              <SelectItem value="undefined">Not known yet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="flex items-center gap-1 text-gray-500"
        >
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      </div>
    </div>
  );
}