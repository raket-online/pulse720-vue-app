# Development Plan - Pulse720 Vue App

This document outlines the multi-phase development plan for the Pulse720 Vue application.

## Development Philosophy

- **Simple:** Clean, understandable code with clear separation of concerns
- **Easy to Extend:** Modular architecture that welcomes new features
- **Easy to Manage:** Centralized state management and clear data flow

## Phase Status

### ✅ Phase 1: Project Setup & Core Authentication (COMPLETED)

**Objectives:**
- Set up Vue 3 + TypeScript + Vite project
- Configure Tailwind CSS for styling
- Integrate Supabase client
- Implement authentication system
- Set up routing and state management
- Create basic dashboard structure

**Deliverables:**
- [x] Vue 3 project initialization
- [x] Tailwind CSS 4 configuration
- [x] Supabase client setup
- [x] Pinia store configuration
- [x] Authentication store (login, register, OAuth)
- [x] Vue Router with auth guards
- [x] Login/Register page with email/password and Google OAuth
- [x] OAuth callback handler
- [x] Basic dashboard with tab navigation
- [x] TypeScript configuration
- [x] Project documentation

**Testing Checklist:**
- [x] Application builds successfully
- [ ] Login with email/password works
- [ ] Register new account works
- [ ] Google OAuth flow works
- [ ] Protected routes redirect to login
- [ ] Logout functionality works
- [ ] Session persistence works across page refreshes

---

### 🔄 Phase 2: Dashboard & Pillar Management (IN PROGRESS)

**Objectives:**
- Implement pillar CRUD operations
- Create pillar listing UI
- Build pillar detail view
- Add pillar selection functionality

**Deliverables:**
- [ ] Pillar store in Pinia
- [ ] Pillar API service functions
- [ ] Pillar list component
- [ ] Create pillar modal
- [ ] Edit pillar functionality
- [ ] Delete pillar with confirmation
- [ ] Pillar selection state management
- [ ] Pillar detail view
- [ ] Empty state for no pillars

**Technical Tasks:**
- [ ] Create `src/stores/pillar.ts`
- [ ] Create `src/services/pillar.ts` for Supabase operations
- [ ] Create `src/components/pillars/PillarList.vue`
- [ ] Create `src/components/pillars/PillarCard.vue`
- [ ] Create `src/components/pillars/CreatePillarModal.vue`
- [ ] Update Dashboard.vue Pillars tab
- [ ] Add pillar score/advice display

**Testing Checklist:**
- [ ] Create new pillar
- [ ] View pillar list
- [ ] Select a pillar
- [ ] Edit pillar title
- [ ] Delete pillar
- [ ] Empty state displays correctly
- [ ] Loading states work
- [ ] Error handling works

---

### 📋 Phase 3: Resource Management

**Objectives:**
- Implement resource ingestion from multiple sources
- Create AI-powered resource evaluation
- Build resource listing and management UI

**Deliverables:**
- [ ] Resource store in Pinia
- [ ] Resource API service functions
- [ ] Text input modal for resources
- [ ] URL crawler integration
- [ ] YouTube transcript integration
- [ ] PDF upload and text extraction
- [ ] Audio recording integration
- [ ] AI summary and scoring
- [ ] Resource list component
- [ ] Resource card with score/advice
- [ ] Delete resource functionality
- [ ] Pillar evaluation based on resources

**Technical Tasks:**
- [ ] Create `src/stores/resource.ts`
- [ ] Create `src/services/resource.ts`
- [ ] Create `src/services/ai.ts` for AI operations
- [ ] Create resource modals (text, URL, YouTube, PDF, audio)
- [ ] Create `src/components/resources/ResourceList.vue`
- [ ] Create `src/components/resources/ResourceCard.vue`
- [ ] Integrate with Contento API for AI operations
- [ ] Add file upload handling
- [ ] Implement audio recorder component

**API Integrations:**
- Contento API: `/api/completion` for summarization
- Contento API: `/api/crawl` for URL extraction
- Contento API: `/api/youtubetranscript` for YouTube
- Contento API: `/api/pdf2txt` for PDF processing

**Testing Checklist:**
- [ ] Add resource from text input
- [ ] Add resource from URL
- [ ] Add resource from YouTube URL
- [ ] Add resource from PDF upload
- [ ] Add resource from audio recording
- [ ] AI summary generates correctly
- [ ] Resource score displays
- [ ] Delete resource works
- [ ] Pillar evaluation updates

---

### 🎨 Phase 4: Content Generation & Studio

**Objectives:**
- Implement AI content generation
- Create content editing modals
- Build studio workspace UI
- Integrate image generation

**Deliverables:**
- [ ] Content store in Pinia
- [ ] AI generation service
- [ ] Studio tab UI
- [ ] Content list component
- [ ] Post generation and editing
- [ ] Blog generation and editing
- [ ] Carousel generation and editing
- [ ] Short video transcript generation
- [ ] Image generation integration
- [ ] Content save/draft functionality
- [ ] Content deletion

**Technical Tasks:**
- [ ] Create `src/stores/content.ts`
- [ ] Create `src/services/content.ts`
- [ ] Create `src/services/generation.ts`
- [ ] Create content generation prompts
- [ ] Create `src/components/studio/ContentList.vue`
- [ ] Create `src/components/modals/PostModal.vue`
- [ ] Create `src/components/modals/BlogModal.vue`
- [ ] Create `src/components/modals/CarouselModal.vue`
- [ ] Create `src/components/modals/ShortVideoModal.vue`
- [ ] Implement image generation
- [ ] Add loading/progress states

**AI Integrations:**
- Text generation for posts, blogs, carousels, transcripts
- Image generation with brand colors
- Quick image generation for video frames

**Testing Checklist:**
- [ ] Generate post from pillar resources
- [ ] Generate blog from pillar resources
- [ ] Generate carousel from pillar resources
- [ ] Generate short video transcript
- [ ] Edit generated content
- [ ] Generate images with branding
- [ ] Save content as draft
- [ ] Delete content
- [ ] Progress indicators work

---

### 📅 Phase 5: Scheduling & Publishing

**Objectives:**
- Implement content scheduling system
- Integrate with LinkedIn
- Build carousel/video rendering
- Create publishing workflow

**Deliverables:**
- [ ] Scheduling store
- [ ] LinkedIn integration
- [ ] Schedule/unschedule functionality
- [ ] Content calendar view
- [ ] Carousel PDF rendering
- [ ] Short video rendering
- [ ] Media preview/download
- [ ] Publishing status tracking

**Technical Tasks:**
- [ ] Create `src/stores/schedule.ts`
- [ ] Create `src/services/linkedin.ts`
- [ ] Create `src/services/rendering.ts`
- [ ] Create `src/components/scheduling/ScheduleModal.vue`
- [ ] Create `src/components/content/ContentCalendar.vue`
- [ ] Integrate with Pulse720 API for rendering
- [ ] Add schedule management UI
- [ ] Implement status tracking

**API Integrations:**
- Pulse720 API: `/api/carousel` for carousel PDFs
- Pulse720 API: `/api/video` for short video rendering
- LinkedIn OAuth and posting API

**Testing Checklist:**
- [ ] Connect LinkedIn account
- [ ] Schedule content for future
- [ ] Unschedule content
- [ ] Render carousel PDF
- [ ] Render short video
- [ ] Preview rendered media
- [ ] Download rendered media
- [ ] View scheduled content

---

### ⚙️ Phase 6: Settings & Polish

**Objectives:**
- Implement settings management
- Create company profile UI
- Build brand customization
- Add onboarding flow
- Polish UI/UX

**Deliverables:**
- [ ] Settings store
- [ ] Settings management service
- [ ] Company profile form
- [ ] Brand customization UI (colors, fonts, logo)
- [ ] Short video settings
- [ ] Onboarding/tutorial modal
- [ ] Setup wizard
- [ ] Debug utilities
- [ ] User preferences
- [ ] UI refinements

**Technical Tasks:**
- [ ] Create settings schema
- [ ] Create `src/components/settings/CompanyProfile.vue`
- [ ] Create `src/components/settings/BrandSettings.vue`
- [ ] Create `src/components/settings/VideoSettings.vue`
- [ ] Create `src/components/onboarding/Tutorial.vue`
- [ ] Create `src/components/onboarding/SetupWizard.vue`
- [ ] Implement logo upload to Supabase Storage
- [ ] Add settings persistence
- [ ] Create debug panel

**Testing Checklist:**
- [ ] Update company profile
- [ ] Customize brand colors
- [ ] Upload company logo
- [ ] Configure video settings
- [ ] Complete onboarding flow
- [ ] Settings persist correctly
- [ ] Debug tools work for superusers

---

## Technical Debt & Future Enhancements

### Known Issues
- None yet (Phase 1)

### Performance Optimizations
- [ ] Implement virtual scrolling for large lists
- [ ] Add request caching
- [ ] Optimize image loading
- [ ] Lazy load modals

### Code Quality
- [ ] Add unit tests (Vitest)
- [ ] Add E2E tests (Playwright)
- [ ] Set up CI/CD pipeline
- [ ] Add error tracking (Sentry)
- [ ] Implement analytics

### UX Improvements
- [ ] Add keyboard shortcuts
- [ ] Improve mobile responsiveness
- [ ] Add dark mode
- [ ] Add accessibility features (WCAG 2.1)
- [ ] Add internationalization (i18n)

---

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow Vue 3 Composition API patterns
- Use Pinia for state management
- Keep components small and focused
- Write self-documenting code with clear names

### Component Structure
```
ComponentName.vue
├── <template>     # HTML structure
├── <script setup> # Logic with TypeScript
└── <style>        # Scoped styles (if needed)
```

### State Management Pattern
- **Stores:** Manage domain-specific state (auth, pillars, resources, content)
- **Services:** Handle API calls and business logic
- **Components:** Focus on presentation and user interaction

### Git Workflow
- Main branch: `main` (or as specified in project)
- Feature branches: `claude/feature-name-sessionid`
- Commit messages: Clear, descriptive, present tense
- Push regularly to track progress

### Testing Strategy
- Manual testing after each phase
- Automated tests to be added in future phases
- Check all user flows and edge cases
- Test with real Supabase data

---

## Resources

### Documentation
- [Vue 3 Docs](https://vuejs.org/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Supabase Docs](https://supabase.com/docs)

### APIs
- Supabase API (Auth, Database, Storage)
- Contento API (AI completion, crawling, etc.)
- Pulse720 API (Rendering)

---

## Progress Tracking

Last Updated: 2025-11-12
Current Phase: Phase 1 ✅ COMPLETED
Next Phase: Phase 2 (Pillar Management)
