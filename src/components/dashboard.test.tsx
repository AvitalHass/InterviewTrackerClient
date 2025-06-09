import { render, screen, waitFor, fireEvent, RenderResult } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';
import Dashboard from '../components/dashboard';
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

interface StatsBarProps {
  interviews: Interview[];
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
  fetchInterviews: vi.fn()
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

vi.mock('./stats-bar', () => ({
  default: ({ interviews }: StatsBarProps) => (
    <div data-testid="stats-bar">Stats for {interviews.length} interviews</div>
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
      {interview.company} - {interview.role}
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
  CalendarPlus: () => <div data-testid="calendar-plus-icon">CalendarPlus</div>
}));

// Cast the mocked function
const mockFetchInterviews = fetchInterviews as Mock;

// Mock data
const mockInterviews: Interview[] = [
  {
    id: '1',
    company: 'Tech Corp',
    role: 'Frontend Developer',
    status: 'scheduled' as const,
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
    passed: false,
    date: '2023-10-02T11:00:00Z'
  },
  {
    id: '3',
    company: 'Big Company',
    role: 'Full Stack Developer',
    status: 'pending' as const,
    type: 'technical' as const,
    passed: undefined,
    date: '2023-10-03T12:00:00Z'
  }
];

// Wrapper component for Router
const renderWithRouter = (component: React.ReactElement): RenderResult => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('renders the dashboard title and description', () => {
      mockFetchInterviews.mockResolvedValue({ interviews: [] });

      renderWithRouter(<Dashboard />);

      expect(screen.getByText('Interview Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Track and manage your job interviews')).toBeInTheDocument();
    });

    it('renders the Add New Interview button', () => {
      mockFetchInterviews.mockResolvedValue({ interviews: [] });

      renderWithRouter(<Dashboard />);

      expect(screen.getByText('Add New Interview')).toBeInTheDocument();
    });

    it('shows loading state initially', () => {
      mockFetchInterviews.mockImplementation(() => new Promise(() => { })); // Never resolves

      renderWithRouter(<Dashboard />);

      expect(screen.getAllByText('', { selector: '.animate-pulse' })).toHaveLength(6);
    });
  });

  describe('Data Fetching', () => {
    it('fetches and displays interviews', async () => {
      mockFetchInterviews.mockResolvedValue({ interviews: mockInterviews });

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByTestId('stats-bar')).toBeInTheDocument();
        expect(screen.getAllByTestId('interview-card')).toHaveLength(3);
      });

      expect(screen.getByText('Tech Corp - Frontend Developer')).toBeInTheDocument();
      expect(screen.getByText('Startup Inc - Backend Developer')).toBeInTheDocument();
      expect(screen.getByText('Big Company - Full Stack Developer')).toBeInTheDocument();
    });

    it('handles fetch error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
      mockFetchInterviews.mockRejectedValue(new Error('Fetch failed'));

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('No interviews yet')).toBeInTheDocument();
      });

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching interviews:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('Empty States', () => {
    it('shows empty state when no interviews exist', async () => {
      mockFetchInterviews.mockResolvedValue({ interviews: [] });

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByText('No interviews yet')).toBeInTheDocument();
        expect(screen.getByText('Start tracking your job search by adding your first interview')).toBeInTheDocument();
        expect(screen.getByText('Add Your First Interview')).toBeInTheDocument();
      });
    });

    it('shows no matching interviews state when filters return empty results', async () => {
      mockFetchInterviews.mockResolvedValue({ interviews: mockInterviews });

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByTestId('filter-bar')).toBeInTheDocument();
      });

      // Simulate filtering that returns no results
      const filterInput = screen.getByTestId('filter-input') as HTMLInputElement;
      fireEvent.change(filterInput, { target: { value: 'nonexistent company' } });

      await waitFor(() => {
        expect(screen.getByText('No matching interviews')).toBeInTheDocument();
        expect(screen.getByText('Try adjusting your filters to find what you\'re looking for')).toBeInTheDocument();
        expect(screen.getByTestId('reset-filters')).toBeInTheDocument();
      });
    });
  });

  describe('Filtering Functionality', () => {
    beforeEach(async () => {
      mockFetchInterviews.mockResolvedValue({ interviews: mockInterviews });
    });

    it('filters interviews by company name', async () => {
      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getAllByTestId('interview-card')).toHaveLength(3);
      });

      const filterInput = screen.getByTestId('filter-input') as HTMLInputElement;
      fireEvent.change(filterInput, { target: { value: 'tech' } });

      await waitFor(() => {
        expect(screen.getAllByTestId('interview-card')).toHaveLength(1);
        expect(screen.getByText('Tech Corp - Frontend Developer')).toBeInTheDocument();
      });
    });

    it('filters interviews by role', async () => {
      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getAllByTestId('interview-card')).toHaveLength(3);
      });

      const filterInput = screen.getByTestId('filter-input') as HTMLInputElement;
      fireEvent.change(filterInput, { target: { value: 'backend' } });

      await waitFor(() => {
        expect(screen.getAllByTestId('interview-card')).toHaveLength(1);
        expect(screen.getByText('Startup Inc - Backend Developer')).toBeInTheDocument();
      });
    });

    it('resets filters when reset button is clicked', async () => {
      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getAllByTestId('interview-card')).toHaveLength(3);
      });

      // Apply filter
      const filterInput = screen.getByTestId('filter-input') as HTMLInputElement;
      fireEvent.change(filterInput, { target: { value: 'tech' } });

      await waitFor(() => {
        expect(screen.getAllByTestId('interview-card')).toHaveLength(1);
      });

      // Reset filters
      const resetButton = screen.getByTestId('reset-filters');
      fireEvent.click(resetButton);

      await waitFor(() => {
        expect(screen.getAllByTestId('interview-card')).toHaveLength(3);
        expect(filterInput.value).toBe('');
      });
    });
  });

  describe('Component Interactions', () => {
    it('disables Add New Interview button when loading', () => {
      mockFetchInterviews.mockImplementation(() => new Promise(() => { })); // Never resolves

      renderWithRouter(<Dashboard />);

      const addButton = screen.getByText('Add New Interview');
      expect(addButton).toBeDisabled();
    });

    it('enables Add New Interview button after loading', async () => {
      mockFetchInterviews.mockResolvedValue({ interviews: [] });

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        const addButton = screen.getByText('Add New Interview');
        expect(addButton).not.toBeDisabled();
      });
    });

    it('shows stats bar only when interviews exist', async () => {
      mockFetchInterviews.mockResolvedValue({ interviews: mockInterviews });

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getByTestId('stats-bar')).toBeInTheDocument();
        expect(screen.getByText('Stats for 3 interviews')).toBeInTheDocument();
      });
    });

    it('does not show stats bar when no interviews exist', async () => {
      mockFetchInterviews.mockResolvedValue({ interviews: [] });

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.queryByTestId('stats-bar')).not.toBeInTheDocument();
      });
    });
  });

  describe('Filter Debouncing', () => {
    it('debounces filter changes', async () => {
      mockFetchInterviews.mockResolvedValue({ interviews: mockInterviews });

      renderWithRouter(<Dashboard />);

      await waitFor(() => {
        expect(screen.getAllByTestId('interview-card')).toHaveLength(3);
      });

      const filterInput = screen.getByTestId('filter-input') as HTMLInputElement;

      // Type quickly
      fireEvent.change(filterInput, { target: { value: 't' } });
      fireEvent.change(filterInput, { target: { value: 'te' } });
      fireEvent.change(filterInput, { target: { value: 'tech' } });

      // Should still show all interviews immediately after typing
      expect(screen.getAllByTestId('interview-card')).toHaveLength(3);

      // After debounce delay (400ms), filter should be applied
      await waitFor(() => {
        expect(screen.getAllByTestId('interview-card')).toHaveLength(1);
      }, { timeout: 1000 });
    });
  });
});