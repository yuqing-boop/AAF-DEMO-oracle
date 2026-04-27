# Product

## Register

product

## Campaign

This work is a **digital campaign** for **Affordable Art Fair (AAF)**—not a generic evergreen microsite. **Art Oracle** is the **hero surface** of the campaign: quiz-first, built to be **shared**, **finished in minutes**, and **legibly tied to attending the fair** (curiosity, tickets, wayfinding). Creative and UX decisions should hold up as **campaign assets** (social, email, on-site QR): immediate read, strong payoff, low embarrassment factor when forwarded.

## Users

Primary users are people joining the **online activation** for **Affordable Art Fair (AAF)**—often on phone or desktop at home—who may later attend the **physical fair**. The **quiz is the main experience**: they want a **short, playful ritual** (five questions) that feels credible—not a gimmick—to surface **one or more booth recommendations** aligned with their aesthetic sensibility, and that **builds motivation to show up in person**.

Typical context: casual browsing, shareable moments, limited patience; may switch between **English and Chinese** and expect both to feel equally intentional. For those who do attend on-site, the same patterns apply: one-handed use, variable lighting, quick decisions.

## Product Purpose

**Art Oracle** is the centerpiece of an **online campaign** for AAF: a lightweight **aesthetic-matching quiz** that maps answers to a six-dimensional booth profile and ranks booths. **Strategic goal:** lift **real-world fair participation**—curiosity, ticket intent, and floor traffic—by giving people a memorable, personal “preview” of what they might seek at the fair.

Success means users grasp the flow in under ten seconds, complete it without friction, and receive **memorable, poetically grounded match copy** (per booth) that makes the fair feel **navigable, personal, and worth visiting**.

## Brand Personality

**Oracular clarity.** Poetic but legible; contemporary art context without pretension. **Bilingual confidence**—no “translation-secondary” feel. **Grounded spectacle:** the experience should feel like stepping into a spiritual, meditative energy field.

Four words: **Contemplative**, **Direct**, **Chromatic**, **Fluid**.

## Visual Direction (CRITICAL)

The visual aesthetic has pivoted away from Neo-Brutalism. The UI must completely rely on a **magical, contemplative Aura / Mesh Gradient background** combined with **Organic Glassmorphism**.

### Background (Aura Metaballs)

Do **not** use standard flat colors or harsh linear gradients. The background should feel like a **breathing, spiritual energy field** (resembling thermal imaging or aura photography).

Implement this using a **generative Canvas** featuring fluid **Mesh Gradients** or glowing, highly blurred **radial gradients (Aura)** that organically merge together using **SVG goo filters (Metaball effect)**.

The colors should be **deep, chromatic, highly saturated but softly blended** (e.g., deep rust, mustard, vivid blue, and warm sand).

### UI Containers (Organic Glassmorphism)

UI cards and containers must **not** have harsh solid borders or strict rectangular shapes.

Use **frosted glass** effects (`backdrop-filter: blur(16px)`), **semi-transparent fills** (e.g., `rgba(255, 255, 255, 0.05)`), and **subtle translucent borders** (`1px solid rgba(255, 255, 255, 0.1)`).

**Organic shapes:** Use advanced CSS `border-radius` (e.g., `border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%`) to create amoeba-like, irregular containers that resemble pebbles or flower petals. Add **slow, subtle keyframe animations** to morph these shapes so the UI feels “alive” and breathing.

### Typography

Keep text and buttons **crisp, elegant, and highly legible**. Use **pure white or very light** text with a **subtle text-shadow** to pop against the glowing background.

## Anti-references

- Corporate SaaS quiz patterns (hero metrics, generic “you’re a Creator!” tropes, interchangeable card grids).
- Harsh Neo-Brutalist borders, strict right angles, solid blocky shadows, or ticket-stub aesthetics. (We are doing fluid/glass, not paper/brutalist.)
- Loud “crypto-neon” or clichéd art-fair clichés (default teal culture branding).
- UI that fights the user: tiny tap targets, unreadable type on mobile, motion that cannot be toned down for sensitivity.

## Design Principles

1. **Ritual before novelty** — Each step should feel like a deliberate beat in a short ceremony; avoid noisy chrome between questions.
2. **Trust the copy** — Booth names and match reasons are the emotional payoff; layout and motion should showcase them, not compete.
3. **Parity across languages** — EN/CN share hierarchy, line length discipline, and tone; no language is the “fallback.”
4. **Real-world readiness** — Online or on-site: one-handed use, glare, interruption; primary actions stay reachable and obvious.
5. **Fluid & breathing** — Motion should feel like slow-breathing energy, liquid paint, or drifting cells. Avoid erratic, tech-heavy, or fast-paced particle explosions.

## Accessibility & Inclusion

Target **WCAG 2.1 AA** where feasible. Respect **prefers-reduced-motion**: essential information and controls must remain usable without reliance on continuous or high-amplitude animation. Color is never the sole carrier of meaning for quiz options or results. Touch targets and contrast on mobile are non-negotiable for a fair-going audience.
