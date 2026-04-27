---
name: Architectural Precision
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1b1b1d'
  surface-container: '#1f1f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e4e2e4'
  on-surface-variant: '#c7c6ca'
  inverse-surface: '#e4e2e4'
  inverse-on-surface: '#303032'
  outline: '#919094'
  outline-variant: '#46464a'
  surface-tint: '#c8c6c7'
  primary: '#c8c6c7'
  on-primary: '#313031'
  primary-container: '#0a0a0b'
  on-primary-container: '#7a797a'
  inverse-primary: '#5f5e5f'
  secondary: '#c6c6c8'
  on-secondary: '#2f3132'
  secondary-container: '#454749'
  on-secondary-container: '#b4b5b7'
  tertiary: '#b8c3ff'
  on-tertiary: '#002388'
  tertiary-container: '#00062c'
  on-tertiary-container: '#486cff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e3'
  primary-fixed-dim: '#c8c6c7'
  on-primary-fixed: '#1c1b1c'
  on-primary-fixed-variant: '#474647'
  secondary-fixed: '#e2e2e4'
  secondary-fixed-dim: '#c6c6c8'
  on-secondary-fixed: '#1a1c1d'
  on-secondary-fixed-variant: '#454749'
  tertiary-fixed: '#dde1ff'
  tertiary-fixed-dim: '#b8c3ff'
  on-tertiary-fixed: '#001356'
  on-tertiary-fixed-variant: '#0035be'
  background: '#131315'
  on-background: '#e4e2e4'
  surface-variant: '#353437'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 80px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-silent: 128px
  section-gap: 160px
---

## Brand & Style

This design system is built for the persona of a software architect: a synthesis of engineering rigor and avant-garde aesthetic. The brand personality is "Engineered Silence"—a philosophy where every pixel serves a structural purpose and decoration is discarded in favor of intent. 

The visual identity draws from high-end AI research labs and precision hardware manufacturing. It evokes a sense of calm authority, sophisticated intelligence, and futuristic minimalism. The emotional response is one of trust and awe, achieved not through complexity, but through the perfect execution of simple elements. 

The style is a hybrid of **Minimalism** and **Glassmorphism**, utilizing extreme whitespace to create a "gallery" feel for technical content.

## Colors

The palette is anchored in a high-contrast dark mode. The primary background is a matte black (#0A0A0B), providing a void-like depth. Surface elements use a graphite gray (#1C1C1E) to define structural layers without breaking the monochromatic immersion.

Typography utilizes a soft white (#F5F5F7), reducing the eye strain typical of pure #FFFFFF while maintaining peak legibility. Accents are used sparingly as "data points": Electric Blue is reserved for primary actions and active states, while a subtle Violet provides depth in gradients or secondary focus areas. All colors should feel luminous against the dark backdrop, as if projected rather than printed.

## Typography

The typography strategy is editorial and structural. Large-scale headlines use **Inter** with aggressive negative letter-spacing to create a "block" of text that feels like a physical object. The hierarchy is steep; the difference between a headline and body text should be dramatic.

Body copy is optimized for technical readability with generous line heights. For metadata, technical labels, and monospaced accents, **Space Grotesk** is introduced to inject a subtle "lab" aesthetic. Text alignment should be used to create an asymmetrical balance—often aligning large headlines to the left while keeping supporting data far right or tucked into unconventional grid intersections.

## Layout & Spacing

This design system employs a 12-column high-precision grid, but it is used to create asymmetrical, "weighted" compositions. Large amounts of "silent" whitespace (128px+) are used to isolate components, forcing the user to focus on one piece of information at a time.

The layout philosophy is "Anchored Asymmetry." Elements should not always span the full container; a primary text block might occupy 6 columns starting from column 3, leaving the surrounding columns entirely empty. Spacing rhythm follows an 8px base unit, but transitions between sections use massive "section-gaps" to create a sense of scale and premium breathing room.

## Elevation & Depth

Hierarchy is established through **Backdrop Blurs** and **Ultra-Thin Outlines** rather than traditional shadows. This design system treats layers as sheets of tinted glass.

- **Level 0 (Base):** Matte Black background.
- **Level 1 (Surfaces):** Graphite (#1C1C1E) with a 0.5px solid stroke in soft white at 10% opacity.
- **Level 2 (Float):** 20px Backdrop blur with a subtle internal glow (top-down linear gradient).

Avoid "fuzzy" drop shadows. If depth must be reinforced, use a "Hard Shadow" (0px blur, 1px offset) that mimics a technical drawing's offset line.

## Shapes

The shape language is "Soft-Precision." We avoid the "bubbly" feel of consumer apps by using a tight 0.25rem (4px) base radius. This creates elements that feel slightly humanized but maintain a sharp, engineered edge. 

Interactive elements like buttons use the same radius to maintain a consistent silhouette. Larger containers may use the `rounded-lg` (8px) setting for a subtle distinction, but never exceed this. Circles are permitted only for status indicators or avatars.

## Components

### Buttons
Primary buttons are "Ghost-Luminous": a transparent center with an ultra-thin 1px Electric Blue border. On hover, the border glows with a 10px outer blur of the same color. Text is always uppercase Label-Caps.

### Cards & Containers
Avoid the "SaaS Card." Instead, use "Frameless Clusters." Group related content with whitespace and a single vertical or horizontal 0.5px line (Rule) to separate them. If a container is required, use a glass surface with a subtle 1px border.

### Inputs
Inputs are represented by a single bottom stroke (1px). The label sits above in `label-caps` at 50% opacity. Upon focus, the bottom stroke animates to Electric Blue, and the label slides slightly to the right.

### Technical Chips
Small, rectangular tags with 0px radius. Use for programming languages or architectural concepts. Background is Graphite, text is Electric Blue.

### Impact Components
- **The Monolith:** A large, high-contrast block used to highlight a single key metric or architectural principle, utilizing `headline-xl` typography.
- **The Trace Line:** A 0.5px decorative line that runs vertically across sections, connecting disparate data points and reinforcing the grid.