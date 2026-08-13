/**
 * CardRenderer - Renders playing cards as DOM elements with SVG backgrounds
 * 
 * Cards are rendered using CSS classes that apply SVG backgrounds.
 * Each card gets a unique class based on its suit and rank.
 */

import type { Card } from './types';
import { getBackSvgFileName } from './types';

export interface RenderOptions {
  container?: HTMLElement;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export class CardRenderer {
  private svgPath: string;

  constructor(svgPath: string = './svgs') {
    this.svgPath = svgPath;
  }

  /**
   * Generate CSS class name for a card
   */
  getCardClass(card: Card): string {
    return `card-${card.suit}-${card.rank}`;
  }

  /**
   * Generate CSS class for card back
   */
  getCardBackClass(): string {
    return 'card-back';
  }

  /**
   * Get the SVG URL for a card
   */
  getCardSvgUrl(card: Card): string {
    return `url('${this.svgPath}/${card.svgFile}')`;
  }

  /**
   * Get the SVG URL for card back
   */
  getCardBackSvgUrl(): string {
    return `url('${this.svgPath}/${getBackSvgFileName()}')`;
  }

  /**
   * Create a card element
   */
  createCardElement(card: Card, options: RenderOptions = {}): HTMLElement {
    const { size = 'medium', className = '' } = options;
    
    const element = document.createElement('div');
    element.className = `playing-card ${this.getCardClass(card)} card-size-${size} ${className}`.trim();
    element.setAttribute('role', 'img');
    element.setAttribute('aria-label', `${card.rank} of ${card.suit}`);
    element.setAttribute('data-suit', card.suit);
    element.setAttribute('data-rank', card.rank);
    element.setAttribute('data-color', card.color);
    
    // Set background image via inline style for dynamic SVG path
    element.style.backgroundImage = this.getCardSvgUrl(card);
    element.style.backgroundSize = '100% 100%';
    element.style.backgroundRepeat = 'no-repeat';
    element.style.backgroundPosition = 'center';
    
    return element;
  }

  /**
   * Create a card back element
   */
  createCardBackElement(options: RenderOptions = {}): HTMLElement {
    const { size = 'medium', className = '' } = options;
    
    const element = document.createElement('div');
    element.className = `playing-card ${this.getCardBackClass()} card-size-${size} ${className}`.trim();
    element.setAttribute('role', 'img');
    element.setAttribute('aria-label', 'Card back');
    element.setAttribute('data-face', 'back');
    
    element.style.backgroundImage = this.getCardBackSvgUrl();
    element.style.backgroundSize = '100% 100%';
    element.style.backgroundRepeat = 'no-repeat';
    element.style.backgroundPosition = 'center';
    
    return element;
  }

  /**
   * Render a single card to a container
   */
  renderCard(card: Card, container: HTMLElement, options: RenderOptions = {}): HTMLElement {
    const element = this.createCardElement(card, options);
    container.appendChild(element);
    return element;
  }

  /**
   * Render multiple cards to a container
   */
  renderCards(cards: Card[], container: HTMLElement, options: RenderOptions = {}): HTMLElement[] {
    return cards.map(card => this.renderCard(card, container, options));
  }

  /**
   * Generate CSS styles for all cards
   */
  generateStyles(): string {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'] as const;
    
    let css = `
.playing-card {
  display: inline-block;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.playing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

/* Card sizes */
.card-size-small {
  width: 50px;
  height: 70px;
}

.card-size-medium {
  width: 100px;
  height: 140px;
}

.card-size-large {
  width: 150px;
  height: 210px;
}

/* Suit-specific colors (for accessibility fallback) */
`;

    // Generate class-based background URLs
    for (const suit of suits) {
      for (const rank of ranks) {
        const fileName = this.getSvgFileName(rank, suit);
        css += `
.card-${suit}-${rank} {
  /* Background is set via inline style for dynamic path */
}
`;
      }
    }

    css += `
.card-back {
  /* Background is set via inline style for dynamic path */
}
`;

    return css;
  }

  private getSvgFileName(rank: string, suit: string): string {
    const suitMap: Record<string, string> = {
      spades: 'S',
      hearts: 'H',
      diamonds: 'D',
      clubs: 'C',
    };
    return `${rank}${suitMap[suit]}.svg`;
  }
}
