# Generation Configuration

## Overzicht

Dit is de **centrale configuratie** voor alle AI content generatie. In één bestand (`generationConfig.ts`) bepaal je voor elk content type (post, blog, carousel, video) welke AI provider, model en parameters worden gebruikt.

## Waarom Centraal?

**Voor de refactor:**

- API settings verspreid over meerdere bestanden
- Hardcoded providers en models
- Moeilijk om wijzigingen door te voeren
- Geen overzicht van wat waar gebruikt wordt

**Na de refactor:**

- ✅ Alle instellingen in 1 bestand
- ✅ Duidelijk overzicht per content type
- ✅ Makkelijk experimenteren met providers/models
- ✅ Type-safe met TypeScript
- ✅ Klaar voor A/B testing en fallbacks

## Gebruik

### Simpel: Gebruik de Defaults

De meeste developers hoeven niets te doen. De standaard configuratie werkt out-of-the-box:

```typescript
// In je code hoef je niets te wijzigen!
const result = await generatePost(options, onProgress)
// Gebruikt automatisch de config uit generationConfig.ts
```

### Geavanceerd: Model Wisselen voor Specifiek Content Type

Wil je bijvoorbeeld GPT-4 gebruiken voor blogs omdat ze langer moeten zijn?

**src/config/generationConfig.ts:**

```typescript
const BLOG_CONFIG: GenerationConfig = {
  provider: 'openai', // ← Wijzig hier
  model: 'gpt-4-turbo', // ← Wijzig hier
  temperature: 0.9,
  max_tokens: 12000, // ← GPT-4 heeft meer tokens
  json_format: true,
  promptTemplate: BLOG_POST_TEMPLATE,
}
```

Klaar! Alle blog generaties gebruiken nu GPT-4.

### Experimenteren: A/B Testing Setup

Wil je 50% Gemini, 50% Claude testen voor social posts?

```typescript
// Optie 1: Gebruik primaire config met fallback
const POST_CONFIG: GenerationConfig = {
  provider: 'gemini',
  model: 'gemini-2.5-pro',
  temperature: 1.0,
  max_tokens: 5000,
  json_format: true,
  promptTemplate: SOCIAL_POST_TEMPLATE,
  fallback: {
    provider: 'anthropic', // ← Fallback naar Claude
    model: 'claude-3-5-sonnet',
  },
}

// Later: Random select in code
const useExperiment = Math.random() < 0.5
const config = useExperiment ? POST_CONFIG.fallback : POST_CONFIG
```

## Configuratie Opties

### Per Content Type

Elk content type heeft zijn eigen configuratie:

| Content Type | Provider | Model          | Max Tokens | Temperature | Waarom                           |
| ------------ | -------- | -------------- | ---------- | ----------- | -------------------------------- |
| **Post**     | Gemini   | gemini-2.5-pro | 5000       | 1.0         | Korte content, hoge creativiteit |
| **Blog**     | Gemini   | gemini-2.5-pro | 8000       | 0.9         | Lange content, meer coherentie   |
| **Carousel** | Gemini   | gemini-2.5-pro | 5000       | 1.1         | Slides, extra creativiteit       |
| **Video**    | Gemini   | gemini-2.5-pro | 4000       | 0.95        | Transcript, gebalanceerd         |

### Beschikbare Providers

De backend ondersteunt deze providers:

```typescript
type Provider = 'gemini' | 'openai' | 'anthropic' | 'grok'
```

**Gemini** (Google):

- ✅ Goedkoop
- ✅ Snel
- ✅ Nederlands goed
- Model: `gemini-2.5-pro`

**OpenAI**:

- ✅ Hoogste kwaliteit
- ❌ Duurder
- Model: `gpt-4-turbo-preview`, `gpt-4`, `gpt-3.5-turbo`

**Anthropic** (Claude):

- ✅ Goede reasoning
- ✅ Lange context
- Model: `claude-3-5-sonnet`, `claude-3-opus`

**Grok** (X/Twitter):

- ⚠️ Experimenteel
- Model: `grok-2`

## Praktijkvoorbeelden

### Voorbeeld 1: Kosten Optimalisatie

Je wilt goedkopere models voor drafts:

```typescript
const POST_CONFIG: GenerationConfig = {
  provider: 'openai',
  model: 'gpt-3.5-turbo', // ← Goedkoper dan GPT-4
  temperature: 1.0,
  max_tokens: 4000, // ← Minder tokens = goedkoper
  json_format: true,
  promptTemplate: SOCIAL_POST_TEMPLATE,
}
```

### Voorbeeld 2: Kwaliteit Boost voor Premium Users

In de toekomst kun je per user tier verschillende configs gebruiken:

```typescript
// services/contentGenerator.ts
export async function generatePost(options, onProgress) {
  // Bepaal config based on user tier
  const userTier = options.userTier || 'free'
  const configType = userTier === 'premium' ? 'post_premium' : 'post'
  const config = getGenerationConfig(configType)

  // Rest blijft hetzelfde...
}
```

### Voorbeeld 3: Taal-Specifieke Models

Voor bepaalde talen kunnen specifieke models beter zijn:

```typescript
const BLOG_NL_CONFIG: GenerationConfig = {
  provider: 'gemini', // Gemini is beter in Nederlands
  model: 'gemini-2.5-pro',
  temperature: 0.9,
  max_tokens: 8000,
  json_format: true,
  promptTemplate: BLOG_POST_TEMPLATE,
}

const BLOG_EN_CONFIG: GenerationConfig = {
  provider: 'openai', // GPT-4 excelleert in Engels
  model: 'gpt-4-turbo',
  temperature: 0.9,
  max_tokens: 8000,
  json_format: true,
  promptTemplate: BLOG_POST_TEMPLATE,
}
```

## Helper Functions

### `getGenerationConfig(contentType)`

Haalt de volledige config op inclusief prompt template:

```typescript
const config = getGenerationConfig('blog')
console.log(config)
// {
//   provider: 'gemini',
//   model: 'gemini-2.5-pro',
//   temperature: 0.9,
//   max_tokens: 8000,
//   json_format: true,
//   promptTemplate: '...',
//   description: 'Blog article generation...'
// }
```

### `getAPIConfig(contentType)`

Haalt alleen de API settings op (zonder prompt):

```typescript
const apiConfig = getAPIConfig('post')
console.log(apiConfig)
// {
//   provider: 'gemini',
//   model: 'gemini-2.5-pro',
//   temperature: 1.0,
//   max_tokens: 5000,
//   json_format: true
// }
```

### `validateConfig(config)`

Valideert of een config compleet en geldig is:

```typescript
const isValid = validateConfig(myConfig)
// true if all required fields present and valid
```

## Testing

### Unit Tests

Test verschillende configuraties:

```typescript
import { getGenerationConfig, validateConfig } from '@/config/generationConfig'

describe('Generation Config', () => {
  it('should return valid config for all content types', () => {
    const types = ['post', 'blog', 'carousel', 'shortvideo']

    types.forEach((type) => {
      const config = getGenerationConfig(type)
      expect(validateConfig(config)).toBe(true)
    })
  })

  it('should have different max_tokens for blog', () => {
    const blogConfig = getGenerationConfig('blog')
    const postConfig = getGenerationConfig('post')

    expect(blogConfig.max_tokens).toBeGreaterThan(postConfig.max_tokens)
  })
})
```

### Manual Testing

Test in de browser console:

```javascript
// Open browser console (F12)
import { getGenerationConfig } from './src/config/generationConfig'

// Check current post config
console.log(getGenerationConfig('post'))

// Wijzig config in generationConfig.ts
// Refresh pagina
// Test weer

// Check of generatie werkt met nieuwe config
```

## Best Practices

### DO ✅

1. **Centraliseer instellingen** - Alles in generationConfig.ts
2. **Gebruik descriptive comments** - Leg uit waarom bepaalde waarden gekozen zijn
3. **Test na wijzigingen** - Verifieer dat generatie nog werkt
4. **Document experimenten** - Noteer resultaten van A/B tests
5. **Gebruik fallbacks** - Voor production stability

### DON'T ❌

1. **Hardcode settings** - Niet in generation.ts of contentGenerator.ts
2. **Skip validation** - Gebruik altijd validateConfig()
3. **Extreme waarden** - Temperature > 2.0 of < 0
4. **Vergeet costs** - Sommige models zijn 10x duurder
5. **Test niet** - Wijzig nooit zonder te testen

## Monitoring

### Wat te Monitoren

Track deze metrics per config:

- **Generation time** - Hoe snel is het model?
- **Error rate** - Hoeveel requests falen?
- **Cost per request** - Wat kost één generatie?
- **Quality score** - User feedback of rating
- **Token usage** - Hoeveel tokens worden gebruikt?

### Logging

De config wordt automatisch gelogd:

```typescript
console.log('Post text generation result:', textResult)
// Bevat info over welke provider/model gebruikt werd
```

## Future Improvements

Mogelijke uitbreidingen:

1. **Dynamic Loading** - Configs uit database laden
2. **User Preferences** - Per user custom configs
3. **Auto-Optimization** - ML model kiest beste config
4. **Cost Tracking** - Real-time kosten monitoring
5. **Performance Analytics** - Welke config is snelst/best/goedkoopst?
6. **Geographic Routing** - Andere providers per regio
7. **Time-based** - Goedkopere models buiten piekuren
8. **Retry Logic** - Auto-fallback bij failures

## Troubleshooting

### "Niet-ondersteunde provider" Error

**Probleem:** Backend geeft error over provider.

**Oplossing:** Check of de provider in de lijst staat:

```typescript
type Provider = 'gemini' | 'openai' | 'anthropic' | 'grok'
```

### Generation Fails

**Probleem:** Content generatie failt altijd.

**Debug steps:**

1. Check console logs voor API response
2. Verify config met `validateConfig()`
3. Test met default config
4. Check API endpoint bereikbaarheid

### Wrong Output Format

**Probleem:** API geeft niet de verwachte JSON structuur.

**Oplossing:** Verify `json_format: true` in config en check prompt template.

## Vragen?

- **Bug of issue?** → Maak een GitHub issue
- **Feature request?** → Discuss in team meeting
- **Config wijziging voor productie?** → Test eerst lokaal, dan staging, dan prod

---

**Laatst bijgewerkt:** 2025-01-XX
**Maintainer:** Development Team
**Versie:** 1.0.0
