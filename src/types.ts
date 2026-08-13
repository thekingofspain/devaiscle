/**
 * Playing Card Types
 * 
 * Four-color deck specification:
 * - Hearts: Red
 * - Diamonds: Blue  
 * - Clubs: Green
 * - Spades: Black
 */

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K';
export type CardColor = 'red' | 'blue' | 'green' | 'black';

export interface Card {
  suit: Suit;
  rank: Rank;
  color: CardColor;
  svgFile: string;
}

// Four-color mapping: Hearts=Red, Diamonds=Blue, Clubs=Green, Spades=Black
export const SUIT_COLOR_MAP: Record<Suit, CardColor> = {
  hearts: 'red',
  diamonds: 'blue',
  clubs: 'green',
  spades: 'black',
};

export const RANK_ORDER: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

// File naming convention from the downloaded SVGs:
// A=Ace, T=10, J=Jack, Q=Queen, K=King
// S=Spades, H=Hearts, D=Diamonds, C=Clubs
// B=Back, J=Joker
export function getSvgFileName(rank: Rank, suit: Suit): string {
  const rankMap: Record<Rank, string> = {
    'A': 'A',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    'T': 'T',
    'J': 'J',
    'Q': 'Q',
    'K': 'K',
  };

  const suitMap: Record<Suit, string> = {
    spades: 'S',
    hearts: 'H',
    diamonds: 'D',
    clubs: 'C',
  };

  return `${rankMap[rank]}${suitMap[suit]}.svg`;
}

export function getBackSvgFileName(): string {
  return '1B.svg';
}

export function createCard(rank: Rank, suit: Suit): Card {
  return {
    suit,
    rank,
    color: SUIT_COLOR_MAP[suit],
    svgFile: getSvgFileName(rank, suit),
  };
}

export function createFullDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANK_ORDER) {
      deck.push(createCard(rank, suit));
    }
  }
  return deck;
}
