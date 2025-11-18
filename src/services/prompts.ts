/**
 * Prompt templates for content generation
 * Based on the Appsmith Prompts.js implementation
 */

export interface PromptPlaceholders {
  SUBJECT?: string
  TARGET_MARKET?: string
  LANGUAGE?: string
  STYLE?: string
  INPUT_TEXT?: string
}

/**
 * Replace placeholders in a template with actual values
 */
export function fillTemplate(template: string, placeholders: PromptPlaceholders): string {
  let result = template

  Object.entries(placeholders).forEach(([key, value]) => {
    if (value !== undefined) {
      const placeholder = `#${key}#`
      result = result.replace(new RegExp(placeholder, 'g'), value)
    }
  })

  return result
}

/**
 * Social Post Prompt Template
 */
export const SOCIAL_POST_TEMPLATE = `Jij bent een ervaren tekstschrijver en kan toveren met woorden. Jouw teksten zijn sterk en prettig om te lezen en zorgen dat mensen blijven lezen. Schrijf een social media post over '{subject}'. Maximaal 2900 tekens (streef naar 2300–2700). De doelgroep is: #TARGET_MARKET#. Output Taal: #LANGUAGE# Belangrijk: Gebruik enkel de input die ik aan het einde geef en GEEN andere bronnen!

Structuur:

Start altijd met een hook die de doelgroep benoemt en nieuwsgierig maakt. Let op: dit is normale tekst, geen kopje!

Belangrijk: deze hook moet gewone lopende tekst zijn, GEEN kopje, GEEN quotes, GEEN hoofdletters.

Begin de output ALTIJD met deze hook, nooit met een kopje.


Beschrijf het de symptomen van het probleem en waarom dit lastig is.

Benoem het probleem zelf

Benoem een mythe of een verkeerde oplossing (indien die in orginele input wordt benoemd)

Benoem de juiste oplossing

Eindig met een call-to-action of inspirerende afsluiter.


Stijlregels:

Schrijf in de stijl: #STYLE#.

Wanneer de input teveel is, wees dan selectief en pak een deel van de tekst:

Gebruik maximaal 3 emoji's.

Gebruik veel enters en korte alineas.

Gebruik kopjes in dit format (uppercase): >> DIT IS EEN KOPJE <<

Maak de kopjes creatief en prikkelend, alsof het mini-hooks zijn. - Kopjes mogen pas NA de hook komen.


Noem nooit letterlijk "Probleem", "Mythe", of "Oplossing".

Kopjes moeten nieuwsgierigheid oproepen en de lezer verder trekken.


Probeer altijd een mythe, een verkeerde oplossing of aanpak te benoemen.

Extra:

Bedenk ook een prikkelende titel die de inhoud goed dekt.

Genereer ook een image prompt geschikt voor AI-beeldgeneratiemodeelen (zoals DALL-E, midjourney, Stable Diffusion) die onderwerp, sfeer, stijl en kleuren beschrijft.

Geef een sterke hook (maximaal 10 woorden)


Geef sleutelwoorden die passen bij de inhoud van de post. Minimaal 1, maximaal 5 sleutelwoorden

Geef de output in JSON-formaat met de volgende structuur: Een object onder de key "post" met deze velden: "title": "Titel van de social media post", "hook": "Hook van de social media post", "content": "De inhoud van de social media post", "summary": "De image generatie prompt", "keywords": "De sleutelwoorden van de post" Vermeld niet dat het een json is, enkel de json zelf.

Hier volgt de input. #INPUT_TEXT#`

/**
 * Blog Post Prompt Template
 */
export const BLOG_POST_TEMPLATE = `Jij bent een ervaren tekstschrijver. Schrijf een uitgebreid blogartikel van minimaal 1200 woorden gebaseerd op de tekst die ik aan het einde geef. Gebruik geen andere bronnen. Gebruik de inhoud van deze tekst om het meest geschikte content framework (zoals AIDA, PAS, enz.) te kiezen. Het blogartikel moet beginnen met een boeiende introductie die de aandacht van de lezer trekt, gevolgd door gedetailleerde alineas die de belangrijkste punten van de gekozen framework uitlichten. Beschrijf de genoemde voorbeelden of verhalen uitgebreid in een losse alinea om de punten toe te lichten.

Doelgroep: #TARGET_MARKET#. Output Taal: #LANGUAGE# Belangrijk: Gebruik enkel de input die ik aan het einde geef en GEEN andere bronnen!

Stijlregels:

Gebruik deze schrijfstijl: #STYLE#.

Gebruik emojis maar niet meer dan 5 stuks.

Gebruiken html paragrafen (<p>)

Voeg aansprekende kopjes met (<h2>) toe boven elke alinea met alleen de eerste letter als hoofdletter (zinshoofdlettergebruik).


Extra:

Bedenk ook een aantrekkelijke haak/titel voor het blogartikel (maximaal 10 woorden).

Geef tenslotte een samenvatting van de post. Focus op de hoofdpunten en kernconcepten. Dit wordt gebruikt als goede DALL-E prompt om een subliem goede afbeelding te genereren die perfect past bij de blog.


Geef de output in JSON-formaat met de volgende structuur: Een object onder de key "blog" met deze velden: "title": "Titel/haak van de social media post", "content": "De inhoud van de social media post", "framework": "Gebruikte content framework", "summary": "De samenvatting tbv van de DALL-E prompt" Vermeld nooit in je reactie het woord 'json'.

Hier volgt de input. #INPUT_TEXT#`

/**
 * Carousel Prompt Template
 */
export const CAROUSEL_TEMPLATE = `Je bent een ervaren tekstschrijver die alles weet over schrijven van opvallende LinkedIn carrousels. Je teksten zijn scherp en zetten aan tot nadenken. Ik geef je een lange tekst van 1000 woorden of meer. Jouw taak is om hieruit een krachtige, inspirerende boodschap te destilleren voor een LinkedIn carrousel. Houd rekening met de volgende richtlijnen. Bron: Gebruik alleen de aangeleverde tekst en gebruik GEEN andere bronnen. Hook: De eerste sheet moet een zeer sterke hook bevatten die mensen direct stopt tijdens het scrollen, relevant is en de aandacht trekt. Dit kan een prikkelende vraag, een schokkend feit of een uitdagende stelling zijn. Boodschap: De carrousel moet een concrete en verrassende boodschap uit de tekst halen. Vermijd open deuren en clichés. Benoem wat je vooral niet moet doen en wat juist wel. Structuur: De carrousel bestaat uit 5 tot 8 sheets. Doelgroep: #TARGET_MARKET#. Output Taal: #LANGUAGE# Stijl: #STYLE#. Aantal woorden: tussen 20 en 35 woorden per sheet. Opmaak: gebruik op elke slide markdown om woorden of hele zinnen vet te maken, schuin te maken en accent te geven Vet, schuin, [accent]. Gebruik een enters (\\n) om de slide makkelijk leesbaar te houden. Flow: Elk slide moet logisch aansluiten op de vorige en de lezer nieuwsgierig maken naar de volgende. Einde: De laatste sheet moet de kern samenvatten en een lichte call-to-action bevatten (bijv. Doe dit, of Wat denk jij? of Hoe zie jij dit?).

Maak tenslotte een bijschrift voor de caroussel volgens deze structuur:

1. Hook (1-2 zinnen) - Pakkende vraag, stelling of statistiek


2. Context/probleem (2-3 zinnen) - Waarom is dit relevant?


3. Belofte van oplossing (1 zin) - Wat leert de lezer?


4. Subtiele call-to-action - Verwijs naar carousel


5. Afsluitende vraag - Stimuleer engagement



Vereisten:

80-160 woorden

Geen samenvatting, maar context

Persoonlijk en geloofwaardig

Focus op waarde voor lezer


Geef de output in JSON-formaat met de volgende structuur: Een array onder de key carousel, waarin elk object de volgende velden bevat: sheet: Het nummer van de slide. text: De tekst van de slide. Een key body met daarin het LinkedIn bijschrift voor de carousel. Een key hook met daarin de hook. #INPUT_TEXT#`

/**
 * Short Video Transcript Prompt Template
 */
export const SHORT_VIDEO_TEMPLATE = `Je bent een ervaren video scriptschrijver, gespecialiseerd in het creëren van korte, pakkende video's die de aandacht vasthouden. Jouw teksten zijn direct, to the point, en perfect geformuleerd voor een vlotte presentatie. Ik geef je een inputtekst. Jouw taak is om hieruit een transcript te genereren voor een korte video van 70 seconden.

Houd rekening met de volgende richtlijnen: Bron: Gebruik uitsluitend de aangeleverde inputtekst en GEEN andere bronnen. Lengte: Het transcript moet passen binnen ongeveer 70 seconden spreektijd. Dit betekent gemiddeld 150 woorden.

Opbouw:

Begin met een sterke, attention-grabbing hook (1-2 zinnen).

Verdeel de hoofdpunten van de inputtekst in afzonderlijke, korte zinnen. Elke zin moet een duidelijk punt overbrengen. Zinnen niet langer dan 15 woorden.

Voeg bij elke zin een engelse gedetaileerde en uitgebreide image generatie prompt toe die de boodschap visueel ondersteund.

Eindig met een duidelijke, activerende call-to-action of een vraag die de kijker aanzet tot nadenken.


Output Taal: #LANGUAGE# Doelgroep: #TARGET_MARKET#

Stijlregels:

Gebruik deze schrijfstijl: #STYLE#. Schrijf in een spreekstijl met korte, krachtige zinnen. Het moet klinken alsof iemand het vertelt.

Gebruik geen emojis.


Maak tenslotte een bijschrift voor de video volgens deze structuur:

1. Hook (1-2 zinnen) - Pakkende vraag, stelling of statistiek


2. Context/probleem (2-3 zinnen) - Waarom is dit relevant?


3. Belofte van oplossing (1 zin) - Wat leert de lezer?


4. Subtiele call-to-action - Verwijs naar video


5. Afsluitende vraag - Stimuleer engagement



Geef de output in JSON-formaat met de volgende structuur: Een object onder de key "video_transcript" met de volgende velden: "title": "Een pakkende titel voor de korte video", "duration_seconds": 60, "body": "Dit is de bijschrift van de video" "sentences": [ { "sheet": 1, "text": "De eerste korte, pakkende zin van het transcript.", "visual_cue": "Beschrijving van het visuele element dat hierbij past (bijv. 'afbeelding met mensen die overleggen')." "image_url": null }, { "sheet": 2, "text": "De tweede korte, pakkende zin die het verhaal verder vertelt.", "visual_cue": "Beschrijving van het volgende visuele element (bijv. 'Close-up van persoon die lacht')." "image_url": null } ], "call_to_action": "Een korte call-to-action of afsluitende vraag (optioneel)." Vermeld niet dat het een json is, enkel de json zelf.

Hier volgt de input. #INPUT_TEXT#`

/**
 * Image generation prompt templates
 */
export const POST_IMAGE_PROMPT_TEMPLATE = `Create a professional, eye-catching image for a social media post. Subject: #SUBJECT#. Style: modern, clean, vibrant. Color palette should include #PRIMARY_COLOR# and #SECONDARY_COLOR#. The image should be visually striking and suitable for social media platforms like LinkedIn, Instagram, or Facebook. #VISUAL_DESCRIPTION#`

export const BLOG_IMAGE_PROMPT_TEMPLATE = `Create a professional header image for a blog post. Subject: #SUBJECT#. Style: clean, professional, engaging. Color palette should include #PRIMARY_COLOR# and #SECONDARY_COLOR#. The image should complement the blog content and work well as a featured image. #VISUAL_DESCRIPTION#`

/**
 * Image generation presets
 */
export interface ImagePreset {
  name: string
  model: string
  size: string
  promptTemplate: string
}

export const IMAGE_PRESETS: Record<string, ImagePreset> = {
  post: {
    name: 'Social Post',
    model: 'fal-ai/ideogram/v3',
    size: '1024x1024',
    promptTemplate: POST_IMAGE_PROMPT_TEMPLATE,
  },
  blog: {
    name: 'Blog Header',
    model: 'fal-ai/ideogram/v3',
    size: '1792x1024',
    promptTemplate: BLOG_IMAGE_PROMPT_TEMPLATE,
  },
  carousel: {
    name: 'Carousel Background',
    model: 'fal-ai/ideogram/v3',
    size: '1024x1024',
    promptTemplate: POST_IMAGE_PROMPT_TEMPLATE,
  },
  video_frame: {
    name: 'Video Frame',
    model: 'fal-ai/flux/schnell',
    size: '1072x1344',
    promptTemplate: POST_IMAGE_PROMPT_TEMPLATE,
  },
}

/**
 * Writing styles
 */
export const WRITING_STYLES = [
  { value: 'professional', label: 'Professional & Authoritative' },
  { value: 'conversational', label: 'Conversational & Friendly' },
  { value: 'inspirational', label: 'Inspirational & Motivating' },
  { value: 'educational', label: 'Educational & Informative' },
  { value: 'storytelling', label: 'Storytelling & Narrative' },
  { value: 'analytical', label: 'Analytical & Data-driven' },
  { value: 'provocative', label: 'Provocative & Thought-provoking' },
]
