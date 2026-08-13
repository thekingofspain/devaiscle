# Playing Cards Deck Project - Implementation Plan

## Project Overview
Create a TypeScript project that renders a deck of playing cards using:
- SVG backgrounds for card faces
- 4 color suits (hearts, diamonds, clubs, spades)
- CSS class-based card specification
- Unique fronts for different decks
- Open source SVG assets (no custom SVG creation)

---

## Phase 1: Research & Planning - COMPLETED ✓

### Step 1.1: Research Open Source SVG Card Assets - VALIDATED

**Selected Asset: svg-cards (v4.0.2)**
- **License:** LGPL-2.1 (permissive for our use case)
- **Repository:** https://github.com/htdebeer/SVG-cards
- **npm:** https://www.npmjs.com/package/svg-cards
- **Description:** Complete set of playing cards in SVG format
- **Contents:** 
  - All 52 standard cards (hearts, diamonds, clubs, spades × A-K)
  - 2 jokers (red and black)
  - Multiple card back designs (16 colors)
  - French-style court cards (Kings, Queens, Jacks)
- **Format:** Single SVG sprite file with named symbols
- **Installation:** `npm install svg-cards`

**Alternative Assets Researched:**
1. `@letele/playing-cards` (CC0-1.0) - React-focused, less suitable
2. `cardsJS` (MIT) - Requires jQuery/Knockout dependencies
3. `@younestouati/playing-cards-standard-deck` (LGPL-3.0) - Base64 encoded

**Decision:** Use `svg-cards` as primary asset source - most complete, well-maintained, permissive license

### Step 1.2: Card Data Structure - DEFINED

```typescript
enum Suit {
  HEARTS = 'hearts',
  DIAMONDS = 'diamonds',
  CLUBS = 'clubs',
  SPADES = 'spades'
}

enum Rank {
  ACE = 'A',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K'
}

interface Card {
  suit: Suit;
  rank: Rank;
  value: number; // For sorting/comparison
  id: string; // Unique identifier
  deckId: string; // Which deck this card belongs to
}

interface Deck {
  id: string;
  style: DeckStyle;
  cards: Card[];
}

type DeckStyle = 'classic' | 'modern' | 'minimal';
```

### Step 1.3: CSS Architecture - DEFINED

**Class Naming Convention:**
- Base: `.playing-card`
- Suit: `.suit-hearts`, `.suit-diamonds`, `.suit-clubs`, `.suit-spades`
- Rank: `.rank-A`, `.rank-2` through `.rank-K`
- Combined: `.card-hearts-A`, `.card-spades-K`
- Deck Style: `.deck-classic`, `.deck-modern`
- Size: `.card-sm`, `.card-md`, `.card-lg`

**Background Structure:**
```css
.playing-card {
  background-image: url('assets/cards/{deck-style}/sprite.svg#{suit}_{rank}');
  background-size: contain;
  background-repeat: no-repeat;
}
```

**Suit Colors:**
- Hearts: `#E42129` (red)
- Diamonds: `#E42129` (red)  
- Clubs: `#2B2B2B` (black)
- Spades: `#2B2B2B` (black)

---

## Phase 2: Project Setup

### Step 2.1: Initialize TypeScript Project
**Tasks:**
- Create project directory structure
- Initialize npm/Node.js project
- Configure TypeScript (tsconfig.json)
- Set up build tooling (webpack/vite/parcel)
- Install dependencies:
  - typescript
  - CopyWebpackPlugin or similar for assets
  - Development server

**Deliverable:** Working TypeScript project skeleton

### Step 2.2: Acquire SVG Assets
**Tasks:**
- Download selected open source SVG card set
- Organize assets in `/assets/cards/` directory
- Create deck variations (different visual styles)
- Document asset sources and licenses

**Deliverable:** Asset folder with organized SVGs

### Step 2.3: Create Base CSS
**Tasks:**
- Create main stylesheet
- Implement card base classes
- Add suit-specific color classes
- Create responsive modifiers

**Deliverable:** Functional CSS file with card styling

---

## Phase 3: Core Implementation

### Step 3.1: Implement TypeScript Types
**Tasks:**
- Create `types.ts` with all interfaces
- Define Suit enum
- Define Rank enum
- Create Card interface
- Create Deck interface
- Add deck configuration types

**Deliverable:** Complete type definitions

### Step 3.2: Implement Card Factory
**Tasks:**
- Create `CardFactory` class
- Implement card generation logic
- Add suit/rank validation
- Create CSS class generator method
- Implement SVG path resolver

**Deliverable:** CardFactory class with full functionality

### Step 3.3: Implement Deck Manager
**Tasks:**
- Create `DeckManager` class
- Implement deck creation (standard 52 cards)
- Add shuffling algorithm (Fisher-Yates)
- Implement dealing functionality
- Support multiple unique decks

**Deliverable:** DeckManager with shuffle/deal capabilities

### Step 3.4: Implement Card Renderer
**Tasks:**
- Create `CardRenderer` class
- Generate DOM elements with proper classes
- Apply background SVGs
- Handle deck-specific styling
- Implement lazy loading if needed

**Deliverable:** CardRenderer that creates visual cards

---

## Phase 4: Advanced Features

### Step 4.1: Multiple Deck Support
**Tasks:**
- Create deck themes/styles system
- Implement deck switching
- Add deck metadata tracking
- Ensure card uniqueness across decks

**Deliverable:** Multi-deck capability

### Step 4.2: Card Animations (Optional Enhancement)
**Tasks:**
- Add CSS transitions
- Implement flip animation classes
- Create deal animation support
- Add hover effects

**Deliverable:** Animated card interactions

### Step 4.3: Utility Functions
**Tasks:**
- Card comparison utilities
- Hand evaluation helpers
- Export/import deck state
- Serialization methods

**Deliverable:** Utility module

---

## Phase 5: Testing & Documentation

### Step 5.1: Unit Tests
**Tasks:**
- Test card generation
- Test shuffling algorithm
- Test CSS class generation
- Test deck operations

**Deliverable:** Test suite with >80% coverage

### Step 5.2: Integration Tests
**Tasks:**
- Test full deck creation
- Test rendering pipeline
- Test multi-deck scenarios

**Deliverable:** Integration test suite

### Step 5.3: Documentation
**Tasks:**
- README with setup instructions
- API documentation
- Usage examples
- Asset attribution

**Deliverable:** Complete documentation

---

## File Structure
```
/workspace
├── src/
│   ├── types.ts           # TypeScript interfaces
│   ├── CardFactory.ts     # Card creation logic
│   ├── DeckManager.ts     # Deck operations
│   ├── CardRenderer.ts    # DOM rendering
│   ├── utils.ts           # Helper functions
│   └── index.ts           # Main entry point
├── assets/
│   └── cards/
│       ├── deck1/         # First deck style
│       │   ├── hearts.svg
│       │   ├── diamonds.svg
│       │   ├── clubs.svg
│       │   └── spades.svg
│       └── deck2/         # Second deck style
│           └── ...
├── styles/
│   └── cards.css          # Card styling
├── tests/
│   ├── CardFactory.test.ts
│   ├── DeckManager.test.ts
│   └── CardRenderer.test.ts
├── public/
│   └── index.html         # Demo page
├── package.json
├── tsconfig.json
├── webpack.config.js (or vite.config.ts)
└── README.md
```

---

## Success Criteria
- [ ] All 52 cards renderable via CSS classes
- [ ] 4 distinct suit colors
- [ ] At least 2 unique deck styles
- [ ] No custom SVGs created (all open source)
- [ ] Full TypeScript typing
- [ ] Shuffle and deal functionality
- [ ] Passing test suite
- [ ] Complete documentation

---

## Timeline Estimate
- Phase 1: 1-2 hours (research)
- Phase 2: 1 hour (setup)
- Phase 3: 2-3 hours (core implementation)
- Phase 4: 1-2 hours (advanced features)
- Phase 5: 1-2 hours (testing & docs)
- **Total: 6-10 hours**

---

## Risks & Mitigations
1. **Risk:** Cannot find suitable open source SVGs
   **Mitigation:** Have backup options ready; consider simple geometric representations

2. **Risk:** License restrictions on assets
   **Mitigation:** Verify licenses before use; prefer permissive licenses

3. **Risk:** Browser compatibility with CSS backgrounds
   **Mitigation:** Test across browsers; provide fallbacks

---

*Plan created for validation by subagent review*
