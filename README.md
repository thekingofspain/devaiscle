# Playing Cards TypeScript Library

A complete TypeScript library for working with playing cards using **4-color SVG backgrounds** downloaded from [me.uk/cards](https://www.me.uk/cards/makeadeck.cgi).

## Features

- **4-Color Deck**: Hearts (Red), Diamonds (Blue), Clubs (Green), Spades (Black)
- **Large Ace of Spades**: As specified in the deck configuration
- **No Text on Cards**: Clean, minimalist design
- **SVG Backgrounds**: Cards rendered as CSS background images
- **CSS Class System**: Each card has a unique CSS class
- **Full Deck Management**: Shuffle, deal, sort, and manage cards
- **TypeScript Support**: Full type definitions included

## Installation

```bash
npm install
npm run build
```

## Usage

### Import the Library

```typescript
import { 
  createCard, 
  createFullDeck, 
  Deck, 
  CardRenderer,
  SUIT_COLOR_MAP 
} from './dist/index.js';
```

### Create Cards

```typescript
// Create a single card
const aceOfSpades = createCard('A', 'spades');
console.log(aceOfSpades); 
// { suit: 'spades', rank: 'A', color: 'black', svgFile: 'AS.svg' }

// Create full deck
const deck = createFullDeck();
console.log(deck.length); // 52
```

### Four-Color Mapping

```typescript
import { SUIT_COLOR_MAP } from './dist/index.js';

console.log(SUIT_COLOR_MAP.hearts);   // 'red'
console.log(SUIT_COLOR_MAP.diamonds); // 'blue'
console.log(SUIT_COLOR_MAP.clubs);    // 'green'
console.log(SUIT_COLOR_MAP.spades);   // 'black'
```

### Deck Management

```typescript
import { Deck } from './dist/index.js';

// Create and shuffle a deck
const deck = new Deck();
deck.shuffle();

// Deal cards
const hand = deck.deal(5);
console.log(`Dealt ${hand.length} cards`);

// Reset deck
deck.reset();

// Sort deck
deck.sort();
```

### Render Cards to DOM

```typescript
import { CardRenderer, createCard } from './dist/index.js';

const renderer = new CardRenderer('./svgs');

// Create card element
const card = createCard('K', 'hearts');
const element = renderer.createCardElement(card, { size: 'large' });

// Add to DOM
document.getElementById('card-container')?.appendChild(element);
```

### CSS Classes

Each card gets a unique CSS class:

```css
/* Card classes follow pattern: card-{suit}-{rank} */
.card-hearts-A      /* Ace of Hearts */
.card-diamonds-K    /* King of Diamonds */
.card-clubs-7       /* 7 of Clubs */
.card-spades-Q      /* Queen of Spades */

/* Size classes */
.card-size-small    /* 50x70px */
.card-size-medium   /* 100x140px */
.card-size-large    /* 150x210px */

/* Card back */
.card-back
```

## File Structure

```
/workspace
├── svgs/                 # Downloaded SVG files (56 files)
│   ├── AS.svg           # Ace of Spades (large, no text)
│   ├── KH.svg           # King of Hearts
│   ├── QD.svg           # Queen of Diamonds
│   ├── JC.svg           # Jack of Clubs
│   └── ...              # All 52 cards + backs + jokers
├── src/
│   ├── types.ts         # Type definitions and utilities
│   ├── Deck.ts          # Deck management class
│   ├── CardRenderer.ts  # DOM rendering class
│   ├── styles.css       # CSS styles for cards
│   └── index.ts         # Main exports
├── dist/                # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## SVG Files

The SVG files were downloaded from [me.uk/cards](https://www.me.uk/cards/makeadeck.cgi) with these settings:
- **Size**: Poker
- **Ace**: Large
- **Four Color**: Enabled
- **Text**: None
- **Back Design**: Diamond

### File Naming Convention

- `A` = Ace, `T` = 10, `J` = Jack, `Q` = Queen, `K` = King
- `S` = Spades, `H` = Hearts, `D` = Diamonds, `C` = Clubs
- `B` = Back, `J` = Joker

Examples:
- `AS.svg` - Ace of Spades
- `TH.svg` - 10 of Hearts
- `1B.svg` - Card Back

## API Reference

### Types

```typescript
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K';
type CardColor = 'red' | 'blue' | 'green' | 'black';

interface Card {
  suit: Suit;
  rank: Rank;
  color: CardColor;
  svgFile: string;
}
```

### Deck Class

```typescript
class Deck {
  constructor(customCards?: Card[]);
  shuffle(): Deck;
  dealOne(): Card | null;
  deal(count: number): Card[];
  reset(): Deck;
  sort(): Deck;
  getRemainingCards(): Card[];
  getDealtCards(): Card[];
  isEmpty(): boolean;
  findCard(suit: Suit, rank: Rank): Card | undefined;
  removeCard(suit: Suit, rank: Rank): boolean;
  
  static createMultipleDecks(count: number): Deck;
  static createCustom(cards: Card[]): Deck;
}
```

### CardRenderer Class

```typescript
class CardRenderer {
  constructor(svgPath?: string);
  createCardElement(card: Card, options?: RenderOptions): HTMLElement;
  createCardBackElement(options?: RenderOptions): HTMLElement;
  renderCard(card: Card, container: HTMLElement): HTMLElement;
  renderCards(cards: Card[], container: HTMLElement): HTMLElement[];
  generateStyles(): string;
}
```

## Testing

```bash
npm test
```

## License

ISC

## Credits

SVG cards generated using [me.uk/cards](https://www.me.uk/cards/makeadeck.cgi)
