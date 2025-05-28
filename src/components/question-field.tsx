import { Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function QuestionsField({ questions, setQuestions }: {questions: string[], setQuestions: (value: string[]) => void}) {
  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-base">Questions They Asked</label>
        <Button 
          type="button" 
          size="sm" 
          variant="outline" 
          onClick={addQuestion}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Question
        </Button>
      </div>
      
      {questions.length > 0 ? (
        <div className="space-y-3">
          {questions.map((question, index) => (
            <div key={index} className="flex gap-3 items-center">
              <Input
                value={question}
                onChange={(e) => updateQuestion(index, e.target.value)}
                placeholder="What was their question?"
                className="flex-1"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => removeQuestion(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-gray-500 text-sm">No questions added yet</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addQuestion}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Question
          </Button>
        </div>
      )}
    </div>
  );
}