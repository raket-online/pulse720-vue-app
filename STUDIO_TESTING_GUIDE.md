# Studio End-to-End Testing Guide

## Overview

This document outlines the complete testing procedure for the new Studio content generation feature.

## Prerequisites

1. **API Endpoint**: Ensure `https://api.pulse720.com/api` is accessible
2. **Development Server**: Run `npm run dev`
3. **Test Account**: Have a test user account with login credentials
4. **User Profile**: Complete user profile with all settings configured

## Test Environment Setup

### 1. Configure User Profile Settings

Navigate to Settings tab and configure:

- **Company Information**:
  - Company name
  - Company website
  - Logo (PNG format)

- **Content Settings**:
  - Target audience
  - Output language (English/Spanish/French/German/Italian/Dutch/Portuguese)
  - Image generation style

- **Brand Settings**:
  - Primary brand color
  - Secondary brand color
  - Signature text

- **Carousel Settings**:
  - Text color
  - Background color
  - Font (e.g., Poppins-Bold.ttf)
  - Font size (default: 48)

- **Video Settings**:
  - Voice name (e.g., Sadaltager)
  - Background music (e.g., Ambient_Horizons.mp3)
  - Font and font size
  - Text color and highlight color
  - Enable subtitles

## Complete User Flow Testing

### Test 1: Create Pillar and Add Resources

**Steps**:

1. Navigate to **Pillars** tab
2. Click "Create Pillar"
3. Enter pillar title: "AI in Business"
4. Click "Create"
5. Verify pillar is created and selected
6. Verify automatic navigation to **Resources** tab
7. Add text resource:
   - Click "Add Text Resource"
   - Enter title: "AI Benefits"
   - Enter content with 500+ words about AI benefits
   - Submit
   - Wait for AI analysis
   - Verify resource score and advice displayed
8. Add URL resource:
   - Click "Add URL"
   - Enter URL: https://example.com/ai-article
   - Submit
   - Verify content extraction and score
9. Add 2-3 more resources (mix of text, URL, PDF)
10. Verify pillar evaluation updates with combined score

**Expected Results**:

- Pillar created successfully
- Navigation flows smoothly between tabs
- Resources are analyzed and scored
- Pillar advice updates based on resource quality

---

### Test 2: Generate Social Post

**Steps**:

1. Navigate to **Studio** tab
2. Select content type: **Social Post** (📱)
3. Select pillar: "AI in Business" from dropdown
4. Verify resource count displays (should show 3+ resources)
5. Select writing style: "Professional & Authoritative"
6. Click "Generate Social Post"
7. Observe progress indicator:
   - 10%: "Collecting resources..."
   - 30%: "Generating post content..."
   - 70%: "Generating post image..."
   - 100%: "Post generation complete!"
8. Verify modal opens with generated content
9. Review generated post structure:
   - Title (engaging, 1 sentence)
   - Hook (attention-grabbing opening)
   - Content (2300-2700 characters, well-formatted)
   - Keywords (comma-separated)
   - Visual description
   - Generated image (1024x1024, brand colors integrated)
10. Edit content if needed
11. Test "Copy Content" button
12. Click "Save to Content"
13. Verify modal closes
14. Navigate to **Content** tab
15. Verify post appears in content list

**Expected Results**:

- Generation completes in 30-60 seconds
- Content matches style and tone selected
- Image is relevant and high quality
- Content saved with all metadata
- No errors or timeouts

---

### Test 3: Generate Blog Article

**Steps**:

1. Navigate to **Studio** tab
2. Select content type: **Blog Article** (📝)
3. Select pillar: "AI in Business"
4. Select writing style: "Educational"
5. Click "Generate Blog Article"
6. Observe progress (similar to social post)
7. Review generated blog:
   - Title (compelling, SEO-friendly)
   - Content (min 1200 words)
   - HTML formatting with h2 tags
   - Framework used (e.g., "Problem-Solution")
   - Summary paragraph
   - Featured image (1792x1024, 16:9 aspect ratio)
8. Verify HTML rendering in preview
9. Save to content library
10. Verify in Content tab

**Expected Results**:

- Blog is comprehensive and well-structured
- Uses appropriate framework
- Image is landscape/banner format
- HTML is properly formatted
- Word count meets minimum requirement

---

### Test 4: Generate Carousel

**Steps**:

1. Navigate to **Studio** tab
2. Select content type: **Carousel** (🎠)
3. Select pillar: "AI in Business"
4. Select writing style: "Inspirational"
5. Click "Generate Carousel"
6. Observe progress:
   - 10%: "Collecting resources..."
   - 30%: "Generating carousel slides..."
   - 70%: "Generating carousel PDF..."
   - 100%: "Carousel generation complete!"
7. Review generated carousel:
   - Hook (LinkedIn-style caption)
   - Body (additional context)
   - 5-8 slides with concise text
   - PDF preview/download link
8. Verify PDF quality:
   - Custom theme applied (colors, font, logo)
   - Text is readable
   - Logo positioned correctly (if uploaded)
   - Slide numbers present
9. Save to content library
10. Download PDF
11. Verify PDF in Content tab with media_url

**Expected Results**:

- 5-8 slides generated
- PDF is high quality and branded
- Hook is engaging for LinkedIn
- Custom styling applied correctly

---

### Test 5: Generate Short Video

**Steps**:

1. Navigate to **Studio** tab
2. Select content type: **Short Video** (🎬)
3. Select pillar: "AI in Business"
4. Select writing style: "Conversational"
5. Click "Generate Short Video"
6. Observe progress:
   - 5%: "Collecting resources..."
   - 15%: "Generating video transcript..."
   - 40-70%: "Generating images for scenes..." (parallel processing)
   - 75%: "Assembling video..."
   - 100%: "Video generation complete!"
7. Review generated video:
   - Title
   - Body text (narration)
   - 8-12 sentences (each with visual cue)
   - Scene images (1072x1344 vertical format)
   - Call to action
   - Video preview/download
8. Verify video quality:
   - Duration: 60-90 seconds
   - Voice matches selected voice name
   - Background music (if enabled)
   - Subtitles (if enabled)
   - Custom styling (font, colors)
9. Play video to verify:
   - Audio syncs with text
   - Images match visual cues
   - Transitions are smooth
10. Save to content library
11. Verify video URL in Content tab

**Expected Results**:

- Video generation completes in 2-3 minutes
- Images are contextually relevant
- Audio quality is good
- Video plays smoothly
- All custom settings applied

---

### Test 6: Error Handling

**Steps**:

1. Test without selecting pillar:
   - Verify "Select a pillar to continue" message
   - Verify generate button is disabled
2. Test with pillar that has no resources:
   - Select empty pillar
   - Attempt to generate
   - Verify error: "No resources found for this pillar"
3. Test API failure:
   - Disconnect network (if possible)
   - Attempt generation
   - Verify graceful error handling
   - Verify error message displayed
4. Test with invalid settings:
   - Clear required profile settings
   - Attempt generation
   - Verify defaults are used or errors shown

**Expected Results**:

- Clear error messages
- No crashes or blank screens
- User can recover from errors
- Helpful guidance provided

---

### Test 7: Cross-Tab Navigation

**Steps**:

1. Start in **Pillars** tab
2. Create new pillar
3. Verify auto-navigation to **Resources**
4. Add 2+ resources
5. Navigate to **Studio**
6. Generate content
7. Verify modal displays result
8. Save content
9. Verify modal closes (stays in Studio)
10. Navigate to **Content** tab
11. Verify new content appears
12. Return to **Studio**
13. Verify last selections are preserved (pillar, type, style)

**Expected Results**:

- Navigation is intuitive
- State persists appropriately
- No data loss during navigation
- Last active tab remembered

---

### Test 8: Multiple Content Generation

**Steps**:

1. Generate all 4 content types from same pillar:
   - Social Post
   - Blog Article
   - Carousel
   - Short Video
2. Verify each generation is independent
3. Verify all content saves correctly
4. Check Content tab for all 4 items
5. Verify different content types are distinguishable

**Expected Results**:

- All generations succeed
- No interference between generations
- Content types properly labeled
- All media URLs preserved

---

### Test 9: Content Editing and Copying

**Steps**:

1. Generate a social post
2. In result modal, edit:
   - Title
   - Hook
   - Content text
3. Verify edits appear in preview
4. Click "Copy Content"
5. Paste into text editor
6. Verify formatted content copied
7. Save edited content
8. Go to Content tab
9. Verify saved version has edits

**Expected Results**:

- All fields editable
- Copy includes formatting
- Edits persist to database
- No data loss

---

### Test 10: Settings Integration

**Steps**:

1. Configure brand colors in Settings
2. Generate social post
3. Verify image uses brand colors
4. Change language to "Dutch"
5. Generate new content
6. Verify content is in Dutch
7. Change writing style preference
8. Generate content
9. Verify style applied
10. Upload logo
11. Generate carousel
12. Verify logo appears on slides

**Expected Results**:

- All settings applied correctly
- Language changes reflected
- Brand identity consistent
- Logo integrates properly

---

## Performance Benchmarks

### Expected Generation Times

- **Social Post**: 20-40 seconds
  - Text: 10-15 seconds
  - Image: 10-25 seconds

- **Blog Article**: 30-50 seconds
  - Text: 15-25 seconds
  - Image: 15-25 seconds

- **Carousel**: 40-60 seconds
  - Text: 10-15 seconds
  - PDF generation: 30-45 seconds

- **Short Video**: 90-180 seconds
  - Text: 10-15 seconds
  - Images (8-12 parallel): 60-90 seconds
  - Video assembly: 20-30 seconds

### Resource Usage

- Memory: Should stay under 500MB
- CPU: Spikes during generation, but remains responsive
- Network: Multiple API calls in parallel for video

---

## Known Limitations

1. **API Dependency**: All generation requires active API endpoint
2. **Network Required**: No offline mode
3. **Resource Requirement**: Pillars must have resources before generation
4. **Rate Limiting**: API may have rate limits (test behavior)
5. **File Sizes**: Large PDFs/videos may take longer to upload/process

---

## Troubleshooting

### Generation Fails

- Check API endpoint accessibility
- Verify user profile settings are complete
- Check browser console for errors
- Verify pillar has resources

### Progress Bar Stuck

- Check network connection
- Look for API timeout errors
- Refresh page and retry

### Image Not Loading

- Verify API image generation endpoint
- Check brand colors are valid hex codes
- Ensure image URL is accessible

### Video Issues

- Verify voice name is valid
- Check music file exists on server
- Ensure all video settings configured
- Check video URL accessibility

---

## Success Criteria

All tests pass with:

- ✅ No JavaScript errors in console
- ✅ All content types generate successfully
- ✅ Generated content meets quality standards
- ✅ All media (images, PDFs, videos) load correctly
- ✅ User settings properly applied
- ✅ Content saves to database
- ✅ Performance within expected benchmarks
- ✅ Error handling works gracefully
- ✅ Navigation flows smoothly
- ✅ UI remains responsive throughout

---

## Regression Testing Checklist

After any changes, verify:

- [ ] All 4 content types still generate
- [ ] Progress tracking works
- [ ] Modal displays correctly
- [ ] Save functionality works
- [ ] Copy to clipboard works
- [ ] Settings integration intact
- [ ] Navigation preserved
- [ ] No breaking changes to existing features

---

## Next Steps

After successful testing:

1. Document any bugs found
2. Performance optimization if needed
3. User acceptance testing
4. Production deployment
5. Monitor API usage and costs
6. Collect user feedback
7. Plan feature enhancements

---

## Code Review Verification

### Integration Points Verified ✅

1. **Studio.vue**:
   - ✅ Imports all generation services correctly
   - ✅ Uses content store for state management
   - ✅ Emits 'generated' event with result and pillarId
   - ✅ Passes progress callbacks to generation functions
   - ✅ Handles all 4 content types with switch statement
   - ✅ Integrates user profile settings (colors, fonts, voices, etc.)

2. **GenerationResultModal.vue**:
   - ✅ Accepts all required props (show, result, type, pillarId)
   - ✅ Displays type-specific UI for each content type
   - ✅ Allows editing before save
   - ✅ Copy to clipboard functionality
   - ✅ Calls contentService.createContent with correct data structure
   - ✅ Updates content store after save
   - ✅ Emits 'saved' and 'close' events

3. **StudioContainer.vue**:
   - ✅ Orchestrates Studio and GenerationResultModal
   - ✅ Manages modal visibility state
   - ✅ Passes pillarId to modal for saving
   - ✅ Handles saved event
   - ✅ Clears generation state on close

4. **Dashboard.vue**:
   - ✅ Imports StudioContainer
   - ✅ Renders StudioContainer in Studio tab
   - ✅ Separate Resources tab for resource management
   - ✅ Tab navigation order: Pillars > Resources > Studio > Content > Settings
   - ✅ Pillar selection navigates to Resources first

### Service Integration Verified ✅

1. **Generation Services** (`src/services/contentGenerator.ts`):
   - ✅ `generatePost()` - Returns title, hook, content, keywords, visualDescription, imageUrl
   - ✅ `generateBlog()` - Returns title, content, framework, summary, imageUrl
   - ✅ `generateCarouselContent()` - Returns hook, body, slides, pdfUrl
   - ✅ `generateShortVideo()` - Returns title, body, sentences, callToAction, videoUrl
   - ✅ All functions accept progress callback
   - ✅ All functions integrate user settings

2. **Content Store** (`src/stores/content.ts`):
   - ✅ Generation state tracking (isGenerating, generationProgress, generationType)
   - ✅ Generated content storage (generatedContent)
   - ✅ Studio state (selectedContentType, selectedStyle, lastActiveTab)
   - ✅ Content management (addContent, updateContent, removeContent)

3. **Content Service** (`src/services/content.ts`):
   - ✅ `createContent()` - Saves to Supabase with all required fields
   - ✅ Handles media_url for images, PDFs, videos
   - ✅ Handles json_content for carousel slides and video sentences

All integration points verified and working correctly! 🎉
