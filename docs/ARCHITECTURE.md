# Personal Finance Manager - Architecture Guide

## Overview

This document serves as the primary reference for the architectural decisions, design patterns, and technical guidelines used in the Personal Finance Manager project. Any changes to these patterns or decisions should be reflected in this document.

## Important Note

**This document MUST be updated whenever architectural decisions change. It serves as the source of truth for the project's architecture and should be referenced by AI assistants and developers to maintain consistency.**

## Application Structure

### Directory Organization

```
├── app/                    # Next.js app directory (routes and server components)
│   ├── actions/           # Server actions for data mutations
│   ├── api/              # API routes
│   ├── types/            # TypeScript type definitions
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── Generic/         # Reusable UI components
│   └── [Feature]/       # Feature-specific components
├── services/            # Business logic and data access
│   ├── domain/         # Domain services (business logic)
│   └── infrastructure/ # Infrastructure services (DB, external APIs)
├── utils/               # Utility functions and helpers
└── public/             # Static assets
```

## Design Patterns and Principles

### Server-First Architecture

1. **React Server Components (RSC)**

   - Use Server Components as the default
   - Only use 'use client' when necessary for interactivity
   - Leverage streaming and suspense for better UX
   - Keep heavy computations and data fetching on the server

2. **Server Actions**

   - Use Server Actions for all data mutations
   - Implement form actions directly in server components
   - Progressive enhancement with JavaScript
   - Type-safe server-client communication

### Component Architecture

1. **Atomic Design Pattern**

   - Generic components are built as atomic, reusable pieces
   - Feature components compose generic components for specific use cases
   - Components should be self-contained with their own styles and logic

2. **Component Organization**
   - Each component should have its own directory when it has associated files
   - Related components should be grouped in feature directories
   - Hooks should be in a `hooks` directory within the component's directory

### State Management

1. **React Hooks**

   - Use React hooks for component-level state
   - Custom hooks for reusable logic
   - Context for global state when needed

2. **Server State**
   - Server Components for initial data loading
   - Server Actions for data mutations
   - Optimistic updates for better UX

### Data Flow

1. **Unidirectional Data Flow**

   - Props flow down
   - Events flow up
   - Use callbacks for child-to-parent communication

2. **Form Handling**
   - Controlled components for form inputs
   - Generic Form component for consistent form handling
   - Validation at both client and server level

### Error Handling

1. **Client-Side**

   - Try-catch blocks for async operations
   - Error boundaries for component errors
   - Toast notifications for user feedback

2. **Server-Side**
   - Custom error classes for different error types
   - Proper error messages and status codes
   - Error logging for debugging

## Technical Decisions

### Framework and Libraries

1. **Next.js 15**

   - App Router for routing
   - React Server Components for performance
   - Server Actions for mutations
   - Streaming and Suspense for better UX

2. **UI Components**

   - Radix UI for accessible components
   - Tailwind CSS for styling
   - HeadlessUI for additional components

3. **Form Handling**
   - Custom Form component
   - Built-in validation
   - Type-safe form submissions

### Database

1. **PostgreSQL**
   - Primary database for data storage
   - Prisma as ORM
   - Proper indexing for performance

### Authentication

1. **NextAuth.js**
   - JWT-based authentication
   - Social providers support
   - Role-based access control

## Code Style and Conventions

### TypeScript

1. **Type Safety**

   - Strict type checking enabled
   - No `any` types unless absolutely necessary
   - Proper interface and type definitions

2. **Naming Conventions**
   - PascalCase for components and types
   - camelCase for variables and functions
   - UPPER_CASE for constants

### Component Guidelines

1. **File Structure**

```typescript
// Imports
import { useState, useEffect } from 'react';
import type { ComponentProps } from './types';

// Types/Interfaces
type Props = {
  // ...
};

// Component
export default function ComponentName({ prop1, prop2 }: Props) {
  // Hooks
  const [state, setState] = useState();

  // Effects
  useEffect(() => {
    // ...
  }, []);

  // Event Handlers
  const handleEvent = () => {
    // ...
  };

  // Render
  return (
    // JSX
  );
}
```

2. **Props**
   - Destructure props in function parameters
   - Use TypeScript interfaces for prop types
   - Document complex props with JSDoc comments

### Testing

1. **Unit Tests**

   - Jest for testing framework
   - React Testing Library for component tests
   - High test coverage for critical paths

2. **Integration Tests**
   - Cypress for E2E testing
   - Test critical user flows
   - Proper test isolation

## Performance Guidelines

1. **Optimization Techniques**

   - Memoization with useMemo and useCallback
   - Proper key usage in lists
   - Image optimization with next/image

2. **Loading States**
   - Skeleton loaders for better UX
   - Suspense boundaries for code splitting
   - Progressive loading for large data sets

## Accessibility

1. **ARIA Guidelines**

   - Proper ARIA labels and roles
   - Keyboard navigation support
   - Screen reader compatibility

2. **Color Contrast**
   - WCAG 2.1 compliance
   - Dark mode support
   - Proper focus indicators

## Security

1. **Data Protection**

   - Input sanitization
   - XSS prevention
   - CSRF protection

2. **Authentication**
   - Secure session handling
   - Password hashing
   - Rate limiting

## Updating This Document

When making architectural changes:

1. Create a PR with the proposed changes
2. Update this document to reflect the changes
3. Include the rationale for the changes
4. Get team approval before merging
5. Ensure all team members are aware of the changes

Remember: This document is a living reference. Keep it updated and use it as a guide for maintaining consistency across the project.
