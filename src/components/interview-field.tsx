import { Interviewer } from "@/types/interviewer";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export default function InterviewerField({ interviewers, setInterviewers }: {interviewers: Interviewer[], setInterviewers: (value: Interviewer[]) => void}) {
  const addInterviewer = () => {
    setInterviewers([...interviewers, { name: "", title: "" }]);
  };

  const removeInterviewer = (index: number) => {
    const newInterviewers = [...interviewers];
    newInterviewers.splice(index, 1);
    setInterviewers(newInterviewers);
  };

  const updateInterviewer = (index: number, field: string, value: string) => {
    const newInterviewers = [...interviewers];
    newInterviewers[index] = { ...newInterviewers[index], [field]: value };
    setInterviewers(newInterviewers);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base">Interviewers</Label>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={addInterviewer}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Interviewer
        </Button>
      </div>
      
      {interviewers.length > 0 ? (
        <div className="space-y-3">
          {interviewers.map((interviewer, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="grid gap-2 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`interviewer-name-${index}`} className="text-xs">
                      Name
                    </Label>
                    <Input
                      id={`interviewer-name-${index}`}
                      value={interviewer.name}
                      onChange={(e) => updateInterviewer(index, "name", e.target.value)}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`interviewer-title-${index}`} className="text-xs">
                      Title
                    </Label>
                    <Input
                      id={`interviewer-title-${index}`}
                      value={interviewer.title}
                      onChange={(e) => updateInterviewer(index, "title", e.target.value)}
                      placeholder="Senior Engineer"
                    />
                  </div>
                </div>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeInterviewer(index)}
                className="mt-6"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-gray-500 text-sm">No interviewers added yet</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addInterviewer}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Interviewer
          </Button>
        </div>
      )}
    </div>
  );
}