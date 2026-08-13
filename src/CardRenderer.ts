/**
 * CardRenderer - Renders playing cards as DOM elements with SVG backgrounds
 * 
 * Cards are rendered using CSS classes that match the SVG filename.
 * Format: .c[FileName] e.g., .c7S for 7S.svg, .cAH for AH.svg
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
   * Generate CSS class name for a card based on its SVG filename
   * Format: c[FileName] e.g., c7S for 7S.svg
   */
  getCardClass(card: Card): string {
    return `c${card.svgFile.replace('.svg', '')}`;
  }

  /**
   * Generate CSS class for card back
   */
  getCardBackClass(): string {
    return `c${getBackSvgFileName().replace('.svg', '')}`;
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
    
    // Background image is applied via CSS class matching filename
    
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
    
    // Background image is applied via CSS class matching filename
    
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
    const suits = ['S', 'H', 'D', 'C'] as const;
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

/* Card face backgrounds by filename class */
`;

    // Generate class-based background URLs matching SVG filenames
    for (const suit of suits) {
      for (const rank of ranks) {
        const fileName = `${rank}${suit}.svg`;
        const className = `c${rank}${suit}`;
        css += `
.${className} {
  background-image: url('${this.svgPath}/${fileName}');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}
`;
      }
    }

    // Jokers and backs
    css += `
.c1J { background-image: url('${this.svgPath}/1J.svg'); background-size: 100% 100%; background-repeat: no-repeat; background-position: center; }
.c2J { background-image: url('${this.svgPath}/2J.svg'); background-size: 100% 100%; background-repeat: no-repeat; background-position: center; }
.c1B { background-image: url('${this.svgPath}/1B.svg'); background-size: 100% 100%; background-repeat: no-repeat; background-position: center; }
.c2B { background-image: url('${this.svgPath}/2B.svg'); background-size: 100% 100%; background-repeat: no-repeat; background-position: center; }
`;

    return css;
  }
}
