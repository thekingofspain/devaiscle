/**
 * Playing Cards Library
 * 
 * A TypeScript library for working with playing cards using SVG backgrounds.
 * Uses the 4-color deck from https://www.me.uk/cards/ with:
 * - Large Ace of Spades
 * - No text on cards
 * - Four colors: Hearts (Red), Diamonds (Blue), Clubs (Green), Spades (Black)
 */

export {
  type Card,
  type Suit,
  type Rank,
  type CardColor,
  SUIT_COLOR_MAP,
  RANK_ORDER,
  SUITS,
  getSvgFileName,
  getBackSvgFileName,
  createCard,
  createFullDeck,
} from './types';

export { Deck } from './Deck';
export { CardRenderer } from './CardRenderer';
