# Mini Seller Console

A lightweight React-based console for sales teams to triage leads and convert them into opportunities. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

### Lead Management
- **Lead Listing**: View all leads in a sortable, filterable table
- **Search & Filter**: Search by name/company and filter by status
- **Lead Details**: Inline editing of lead status and email with validation
- **Lead Scoring**: Visual score indicators with color coding
- **Status Management**: Track leads through new → contacted → qualified → unqualified

### Opportunity Management
- **Opportunity Tracking**: View converted opportunities with stage tracking
- **Lead Conversion**: Convert qualified leads into sales opportunities
- **Stage Pipeline**: Track opportunities through prospecting → qualification → proposal → negotiation → closed

### User Experience
- **Responsive Design**: Desktop-first with mobile considerations
- **Loading States**: Simulated network latency with proper loading indicators
- **Error Handling**: Comprehensive error states with retry functionality
- **Accessibility**: Full keyboard navigation and screen reader support
- **Data Persistence**: Filter preferences saved to localStorage

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Testing**: Playwright for E2E testing, Vitest for unit tests
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/igrsobral/cover-pin-hw
cd mini-seller-console

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build

# Code Quality
pnpm lint         # Run ESLint
pnpm format       # Format with Prettier

# Testing
pnpm test         # Run unit tests
pnpm test:e2e     # Run E2E tests
pnpm test:e2e:ui  # Run E2E tests with UI
```

## Project Structure

```
src/
├── features/           # Feature-based modules
│   ├── leads/         # Lead management
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   └── opportunities/ # Opportunity management
│       ├── components/
│       ├── hooks/
│       └── types.ts
├── shared/            # Shared resources
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Shared custom hooks
│   ├── utils/         # Helper functions
│   └── data/          # API simulation layer
└── App.tsx

public/
└── data/              # Mock data files
    ├── leads.json
    └── opportunities.json
```

## Architecture Highlights

### Feature-Based Organization
- Each feature (leads, opportunities) is self-contained
- Shared components and utilities in dedicated folders
- Clean separation of concerns

### Data Simulation
- Simulated API calls with realistic latency (300-1000ms)
- Error scenarios with ~10% failure rate for testing
- Optimistic updates with rollback capability

### Performance Optimizations
- React.memo for expensive components
- useCallback for stable function references
- Efficient data structures for ~100+ records

### Accessibility Features
- Full keyboard navigation support
- ARIA labels and roles for screen readers
- Focus management and visual indicators
- Semantic HTML structure

## Testing

The project includes comprehensive E2E tests covering:
- Lead listing, filtering, and sorting
- Lead detail editing and validation
- Lead-to-opportunity conversion
- Error handling and recovery
- Accessibility compliance

Run tests with:
```bash
pnpm test:e2e
```

## Data Models

### Lead
```typescript
interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: 'website' | 'referral' | 'linkedin' | 'conference' | 'cold_call';
  score: number; // 0-100
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
}
```

### Opportunity
```typescript
interface Opportunity {
  id: string;
  name: string;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  amount: number;
  accountName: string;
  leadId?: string; // Reference to converted lead
}
```

## Development Notes

- Uses modern React patterns (hooks, functional components)
- TypeScript strict mode enabled
- No external state management library (uses React built-ins)
- Simulated backend with localStorage persistence
- Desktop-first responsive design
- Comprehensive error boundaries and loading states
