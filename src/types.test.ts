import { describe, it, expect } from 'vitest';
import { createCard, createFullDeck, SUITS, RANK_ORDER, SUIT_COLOR_MAP, getSvgFileName } from './types';

describe('Types', () => {
  it('should create a card with correct properties', () => {
    const card = createCard('A', 'spades');
    expect(card.rank).toBe('A');
    expect(card.suit).toBe('spades');
    expect(card.color).toBe('black');
    expect(card.svgFile).toBe('AS.svg');
  });

  it('should create hearts card with red color', () => {
    const card = createCard('K', 'hearts');
    expect(card.color).toBe('red');
    expect(card.svgFile).toBe('KH.svg');
  });

  it('should create diamonds card with blue color', () => {
    const card = createCard('Q', 'diamonds');
    expect(card.color).toBe('blue');
    expect(card.svgFile).toBe('QD.svg');
  });

  it('should create clubs card with green color', () => {
    const card = createCard('J', 'clubs');
    expect(card.color).toBe('green');
    expect(card.svgFile).toBe('JC.svg');
  });

  it('should create full deck with 52 cards', () => {
    const deck = createFullDeck();
    expect(deck.length).toBe(52);
  });

  it('should have all suits in full deck', () => {
    const deck = createFullDeck();
    const suits = new Set(deck.map(c => c.suit));
    expect(suits.size).toBe(4);
    SUITS.forEach(suit => expect(suits.has(suit)).toBe(true));
  });

  it('should have all ranks in full deck', () => {
    const deck = createFullDeck();
    const ranks = new Set(deck.map(c => c.rank));
    expect(ranks.size).toBe(13);
    RANK_ORDER.forEach(rank => expect(ranks.has(rank)).toBe(true));
  });

  it('should generate correct SVG file names', () => {
    expect(getSvgFileName('A', 'spades')).toBe('AS.svg');
    expect(getSvgFileName('T', 'hearts')).toBe('TH.svg');
    expect(getSvgFileName('9', 'diamonds')).toBe('9D.svg');
    expect(getSvgFileName('2', 'clubs')).toBe('2C.svg');
  });
});
