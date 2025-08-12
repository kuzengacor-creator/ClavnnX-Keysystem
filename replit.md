# Overview

This is a key generation and verification system built with a modern full-stack architecture designed for Autoscale deployment. The application generates temporary access keys with 24-hour expiration times and provides a multi-step verification flow through external Linkvertise URLs. It features a React frontend with shadcn/ui components and an Express.js backend with persistent ReplDB storage that survives cold starts and restarts.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development/building
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Storage**: ReplDB persistent storage for Autoscale compatibility
- **API Design**: RESTful endpoints for key generation, retrieval, and verification
- **Development**: Hot reloading with Vite middleware integration
- **Key Endpoints**: 
  - `/get-key` - Autoscale-ready endpoint with automatic key management
  - `/verify?key=KEY` - Key verification with expiration handling

## Data Storage
- **Primary Storage**: ReplDB (Key-Value Store) for Autoscale persistence
- **Backup Configuration**: PostgreSQL with Drizzle ORM (configured but not actively used)
- **Schema Management**: Drizzle Kit for migrations and schema definition
- **Key Structure**: 16-character alphanumeric keys with UNIX timestamp expiration
- **Persistence**: Survives Autoscale cold starts and deployments

## Authentication & Security
- **Key Generation**: Cryptographically secure random key generation
- **Expiration**: 24-hour key validity with automatic expiration checking
- **Verification Flow**: Multi-step process through external Linkvertise URLs
- **Session Management**: Express sessions with PostgreSQL store configuration

## Development Workflow
- **Build System**: Vite for frontend bundling, esbuild for backend compilation
- **Type Safety**: Shared TypeScript schemas between frontend and backend
- **Development Server**: Integrated Vite dev server with Express API proxy
- **Code Quality**: Strict TypeScript configuration with path aliases

# External Dependencies

## Third-Party Services
- **Linkvertise**: External URL shortening/monetization service for multi-step verification flow
- **Neon Database**: PostgreSQL database provider (configured but not actively used)
- **Replit**: Development platform integration with cartographer plugin

## Key Libraries
- **UI Components**: Radix UI primitives, Lucide React icons, Embla Carousel
- **Validation**: Zod for runtime type checking and schema validation
- **HTTP Client**: Native fetch API with custom wrapper for API requests
- **Date Handling**: date-fns for date manipulation and formatting
- **Styling**: class-variance-authority for component variant management

## Development Tools
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Store**: connect-pg-simple for PostgreSQL session storage
- **Build Tools**: PostCSS with Autoprefixer for CSS processing
- **Development**: tsx for TypeScript execution in development