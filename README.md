# Pulse720 Vue App

AI-Powered Content Management Platform built with Vue 3, TypeScript, and Supabase.

## Overview

Pulse720 is a comprehensive content management application that helps users create, manage, and schedule AI-powered content across multiple platforms. This Vue.js frontend provides an intuitive interface for managing content pillars, resources, and AI-generated content.

## Features

### Phase 1 (Current) ✅
- **Authentication System**
  - Email/password login and registration
  - Google OAuth integration
  - Supabase authentication
  - Protected routes with auth guards

- **Core Infrastructure**
  - Vue 3 with Composition API
  - TypeScript for type safety
  - Tailwind CSS 4 for styling
  - Vue Router for navigation
  - Pinia for state management
  - Supabase integration

- **Basic Dashboard**
  - Tab-based navigation (Pillars, Studio, Content, Settings)
  - User profile display
  - Logout functionality

### Upcoming Phases

**Phase 2: Dashboard & Pillar Management**
- Pillar CRUD operations
- Pillar listing and selection
- Pillar detail view

**Phase 3: Resource Management**
- Resource ingestion (text, URL, YouTube, PDF, audio)
- AI-powered resource evaluation
- Resource listing and management

**Phase 4: Content Generation & Studio**
- AI content generation (posts, blogs, carousels, short videos)
- Content editing modals
- Image generation integration

**Phase 5: Scheduling & Publishing**
- Content scheduling system
- LinkedIn integration
- Carousel/Video rendering

**Phase 6: Settings & Polish**
- Company profile & branding
- Onboarding/tutorial flow
- Debug utilities

## Tech Stack

- **Frontend Framework:** Vue 3 (Composition API)
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4
- **State Management:** Pinia
- **Routing:** Vue Router
- **Backend:** Supabase (Authentication, Database, Storage)
- **Package Manager:** npm

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd pulse720-vue-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and update with your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=https://api.contento.expert
VITE_PULSE720_API_URL=https://api.pulse720.com
```

### 4. Set up Supabase

Create the following tables in your Supabase database:

```sql
-- Users profile table
CREATE TABLE users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  settings JSONB,
  company_name TEXT,
  company_website TEXT,
  target_audience TEXT,
  output_language TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  superuser BOOLEAN DEFAULT FALSE
);

-- Pillars table
CREATE TABLE pillars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  score NUMERIC,
  advice TEXT,
  create_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id UUID REFERENCES pillars(id) ON DELETE CASCADE,
  filename TEXT,
  file_url TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  score NUMERIC,
  advice TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content table
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pillar_id UUID REFERENCES pillars(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  hook TEXT,
  media_url TEXT,
  keywords TEXT,
  visual_description TEXT,
  content TEXT NOT NULL,
  json_content JSONB,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content schedule table
CREATE TABLE content_schedule (
  content_id UUID PRIMARY KEY REFERENCES content(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'scheduled',
  published_at TIMESTAMP WITH TIME ZONE,
  platform_post_id TEXT,
  error_message TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE
);

-- LinkedIn profiles table
CREATE TABLE linkedin_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  profile_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Enable Row Level Security (RLS) on all tables:

```sql
-- Enable RLS
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies (example for pillars - repeat for other tables)
CREATE POLICY "Users can view own pillars"
  ON pillars FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own pillars"
  ON pillars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pillars"
  ON pillars FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pillars"
  ON pillars FOR DELETE
  USING (auth.uid() = user_id);
```

### 5. Configure Google OAuth (Optional)

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Enable Google provider
4. Add your Google OAuth credentials
5. Configure the redirect URL in your Google Cloud Console

### 6. Run the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 7. Build for production

```bash
npm run build
```

### 8. Preview production build

```bash
npm run preview
```

## Project Structure

```
pulse720-vue-app/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable Vue components
│   ├── lib/            # Library code and configurations
│   │   └── supabase.ts # Supabase client setup
│   ├── router/         # Vue Router configuration
│   │   └── index.ts    # Route definitions and guards
│   ├── stores/         # Pinia stores
│   │   ├── index.ts    # Store exports
│   │   ├── auth.ts     # Authentication store
│   │   └── app.ts      # Application state store
│   ├── views/          # Page components
│   │   ├── Login.vue   # Login/Register page
│   │   ├── AuthCallback.vue  # OAuth callback handler
│   │   └── Dashboard.vue     # Main dashboard
│   ├── App.vue         # Root component
│   ├── main.ts         # Application entry point
│   └── style.css       # Global styles (Tailwind)
├── public/             # Public static files
├── .env                # Environment variables (not committed)
├── .env.example        # Environment variables template
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── README.md           # This file
```

## Development Guide

### State Management

The application uses Pinia for state management with two main stores:

1. **Auth Store** (`src/stores/auth.ts`)
   - User authentication state
   - Login/logout methods
   - Session management

2. **App Store** (`src/stores/app.ts`)
   - Application-wide state
   - Selected pillar
   - Settings
   - Current content being edited

### Authentication Flow

1. User visits protected route
2. Router guard checks authentication status
3. If not authenticated, redirects to `/login`
4. User can login with email/password or Google OAuth
5. On successful login, user is redirected to dashboard
6. Session is persisted using Supabase

### Adding New Features

1. Create new components in `src/components/`
2. Add new routes in `src/router/index.ts`
3. Create stores for complex state in `src/stores/`
4. Use Supabase client from `src/lib/supabase.ts` for database operations

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `VITE_API_BASE_URL` | Contento API base URL | No |
| `VITE_PULSE720_API_URL` | Pulse720 API base URL | No |

## Architecture Principles

- **Simple:** Clean component structure with clear separation of concerns
- **Easy to Extend:** Modular architecture with reusable components and composables
- **Easy to Manage:** Centralized state management and clear data flow

## Contributing

This is Phase 1 of the development. Future phases will add:
- Pillar management
- Resource ingestion
- AI content generation
- Scheduling and publishing
- Settings and customization

## License

[Your License Here]

## Support

For issues and questions, please create an issue in the repository.
