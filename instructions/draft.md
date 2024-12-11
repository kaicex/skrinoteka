
# Design Inspiration Platform PRD

## Project Overview
A streamlined design inspiration platform focused on app UI/UX, similar to Mobbin. The platform will showcase mobile and web app interfaces with basic filtering and search capabilities.

## Technical Stack
- Frontend Framework: Next.js 14 (App Router)
- UI Components: Shadcn/UI
- Styling: Tailwind CSS
- CMS: Contentful
- Deployment: Vercel (recommended)

## Project Structure
```
deshub/
├── app/
│   ├── api/
│   │   └── contentful/
│   │       └── route.ts             # Contentful API endpoint
│   ├── [appId]/
│   │   ├── loading.tsx              # Loading state for app detail page
│   │   ├── error.tsx                # Error handling for app detail page
│   │   └── page.tsx                 # App detail page [Server Component]
│   ├── loading.tsx                  # Loading state for main page
│   ├── error.tsx                    # Error handling for main page
│   └── page.tsx                     # Home/Browse page [Server Component]
│
├── components/
│   ├── app-card.tsx                 # App preview card component
│   ├── app-grid.tsx                 # Grid layout for apps
│   ├── platform-tabs.tsx            # Platform filter tabs (iOS/Android/Web)
│   ├── filters/
│   │   ├── category-filter.tsx      # Category dropdown filter
│   │   ├── ˚r.tsx          # Flow type filter
│   │   └── search-bar.tsx           # Search input component
│   ├── detail/
│   │   ├── app-header.tsx           # App detail page header
│   │   ├── screens-tab.tsx          # Screens grid view
│   │   ├── flows-tab.tsx            # Flows grouped view
│   │   └── screen-modal.tsx         # Lightbox modal for screen preview
│   └── ui/                          # Shadcn UI components
│
├── lib/
│   ├── contentful.ts                # Contentful client configuration
│   ├── utils.ts                     # Utility functions
│   └── types.ts                     # TypeScript interfaces
│
└── hooks/
    └── use-filters.ts               # Custom hook for filter logic
```

## Data Models

### Content Models (Contentful)

1. App Model
```typescript
interface Category {
  name: string; // Short text
}

interface Platform {
  name: string; // Short text
}

interface App {
  name: string; // Short text
  app_logo: File; // File
  description: string; // Short text
  category: Category; // Reference to Category
  screens: Screen[]; // Many references to Screen
}

interface Screen {
  title: string; // Short text
  description: string; // Short text
  image: File; // File
  app: App; // Reference to App
  flowType: FlowType; // Reference to FlowType
  platform: Platform[]; // Many references to Platform
}

interface FlowType {
  name: string; // Short text
  screen: Screen; // Reference to Screen
  steps: Step; // Reference to Step
}

interface Step {
  title: string; // Short text
  image_url: File; // File
  flow: FlowType; // Reference to FlowType
}
```

## Feature Specifications

### 1. Home/Browse Page
Location: `app/page.tsx`

Requirements:
- Grid view of apps displaying:
  - App name
  - Icon
  - Category
  - Flow tags
- Platform tabs (iOS, Android, Web)
  - Tabs should filter apps based on platform availability
  - An app can appear in multiple platform tabs if it supports multiple platforms
- Filters:
  - Category dropdown (Finance, Health, etc.)
  - Flow type filter (Onboarding, Payment, etc.)
- Search functionality:
  - Search by app name
  - Real-time filtering as user types

Performance Requirements:
- Optimize thumbnail images for fast loading
- Implement pagination or infinite scroll for grid view
- Server-side rendering for initial load
- Client-side filtering for responsive UX

### 2. App Detail Page
Location: `app/[appId]/page.tsx`

Requirements:
- Header section displaying:
  - App name
  - Description
  - Website URL
  - Total screen count
  - Total flow type count
  - Platform list
  - Category
- Two main tabs:
  1. Screens Tab:
     - Grid of all app screens
     - Clickable screens opening lightbox modal
     - Header showing "All Screens"
  2. Flows Tab:
     - Screens grouped by flow type
     - Count of screens per flow
     - Clickable flow groups opening modal with related screens
     - Flow type title in modal

Modal Requirements:
- Close button
- Similar design for both screens and flows views
- Optimized image loading
- Keyboard navigation support

### 3. API Integration

Location: `app/api/contentful/route.ts`

Implementation Example:
```typescript
import { NextResponse } from 'next/server';
import { createClient } from 'contentful';

export async function GET() {
  if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    return NextResponse.json({
      success: false,
      error: 'Missing Contentful credentials',
    }, { status: 500 });
  }

  try {
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    });

    const response = await client.getEntries({
      content_type: 'app',
    });

    const transformedItems = response.items.map(item => ({
      id: item.sys.id,
      fields: {
        name: item.fields.name,
        description: item.fields.description,
        id: item.fields.id,
        category: item.fields.category ? {
          id: item.fields.category.sys.id,
          name: item.fields.category.fields.name,
        } : null,
        platforms: Array.isArray(item.fields.platforms) 
          ? item.fields.platforms.map((platform: any) => ({
              id: platform.sys.id,
              name: platform.fields.name,
            }))
          : [],
        screens: Array.isArray(item.fields.screens)
          ? item.fields.screens.map((screen: any) => ({
              id: screen.sys.id,
              title: screen.fields.title,
              imageUrl: screen.fields.image?.fields.file.url,
            }))
          : [],
      },
    }));

    return NextResponse.json({
      success: true,
      spaceId: process.env.CONTENTFUL_SPACE_ID,
      totalEntries: response.total,
      items: transformedItems,
    });
  } catch (error: any) {
    console.error('Contentful Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        message: error.message,
        name: error.name,
      },
    }, { status: 500 });
  }
}
```

## Technical Requirements

### 1. Component Development
- All new components must be in `/components` directory
- Use kebab-case for file naming
- Mark client components with 'use client' directive
- Server components should handle data fetching
- Implement proper TypeScript types for all props

### 2. API Integration
- All external API calls must be server-side
- Create dedicated API routes for external services
- Implement proper error handling and logging
- Return standardized response formats

### 3. Environment Configuration
Required Variables:
```
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_ENVIRONMENT=master
```

### 4. Performance Requirements
- Implement image optimization
- Use server-side rendering for main pages
- Minimize client-side state
- Implement proper loading states
- Handle error boundaries

### 5. Development Guidelines
- Use TypeScript for all components and functions
- Implement proper error boundaries
- Follow Next.js 14 best practices
- Use Shadcn/UI components where applicable
- Maintain responsive design throughout

## Error Handling
- Implement error boundaries for each page
- Create user-friendly error messages
- Log errors server-side for debugging
- Handle network errors gracefully
- Implement retry mechanisms where appropriate

## Dependencies
- Next.js 14
- React 18+
- Contentful Client
- Shadcn/UI
- Tailwind CSS
- TypeScript 5+

## Getting Started
1. Clone repository
2. Install dependencies
3. Set up environment variables
4. Set up Contentful space and content models
5. Run development server

This PRD serves as the single source of truth for development. Any deviations should be discussed and documented.