# Design Variation 2: Brutalist/Technical

**Created:** 2025-12-29
**Status:** Alternative design - not implemented, kept for future reference

## Aesthetic Direction

Bold, grid-based brutalist design with high typographic contrast and geometric precision. Appeals to technical audience through systematic layout and unapologetic use of space.

## Color Palette (Solarized Light)

```css
--base3: #fdf6e3       /* Main background - warm cream */
--base2: #eee8d5       /* Secondary background */
--base1: #93a1a1       /* Grid lines/borders */
--base02: #073642      /* Primary text, hero background */
--base01: #586e75      /* Secondary text */
--yellow: #b58900      /* CTA section background */
--green: #859900       /* Primary service accent */
--blue: #268bd2        /* Secondary service accent */
--cyan: #2aa198        /* Hero label, borders */
```

## Typography

- **Display/Headings**: Work Sans (800 weight, uppercase, tight letter-spacing)
- **Monospace**: JetBrains Mono (400, 700, 800 weights)
- **Body**: Work Sans (400, 600)

**Scale:**
- Hero H1: 96px, uppercase, -0.04em tracking
- Section H2: 48px
- Service H3: 36px
- Monospace labels: 10-12px, 0.15-0.2em tracking

## Grid System

12-column grid with 2px gaps throughout entire page. Grid lines visible as subtle separators (base1 color).

```css
main {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2px;
  background: #93a1a1; /* grid lines */
}
```

## Key Sections

### Hero (grid-column: 1 / -1)
- Dark background (#073642) contrasting with light page
- Content: grid-column 2/12 (inset)
- Cyan label + huge uppercase name + green subtitle
- Bottom metadata bar: 3-column grid with border-top (4px cyan)

### CTA Section (full width)
- Bold yellow background (#b58900)
- Large uppercase heading
- Button with offset hover effect:
  ```css
  transform: translate(4px, 4px);
  box-shadow: -8px -8px 0 #073642;
  ```

### Services (2-column split)
- Primary: grid-column 1/8, 8px green left border, "PRIMARY" label
- Secondary: grid-column 8/-1, 4px blue left border

### Stats (3-column grid)
- Equal width items
- Large numbers (64px Work Sans 800)
- Monospace uppercase labels

## Component Patterns

**Buttons:**
- Heavy borders (3-4px)
- Uppercase JetBrains Mono
- Offset shadow on hover
- High contrast (dark on light, light on dark)

**Service Cards:**
- Left border accent (colored, bold)
- Positioned labels (absolute "PRIMARY")
- Underline links that change color on hover

**Grid Usage:**
- Visible 2px gaps create visual rhythm
- Content inset from grid edges
- Full-width sections alternate with split columns

## Key Features

1. **Maximum Contrast**: Dark hero vs light page, yellow CTA section
2. **Systematic Grid**: 12-column structure with visible gaps
3. **Bold Typography**: Uppercase, heavy weights, tight spacing
4. **Geometric Precision**: Sharp edges, no border-radius, grid-aligned
5. **Technical Feel**: Monospace labels, structured metadata
6. **Impact Moments**: Yellow CTA, offset button hover, large stats

## Implementation Notes

- Grid gaps act as design element (visible lines)
- All uppercase headings for impact
- Work Sans 800 weight critical for brutalist feel
- Hover effects are sharp/immediate (0.2s transitions)
- No gradients, no shadows except on button hover
- Color blocking for section separation

## Why This Works

- Appeals to technical/developer audience through systematic design
- High memorability through bold contrasts
- Professional but distinctive (not corporate-bland)
- Solarized palette keeps it sophisticated despite brutalism
- Grid system provides flexibility for content expansion

## Reference Screenshot

Located in browser mockup (Variation 2).

## Future Considerations

- Could soften slightly with subtle shadows
- Mobile adaptation needs careful grid reflow
- Yellow CTA section might need A/B testing
- Consider adding more cyan accents for cohesion
