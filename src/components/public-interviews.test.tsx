import { render, screen, waitFor, RenderResult } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';
import PublicInterviews from '../components/public-interviews';
import { Interview } from '../types/interview';
import { Filter } from '../types/filter';
import { fetchInterviews } from '../lib/utils';

// Type definitions for mocked components
interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
    variant?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

interface FilterBarProps {
    filters: Filter;
    setFilters: (filters: Filter) => void;
    resetFilters: () => void;
}

interface InterviewCardProps {
    interview: Interview;
}

// Mock the dependencies - utils should be at src/lib/utils
vi.mock('../lib/utils', () => ({
    fetchInterviews: vi.fn(),
    cn: (...classes: string[]) => classes.filter(Boolean).join(' ')
}));

vi.mock('../components/ui/button', () => ({
    Button: ({ children, className, disabled, onClick, variant, ...props }: ButtonProps) => (
        <button
            className={className}
            disabled={disabled}
            onClick={onClick}
            data-variant={variant}
            {...props}
        >
            {children}
        </button>
    )
}));

vi.mock('./filter-bar', () => ({
    default: ({ filters, setFilters, resetFilters }: FilterBarProps) => (
        <div data-testid="filter-bar">
            <input
                data-testid="filter-input"
                value={filters.freeText}
                onChange={(e) => setFilters({ ...filters, freeText: e.target.value })}
            />
            <button data-testid="reset-filters" onClick={resetFilters}>
                Reset Filters
            </button>
        </div>
    )
}));

vi.mock('./interview-card', () => ({
    default: ({ interview }: InterviewCardProps) => (
        <div data-testid="interview-card">
            {`${interview.company} - ${interview.role}`}
        </div>
    )
}));

vi.mock('framer-motion', () => ({
    motion: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        div: ({ children, ...props }: { children: React.ReactNode;[key: string]: any }) =>
            <div {...props}>{children}</div>
    }
}));

vi.mock('lucide-react', () => ({
    CalendarPlus: () => <div data-testid="calendar-plus-icon">CalendarPlus</div>,
    Share2: () => <div data-testid="share2-icon">Share2</div>,
    Search: () => <div data-testid="search-icon">Search</div>,
    Building: () => <div data-testid="building-icon">Building</div>,
    Users: () => <div data-testid="users-icon">Users</div>,
    HelpCircle: () => <div data-testid="help-circle-icon">HelpCircle</div>,
    Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
    ChevronDownIcon: () => <div data-testid="chevron-down-icon">ChevronDownIcon</div>,
    ChevronUpIcon: () => <div data-testid="chevron-down-icon">ChevronUpIcon</div>,
    CheckIcon: () => <div data-testid="chevron-down-icon">CheckIcon</div>
}));

// Cast the mocked function
const mockFetchInterviews = fetchInterviews as Mock;

// Mock data
const mockInterviews: Interview[] = [
    {
        id: '1',
        company: 'Tech Corp',
        role: 'Frontend Developer',
        status: 'completed' as const,
        type: 'technical' as const,
        passed: true,
        date: '2023-10-01T10:00:00Z'
    },
    {
        id: '2',
        company: 'Startup Inc',
        role: 'Backend Developer',
        status: 'completed' as const,
        type: 'behavioral' as const,
        passed: true,
        date: '2023-10-02T11:00:00Z'
    },
    {
        id: '3',
        company: 'Big Company',
        role: 'Full Stack Developer',
        status: 'completed' as const,
        type: 'technical' as const,
        passed: true,
        date: '2023-10-03T12:00:00Z'
    }
];

// Wrapper component for Router
const renderWithRouter = (component: React.ReactElement): RenderResult => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PublicInterviews Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Initial Render', () => {
        it('renders the public interviews title and description', () => {
            mockFetchInterviews.mockResolvedValue({ interviews: [] });

            renderWithRouter(<PublicInterviews />);

            expect(screen.getByText('Community Interview Questions')).toBeInTheDocument();
        });

        it('shows loading state initially', () => {
            mockFetchInterviews.mockImplementation(() => new Promise(() => { })); // Never resolves

            renderWithRouter(<PublicInterviews />);

            expect(screen.getAllByText('', { selector: '.animate-pulse' })).toHaveLength(3);
        });
    });

    describe('Data Fetching', () => {
        it('calls fetchInterviews with correct parameters', async () => {
            mockFetchInterviews.mockResolvedValue({ interviews: [] });
        
            renderWithRouter(<PublicInterviews />);
        
            await waitFor(() => {
                expect(mockFetchInterviews).toHaveBeenCalledWith('?is_public=true&status=completed');
            });
        });
        it('handles loading state correctly', async () => {
            // Start with a pending promise
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let resolvePromise: (value: any) => void;
            const pendingPromise = new Promise((resolve) => {
                resolvePromise = resolve;
            });
            
            mockFetchInterviews.mockReturnValue(pendingPromise);
        
            renderWithRouter(<PublicInterviews />);
        
            // Should show loading initially
            expect(screen.getByText('0 interviews found')).toBeInTheDocument();
        
            // Resolve the promise
            resolvePromise!({ interviews: mockInterviews });
        
            // Wait for the data to load
            await waitFor(() => {
                expect(screen.getByText(/3 interviews/)).toBeInTheDocument();
            });
            expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
            expect(screen.getByText('Startup Inc')).toBeInTheDocument();
            expect(screen.getByText('Big Company')).toBeInTheDocument();
        });
    });

    describe('Empty States', () => {
        it('shows empty state when no interviews exist', async () => {
            mockFetchInterviews.mockResolvedValue({ interviews: [] });

            renderWithRouter(<PublicInterviews />);

            await waitFor(() => {
                expect(screen.getByText('No interviews found')).toBeInTheDocument();
            });
        });
    });
});