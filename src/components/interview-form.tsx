import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, Loader2, Save, CalendarClock, AlertTriangle } from "lucide-react";
import { CardTitle, Card, CardContent, CardHeader, CardFooter } from "./ui/card";
import InterviewerField from "./interview-field";
import { Interviewer } from "@/types/interviewer";
import QuestionsField from "./question-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";
import { saveInterview, fetchInterviews } from "../lib/utils";

export default function InterviewForm() {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const interviewId = urlParams.get("id");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
    const [questions, setQuestions] = useState<string[]>([]);

    const defaultInterview = {
        company: "",
        role: "",
        date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        type: "video",
        interviewers: [],
        questions: [],
        confident_answers: "",
        challenging_questions: "",
        strengths: "",
        improvements: "",
        connection: "",
        comfort_level: "",
        passed: undefined,
        performance_rating: 5,
        notes: "",
        status: "scheduled",
        is_public: true
    };

    const [interview, setInterview] = useState(defaultInterview);

    useEffect(() => {
        if (interviewId) {
            const fetchData = async () => {
                setIsLoading(true);
                try {
                    const data = await fetchInterviews(`?id=${interviewId}`);
                    setInterview(data.interviews[0]);
                    setInterviewers(data.interviews[0].interviewers);
                    setQuestions(data.interviews[0].questions);
                } catch (error) {
                    console.error("Error fetching interview:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchData();
        }
    }, [interviewId]);

    const handleChange = (field: string, value: unknown) => {
        setInterview({
            ...interview,
            [field]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const formData = {
                ...interview,
                id: interviewId || "",
                interviewers,
                questions
            };
            await saveInterview(formData);
            navigate("/dashboard");
        } catch (error) {
            console.error("Error saving interview:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
                    <p className="mt-2 text-gray-500">Loading interview details...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center mb-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/dashboard")} className="mr-4"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {interviewId ? "Edit Interview" : "Add New Interview"}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {interviewId ? "Update your interview details" : "Record details about your upcoming interview"}
                    </p>
                </div>
            </div>

            <Card className="mb-8">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle className="text-xl">Interview Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Basic details section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="company">Company Name *</Label>
                                <Input
                                    id="company"
                                    required
                                    value={interview.company}
                                    onChange={(e) => handleChange("company", e.target.value)}
                                    placeholder="e.g. Acme Inc."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Position / Role *</Label>
                                <Input
                                    id="role"
                                    required
                                    value={interview.role}
                                    onChange={(e) => handleChange("role", e.target.value)}
                                    placeholder="e.g. Senior Software Engineer"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Date and Time *</Label>
                                <Input
                                    id="date"
                                    type="datetime-local"
                                    required
                                    value={interview.date}
                                    onChange={(e) => handleChange("date", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Interview Type *</Label>
                                <Select
                                    required
                                    value={interview.type}
                                    onValueChange={(value) => handleChange("type", value)}
                                >
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Select interview type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="phone">Phone</SelectItem>
                                        <SelectItem value="video">Video</SelectItem>
                                        <SelectItem value="in-person">In-Person</SelectItem>
                                        <SelectItem value="panel">Panel</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status *</Label>
                                <Select
                                    required
                                    value={interview.status}
                                    onValueChange={(value) => handleChange("status", value)}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="waiting_for_feedback">Waiting for Feedback</SelectItem>
                                        <SelectItem value="canceled">Canceled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Sharing preference */}
                        <div className="flex items-center space-x-2 border p-4 rounded-md bg-gray-50">
                            <Switch
                                id="is-public"
                                checked={interview.is_public}
                                onCheckedChange={(checked) => handleChange("is_public", checked)}
                            />
                            <div className="grid gap-1.5">
                                <Label htmlFor="is-public" className="font-medium">Share with community</Label>
                                <p className="text-sm text-gray-500">
                                    When enabled, company, role, interview type, interviewers, and questions will be shared anonymously with other users.
                                    Personal answers and ratings will remain private.
                                </p>
                            </div>
                        </div>

                        {/* Interviewers */}
                        <InterviewerField
                            interviewers={interviewers}
                            setInterviewers={setInterviewers}
                        />

                        {/* Post-interview questions (only show if completed) */}
                        {interview.status === "completed" || interview.status === "waiting_for_feedback" ? (
                            <div className="space-y-6 pt-4 border-t">
                                <h3 className="font-medium text-lg flex items-center">
                                    <CalendarClock className="h-5 w-5 mr-2 text-indigo-600" />
                                    Post-Interview Reflection
                                </h3>

                                {/* Questions asked */}
                                <QuestionsField
                                    questions={questions}
                                    setQuestions={setQuestions}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="confident_answers">Answers You Felt Confident About</Label>
                                        <Textarea
                                            id="confident_answers"
                                            value={interview.confident_answers || ""}
                                            onChange={(e) => handleChange("confident_answers", e.target.value)}
                                            placeholder="Which questions did you answer well?"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="challenging_questions">Questions That Caught You Off-Guard</Label>
                                        <Textarea
                                            id="challenging_questions"
                                            value={interview.challenging_questions || ""}
                                            onChange={(e) => handleChange("challenging_questions", e.target.value)}
                                            placeholder="Which questions were difficult?"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="strengths">What You Did Well</Label>
                                        <Textarea
                                            id="strengths"
                                            value={interview.strengths || ""}
                                            onChange={(e) => handleChange("strengths", e.target.value)}
                                            placeholder="What went well during the interview?"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="improvements">Areas for Improvement</Label>
                                        <Textarea
                                            id="improvements"
                                            value={interview.improvements || ""}
                                            onChange={(e) => handleChange("improvements", e.target.value)}
                                            placeholder="What would you improve for next time?"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="connection">Connection with Interviewer(s)</Label>
                                        <Textarea
                                            id="connection"
                                            value={interview.connection || ""}
                                            onChange={(e) => handleChange("connection", e.target.value)}
                                            placeholder="Did you feel connected with the interviewer(s)?"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="comfort_level">Comfort Explaining Skills</Label>
                                        <Textarea
                                            id="comfort_level"
                                            value={interview.comfort_level || ""}
                                            onChange={(e) => handleChange("comfort_level", e.target.value)}
                                            placeholder="How comfortable were you explaining your skills?"
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    <div className="space-y-4">
                                        <Label>Did You Pass This Interview?</Label>
                                        <RadioGroup
                                            value={interview.passed === true ? "true" : interview.passed === false ? "false" : "unknown"}
                                            onValueChange={(value) => {
                                                if (value === "unknown") {
                                                    handleChange("passed", undefined);
                                                } else {
                                                    handleChange("passed", value === "true");
                                                }
                                            }}
                                            className="flex space-x-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="true" id="passed-yes" />
                                                <Label htmlFor="passed-yes" className="font-normal">Yes</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="false" id="passed-no" />
                                                <Label htmlFor="passed-no" className="font-normal">No</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="unknown" id="passed-unknown" />
                                                <Label htmlFor="passed-unknown" className="font-normal">Don't know yet</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <Label>How Do You Rate Your Performance? (1-10)</Label>
                                            <span className="font-bold text-indigo-600">{interview.performance_rating}</span>
                                        </div>
                                        <Slider
                                            value={[interview.performance_rating || 5]}
                                            min={1}
                                            max={10}
                                            step={1}
                                            onValueChange={(value) => handleChange("performance_rating", value[0])}
                                            className="my-4"
                                        />
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <span>Poor</span>
                                            <span>Excellent</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-amber-50 p-4 rounded-md border border-amber-200 flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                                <div>
                                    <p className="text-amber-800 font-medium">Post-interview questions are hidden</p>
                                    <p className="text-amber-700 text-sm">
                                        Change the interview status to "Completed" or "Waiting for Feedback" after your interview to reflect on how it went.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        <div className="space-y-2 pt-4">
                            <Label htmlFor="notes">Additional Notes</Label>
                            <Textarea
                                id="notes"
                                value={interview.notes || ""}
                                onChange={(e) => handleChange("notes", e.target.value)}
                                placeholder="Any other thoughts or feelings about this interview..."
                                rows={4}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between mt-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("Dashboard")}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {interviewId ? "Update Interview" : "Save Interview"}
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            {!interviewId && (
                <div className="bg-indigo-50 p-4 rounded-md border border-indigo-100 mb-8">
                    <p className="text-indigo-800 text-sm">
                        <strong>Tip:</strong> For best results, fill out the post-interview questions within 24 hours of completing your interview while the details are still fresh in your mind.
                    </p>
                </div>
            )}
        </div>
    );
}
