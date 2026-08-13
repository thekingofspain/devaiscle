/**
 * Deck - Manages a deck of playing cards with shuffling and dealing
 */

import type { Card, Rank, Suit } from './types';
import { createFullDeck, createCard } from './types';

export class Deck {
  private cards: Card[];
  private dealtCards: Card[];

  constructor(customCards?: Card[]) {
    this.cards = customCards || createFullDeck();
    this.dealtCards = [];
  }

  /**
   * Get the number of remaining cards in the deck
   */
  get remainingCount(): number {
    return this.cards.length;
  }

  /**
   * Get the number of dealt cards
   */
  get dealtCount(): number {
    return this.dealtCards.length;
  }

  /**
   * Shuffle the deck using Fisher-Yates algorithm
   */
  shuffle(): Deck {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
    return this;
  }

  /**
   * Deal a single card from the top of the deck
   */
  dealOne(): Card | null {
    if (this.cards.length === 0) {
      return null;
    }
    const card = this.cards.pop()!;
    this.dealtCards.push(card);
    return card;
  }

  /**
   * Deal multiple cards from the top of the deck
   */
  deal(count: number): Card[] {
    const dealt: Card[] = [];
    for (let i = 0; i < count && this.cards.length > 0; i++) {
      const card = this.dealOne();
      if (card) {
        dealt.push(card);
      }
    }
    return dealt;
  }

  /**
   * Reset the deck by returning all dealt cards and shuffling
   */
  reset(): Deck {
    this.cards = [...this.cards, ...this.dealtCards];
    this.dealtCards = [];
    return this;
  }

  /**
   * Get all remaining cards (without removing them)
   */
  getRemainingCards(): Card[] {
    return [...this.cards];
  }

  /**
   * Get all dealt cards
   */
  getDealtCards(): Card[] {
    return [...this.dealtCards];
  }

  /**
   * Create a new deck with specific cards (e.g., for multiple decks)
   */
  static createCustom(cards: Card[]): Deck {
    return new Deck(cards);
  }

  /**
   * Create multiple combined decks
   */
  static createMultipleDecks(count: number): Deck {
    const allCards: Card[] = [];
    for (let i = 0; i < count; i++) {
      allCards.push(...createFullDeck());
    }
    return new Deck(allCards);
  }

  /**
   * Sort the remaining cards by suit and rank
   */
  sort(): Deck {
    const suitOrder = ['hearts', 'diamonds', 'clubs', 'spades'];
    const rankOrder = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

    this.cards.sort((a, b) => {
      const suitDiff = suitOrder.indexOf(a.suit) - suitOrder.indexOf(b.suit);
      if (suitDiff !== 0) return suitDiff;
      return rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
    });

    return this;
  }

  /**
   * Check if the deck is empty
   */
  isEmpty(): boolean {
    return this.cards.length === 0;
  }

  /**
   * Get a specific card by suit and rank from remaining cards
   */
  findCard(suit: Suit, rank: Rank): Card | undefined {
    return this.cards.find(card => card.suit === suit && card.rank === rank);
  }

  /**
   * Remove a specific card from the deck
   */
  removeCard(suit: Suit, rank: Rank): boolean {
    const index = this.cards.findIndex(card => card.suit === suit && card.rank === rank);
    if (index !== -1) {
      this.cards.splice(index, 1);
      return true;
    }
    return false;
  }
}
