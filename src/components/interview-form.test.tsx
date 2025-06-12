import { render, screen, waitFor, RenderResult } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import InterviewForm from '../components/interview-form';
import { fetchInterviews } from '../lib/utils';

// Mock the utilities
vi.mock('../lib/utils', () => ({
    saveInterview: vi.fn(),
    fetchInterviews: vi.fn(),
    cn: (...classes: string[]) => classes.filter(Boolean).join(' ')
}));

// Mock the child components
vi.mock('../components/interview-field', () => ({
    default: ({ interviewers, setInterviewers }: any) => (
        <div data-testid="interviewer-field">
            <button
                onClick={() => setInterviewers([...interviewers, { name: 'Test Interviewer', role: 'Engineer' }])}
                data-testid="add-interviewer"
            >
                Add Interviewer
            </button>
            <div data-testid="interviewers-count">{interviewers.length}</div>
        </div>
    )
}));

vi.mock('../components/question-field', () => ({
    default: ({ questions, setQuestions }: any) => (
        <div data-testid="questions-field">
            <button
                onClick={() => setQuestions([...questions, 'Test Question'])}
                data-testid="add-question"
            >
                Add Question
            </button>
            <div data-testid="questions-count">{questions.length}</div>
        </div>
    )
}));

// Mock UI components
vi.mock('../components/ui/card', () => ({
    Card: ({ children, className }: any) => <div className={className}>{children}</div>,
    CardHeader: ({ children }: any) => <div>{children}</div>,
    CardTitle: ({ children }: any) => <h2>{children}</h2>,
    CardContent: ({ children }: any) => <div>{children}</div>,
    CardFooter: ({ children }: any) => <div>{children}</div>
}));

vi.mock('../components/ui/button', () => ({
    Button: ({ children, onClick, disabled, type, variant, size, className, ...props }: any) => (
        <button
            onClick={onClick}
            disabled={disabled}
            type={type}
            className={className}
            data-variant={variant}
            data-size={size}
            {...props}
        >
            {children}
        </button>
    )
}));

vi.mock('../components/ui/input', () => ({
    Input: ({ id, value, onChange, type, required, placeholder, ...props }: any) => (
        <input
            id={id}
            value={value}
            onChange={onChange}
            type={type}
            required={required}
            placeholder={placeholder}
            {...props}
        />
    )
}));

vi.mock('../components/ui/label', () => ({
    Label: ({ children, htmlFor }: any) => <label htmlFor={htmlFor}>{children}</label>
}));

vi.mock('../components/ui/select', () => ({
    Select: ({ value, onValueChange, required }: any) => (
        <div data-testid="select-wrapper">
            <select
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                required={required}
                data-testid="select"
            >
                <option value="">Select an option</option>
                <option value="phone">Phone</option>
                <option value="video">Video</option>
                <option value="in-person">In-Person</option>
                <option value="panel">Panel</option>
            </select>
        </div>
    ),
    SelectTrigger: () => null,
    SelectValue: () => null,
    SelectContent: () => null,
    SelectItem: () => null
}));

vi.mock('../components/ui/switch', () => ({
    Switch: ({ id, checked, onCheckedChange }: any) => (
        <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            data-testid="switch"
        />
    )
}));

vi.mock('../components/ui/radio-group', () => ({
    RadioGroup: ({ children, className }: any) => (
        <div className={className} data-testid="radio-group">
            {children.map((child: any, index: number) => (
                <div key={index}>
                    {child.type === 'div' ? child : child}
                </div>
            ))}
        </div>
    ),
    RadioGroupItem: ({ value, id }: any) => (
        <input
            type="radio"
            value={value}
            id={id}
            name="radio-group"
            data-testid={`radio-${value}`}
        />
    )
}));

vi.mock('../components/ui/slider', () => ({
    Slider: ({ value, onValueChange, min, max, step }: any) => (
        <input
            type="range"
            value={value[0]}
            onChange={(e) => onValueChange([parseInt(e.target.value)])}
            min={min}
            max={max}
            step={step}
            data-testid="slider"
        />
    )
}));

vi.mock('../components/ui/textarea', () => ({
    Textarea: ({ id, value, onChange, placeholder, rows, ...props }: any) => (
        <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            {...props}
        />
    )
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
    ArrowLeft: () => <div data-testid="arrow-left-icon">ArrowLeft</div>,
    Loader2: ({ className }: any) => <div className={className} data-testid="loader-icon">Loader2</div>,
    Save: () => <div data-testid="save-icon">Save</div>,
    CalendarClock: () => <div data-testid="calendar-clock-icon">CalendarClock</div>,
    AlertTriangle: () => <div data-testid="alert-triangle-icon">AlertTriangle</div>
}));

// Mock date-fns
vi.mock('date-fns', () => ({
    format: vi.fn(() => '2023-10-01T10:00')
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    ...vi.importActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    BrowserRouter: ({ children }: any) => <div>{children}</div>
}));

// Cast mocked functions
const mockFetchInterviews = fetchInterviews as Mock;

// Mock interview data
const mockInterviewData = {
    id: '1',
    company: 'Test Company',
    role: 'Senior Developer',
    date: '2023-10-01T10:00',
    type: 'video',
    status: 'completed',
    is_public: true,
    interviewers: [{ name: 'John Doe', role: 'Engineering Manager' }],
    questions: ['Tell me about yourself', 'What are your strengths?'],
    confident_answers: 'I answered the technical questions well',
    challenging_questions: 'The system design question was tough',
    strengths: 'Good communication',
    improvements: 'Need to practice algorithms',
    connection: 'Great rapport with interviewer',
    comfort_level: 'Very comfortable',
    passed: true,
    performance_rating: 8,
    notes: 'Overall great experience'
};

// Helper function to render with router
const renderWithRouter = (component: React.ReactElement): RenderResult => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

// Mock window.location.search
const mockSearchParams = (params: string) => {
    Object.defineProperty(window, 'location', {
        value: {
            search: params
        },
        writable: true
    });
};

describe('InterviewForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockNavigate.mockClear();
        mockSearchParams('');
    });

    describe('Initial Render - New Interview', () => {
        it('renders form for new interview', () => {
            renderWithRouter(<InterviewForm />);

            expect(screen.getByText('Add New Interview')).toBeInTheDocument();
            expect(screen.getByText('Record details about your upcoming interview')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('e.g. Acme Inc.')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('e.g. Senior Software Engineer')).toBeInTheDocument();
        });

        it('does not show post-interview questions for scheduled interview', () => {
            renderWithRouter(<InterviewForm />);

            expect(screen.queryByText('Post-Interview Reflection')).not.toBeInTheDocument();
            expect(screen.getByText('Post-interview questions are hidden')).toBeInTheDocument();
        });
    });

    describe('Initial Render - Edit Interview', () => {
        beforeEach(() => {
            mockSearchParams('?id=1');
            mockFetchInterviews.mockResolvedValue({
                interviews: [mockInterviewData]
            });
        });

        it('renders form for editing interview', async () => {
            renderWithRouter(<InterviewForm />);

            await waitFor(() => {
                expect(screen.getByText('Edit Interview')).toBeInTheDocument();
                expect(screen.getByText('Update your interview details')).toBeInTheDocument();
            });
        });

        it('fetches and populates interview data', async () => {
            renderWithRouter(<InterviewForm />);
            await waitFor(() => {
                expect(mockFetchInterviews).toHaveBeenCalledWith('?id=1');
            });

            await waitFor(() => {
                expect(screen.getByDisplayValue('Test Company')).toBeInTheDocument();
                expect(screen.getByDisplayValue('Senior Developer')).toBeInTheDocument();
            });
        });

        it('shows loading state while fetching data', () => {
            mockFetchInterviews.mockImplementation(() => new Promise(() => { })); // Never resolves

            renderWithRouter(<InterviewForm />);

            expect(screen.getByText('Loading interview details...')).toBeInTheDocument();
            expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
        });
    });

    describe('Form Interactions', () => {
        it('updates company field when typing', async () => {
            const user = userEvent.setup();
            renderWithRouter(<InterviewForm />);

            const companyInput = screen.getByPlaceholderText('e.g. Acme Inc.');
            await user.type(companyInput, 'New Company');

            expect(companyInput).toHaveValue('New Company');
        });

        it('updates role field when typing', async () => {
            const user = userEvent.setup();
            renderWithRouter(<InterviewForm />);

            const roleInput = screen.getByPlaceholderText('e.g. Senior Software Engineer');
            await user.type(roleInput, 'Frontend Developer');

            expect(roleInput).toHaveValue('Frontend Developer');
        });

        it('toggles public sharing switch', async () => {
            const user = userEvent.setup();
            renderWithRouter(<InterviewForm />);

            const switchElement = screen.getByTestId('switch');
            expect(switchElement).toBeChecked();

            await user.click(switchElement);
            expect(switchElement).not.toBeChecked();
        });
    });

    describe('Post-Interview Questions', () => {
        beforeEach(() => {
            mockSearchParams('?id=1');
            mockFetchInterviews.mockResolvedValue({
                interviews: [{ ...mockInterviewData, status: 'completed' }]
            });
        });

        it('shows post-interview questions for completed interview', async () => {
            renderWithRouter(<InterviewForm />);

            await waitFor(() => {
                expect(screen.getByText('Post-Interview Reflection')).toBeInTheDocument();
                expect(screen.getByText('Answers You Felt Confident About')).toBeInTheDocument();
                expect(screen.getByText('Questions That Caught You Off-Guard')).toBeInTheDocument();
            });
        });

        it('shows performance rating slider', async () => {
            renderWithRouter(<InterviewForm />);

            await waitFor(() => {
                expect(screen.getByText('How Do You Rate Your Performance? (1-10)')).toBeInTheDocument();
                expect(screen.getByTestId('slider')).toBeInTheDocument();
            });
        });

        it('shows pass/fail radio buttons', async () => {
            renderWithRouter(<InterviewForm />);

            await waitFor(() => {
                expect(screen.getByText('Did You Pass This Interview?')).toBeInTheDocument();
                expect(screen.getByTestId('radio-true')).toBeInTheDocument();
                expect(screen.getByTestId('radio-false')).toBeInTheDocument();
                expect(screen.getByTestId('radio-unknown')).toBeInTheDocument();
            });
        });
    });

    describe('Child Components Integration', () => {
        it('renders interviewer field component', () => {
            renderWithRouter(<InterviewForm />);

            expect(screen.getByTestId('interviewer-field')).toBeInTheDocument();
            expect(screen.getByTestId('interviewers-count')).toHaveTextContent('0');
        });

        it('updates interviewers when child component triggers change', async () => {
            const user = userEvent.setup();
            renderWithRouter(<InterviewForm />);

            const addButton = screen.getByTestId('add-interviewer');
            await user.click(addButton);

            expect(screen.getByTestId('interviewers-count')).toHaveTextContent('1');
        });
    });


    describe('Navigation', () => {
        it('navigates back to dashboard when clicking back button', async () => {
            const user = userEvent.setup();
            renderWithRouter(<InterviewForm />);

            const backButton = screen.getByTestId('arrow-left-icon').closest('button');
            await user.click(backButton!);

            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });

        it('navigates to dashboard when clicking cancel button', async () => {
            const user = userEvent.setup();
            renderWithRouter(<InterviewForm />);

            const cancelButton = screen.getByText('Cancel');
            await user.click(cancelButton);

            expect(mockNavigate).toHaveBeenCalledWith('Dashboard');
        });
    });

    describe('Error Handling', () => {
        it('handles fetch error gracefully', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
            mockSearchParams('?id=1');
            mockFetchInterviews.mockRejectedValue(new Error('Fetch error'));

            renderWithRouter(<InterviewForm />);

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith('Error fetching interview:', expect.any(Error));
            });

            consoleSpy.mockRestore();
        });
    });

    describe('Conditional Rendering', () => {
        it('shows tip for new interviews', () => {
            renderWithRouter(<InterviewForm />);

            expect(screen.getByText(/Tip:/)).toBeInTheDocument();
            expect(screen.getByText(/fill out the post-interview questions within 24 hours/)).toBeInTheDocument();
        });

        it('does not show tip for existing interviews', async () => {
            mockSearchParams('?id=1');
            mockFetchInterviews.mockResolvedValue({
                interviews: [mockInterviewData]
            });

            renderWithRouter(<InterviewForm />);

            await waitFor(() => {
                expect(screen.queryByText(/Tip:/)).not.toBeInTheDocument();
            });
        });

        it('shows warning when interview is not completed', () => {
            renderWithRouter(<InterviewForm />);

            expect(screen.getByText('Post-interview questions are hidden')).toBeInTheDocument();
            expect(screen.getByText(/Change the interview status to "Completed"/)).toBeInTheDocument();
        });
    });
});