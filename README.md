# Mod20 Client

React-based frontend application for the Mod20 gaming system management platform.

## Overview

A modern, responsive web application built with React, TypeScript, and Vite for managing tabletop gaming systems, character races, roles, and associated content. Features comprehensive admin tools, media management, and a clean user interface for both content creators and players.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: SCSS with BEM methodology and CSS custom properties
- **Routing**: React Router v6 for client-side navigation
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form for form handling and validation
- **Rich Text**: TipTap editor for WYSIWYG content editing
- **Type Safety**: Shared types from `@mod20/types` package

## Project Structure

### Core Directories

```
src/
├── components/           # Reusable UI components
├── hooks/               # Custom React hooks
├── pages/               # Top-level page components
├── provider/            # Context providers for data fetching
├── routes/              # Route configurations
├── services/            # API service functions
├── types/               # Local type definitions
├── utils/               # Utility functions
├── css/                 # Global styles and variables
└── loaders/             # React Router data loaders
```

### Component Architecture

```
components/
├── AdminLayout/         # Admin interface layout
├── AppLayout/           # Main application layout
├── Button/              # Reusable button component
├── Card/                # Content container component
├── ContentTitle/        # Page title with actions
├── Form/                # Form wrapper components
├── FormDetails/         # Form sidebar details
├── FormGroup/           # Form field grouping
├── FormRow/             # Form row layouts
├── Hero/                # Page hero sections
├── ImageGallery/        # Image display component
├── Input/               # Form input components
├── MediaLibrary/        # Media management interface
├── Select/              # Dropdown select components
├── TextEditor/          # Rich text editor
├── TraitsSection/       # Trait management interface
└── [Entity]Form/        # Admin forms for each entity type
```

## Key Features

### Admin Content Management
- **System Management**: Create and edit game systems with metadata and imagery
- **Race Management**: Define character races with speed attributes, traits, and alignment
- **Role Management**: Configure character classes with abilities and proficiencies
- **Trait Management**: Create reusable character traits and features

### Media Library Integration
- **Image Upload**: Drag-and-drop image uploading with Sharp processing
- **Multiple Formats**: Automatic generation of background and gallery image variants
- **Organized Management**: Systematic organization of media assets by entity type

### Dynamic Forms
- **React Hook Form**: Comprehensive form handling with validation
- **Rich Text Editing**: TipTap editor for content creation
- **Image Selection**: Integrated media library selection interface
- **Drag & Drop**: Reorderable lists for traits and images

### Responsive Design
- **Mobile-First**: Responsive design patterns for all screen sizes
- **Clean Interface**: Minimal, focused design using BEM methodology
- **CSS Variables**: Consistent theming with custom properties
- **Dark/Light Support**: Theme-aware styling architecture

## Development Guidelines

### Component Standards
- Use functional components with TypeScript interfaces for props
- Follow the ComponentName/ComponentName.tsx + ComponentName.scss + index.ts structure
- Import types from @mod20/types for shared data structures
- Use React.FC type annotation for components

### Styling Standards
- **BEM Methodology**: .block__element--modifier naming convention
- **SCSS Only**: No mixing of CSS and SCSS files
- **CSS Variables**: Use var(--property-context-size) format
- **Minimal Styles**: Focus on structural and layout styles only

## API Integration

### Service Layer
```typescript
// Example API service
export const getRace = async (systemSlug: string, raceSlug: string): Promise<RaceType> => {
  const response = await fetch(`/api/systems/${systemSlug}/races/${raceSlug}`);
  return response.json();
};
```

## Build and Development

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Environment Setup
- Node.js 18+ required
- TypeScript compilation with strict mode
- Vite configuration for optimized development
- SCSS preprocessing with CSS custom properties

## Related Repositories

- **mod20_api**: Express.js backend API that serves data to this client
- **mod20_types**: Shared TypeScript type definitions used throughout the application

## Contributing

1. Follow the established file structure and naming conventions
2. Use TypeScript strict mode and proper type annotations
3. Write SCSS using BEM methodology and CSS variables
4. Test all forms and data interactions thoroughly
5. Ensure responsive design works across device sizes
