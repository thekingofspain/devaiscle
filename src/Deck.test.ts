import { describe, it, expect } from 'vitest';
import { Deck } from './Deck';
import { createFullDeck } from './types';

describe('Deck', () => {
  it('should create a deck with 52 cards', () => {
    const deck = new Deck();
    expect(deck.remainingCount).toBe(52);
    expect(deck.dealtCount).toBe(0);
  });

  it('should deal one card', () => {
    const deck = new Deck();
    const card = deck.dealOne();
    expect(card).not.toBeNull();
    expect(deck.remainingCount).toBe(51);
    expect(deck.dealtCount).toBe(1);
  });

  it('should deal multiple cards', () => {
    const deck = new Deck();
    const cards = deck.deal(5);
    expect(cards.length).toBe(5);
    expect(deck.remainingCount).toBe(47);
  });

  it('should shuffle the deck', () => {
    const deck1 = new Deck();
    const deck2 = new Deck();
    deck1.shuffle();
    
    // Get remaining cards as strings for comparison
    const cards1 = deck1.getRemainingCards().map(c => `${c.rank}${c.suit}`);
    const cards2 = deck2.getRemainingCards().map(c => `${c.rank}${c.suit}`);
    
    // Probability of same order is extremely low
    expect(JSON.stringify(cards1)).not.toBe(JSON.stringify(cards2));
  });

  it('should reset the deck', () => {
    const deck = new Deck();
    deck.deal(10);
    deck.reset();
    expect(deck.remainingCount).toBe(52);
    expect(deck.dealtCount).toBe(0);
  });

  it('should return null when dealing from empty deck', () => {
    const deck = new Deck();
    deck.deal(52);
    const card = deck.dealOne();
    expect(card).toBeNull();
  });

  it('should sort cards by suit and rank', () => {
    const deck = new Deck();
    deck.shuffle();
    deck.deal(26); // Deal half to mix things up
    deck.reset();
    deck.sort();
    
    const cards = deck.getRemainingCards();
    const suitOrder = ['hearts', 'diamonds', 'clubs', 'spades'];
    const rankOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
    
    // Check that cards are sorted
    for (let i = 1; i < cards.length; i++) {
      const prevSuitIdx = suitOrder.indexOf(cards[i - 1].suit);
      const currSuitIdx = suitOrder.indexOf(cards[i].suit);
      
      if (prevSuitIdx === currSuitIdx) {
        const prevRankIdx = rankOrder.indexOf(cards[i - 1].rank);
        const currRankIdx = rankOrder.indexOf(cards[i].rank);
        expect(prevRankIdx).toBeLessThanOrEqual(currRankIdx);
      } else {
        expect(prevSuitIdx).toBeLessThan(currSuitIdx);
      }
    }
  });

  it('should find a specific card', () => {
    const deck = new Deck();
    const card = deck.findCard('spades', 'A');
    expect(card).toBeDefined();
    expect(card!.suit).toBe('spades');
    expect(card!.rank).toBe('A');
  });

  it('should remove a specific card', () => {
    const deck = new Deck();
    const removed = deck.removeCard('spades', 'A');
    expect(removed).toBe(true);
    expect(deck.remainingCount).toBe(51);
    expect(deck.findCard('spades', 'A')).toBeUndefined();
  });

  it('should create multiple decks', () => {
    const deck = Deck.createMultipleDecks(2);
    expect(deck.remainingCount).toBe(104);
  });

  it('should check if deck is empty', () => {
    const deck = new Deck();
    expect(deck.isEmpty()).toBe(false);
    deck.deal(52);
    expect(deck.isEmpty()).toBe(true);
  });
});
