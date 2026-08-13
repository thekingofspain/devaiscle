// Demo application for Playing Cards Deck
import { 
  CardFactory, 
  DeckManager, 
  CardRenderer,
  Suit,
  Rank
} from '../src/index';

class PlayingCardsDemo {
  private deckManager: DeckManager;
  private currentDeckId: string = 'demo-deck-1';
  private hand: HTMLElement;
  private fullDeck: HTMLElement;
  private isGridView: boolean = true;

  constructor() {
    this.deckManager = new DeckManager();
    this.hand = document.getElementById('hand-container')!;
    this.fullDeck = document.getElementById('full-deck-container')!;
    
    // Initialize with a deck
    this.createAndRenderDeck();
  }

  createAndRenderDeck(): void {
    // Create a new deck
    const deck = this.deckManager.createDeck({
      id: this.currentDeckId,
      style: 'classic',
      includeJokers: false
    });

    console.log(`Created deck with ${deck.cards.length} cards`);
    
    // Render the full deck
    this.renderFullDeck();
    this.updateStats();
  }

  shuffleDeck(): void {
    const shuffled = this.deckManager.shuffleDeck(this.currentDeckId);
    if (shuffled) {
      console.log('Deck shuffled!');
      this.renderFullDeck();
      
      // Add shuffle animation to cards
      const cards = document.querySelectorAll('.playing-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('shuffle-animation');
          setTimeout(() => card.classList.remove('shuffle-animation'), 300);
        }, index * 10);
      });
    }
  }

  dealHand(): void {
    const result = this.deckManager.dealCards(this.currentDeckId, 5);
    if (result) {
      console.log(`Dealt ${result.dealt.length} cards`);
      
      // Clear hand container
      this.hand.innerHTML = '';
      
      // Render as a fanned hand
      CardRenderer.renderAsHand(
        this.hand,
        result.dealt,
        'classic',
        {
          width: 100,
          height: 143,
          overlap: 40,
          rotationArc: 25
        }
      );
      
      // Add deal animation
      const cards = this.hand.querySelectorAll('.playing-card');
      cards.forEach((card, index) => {
        card.classList.add('deal-animation');
        setTimeout(() => card.classList.remove('deal-animation'), 400 + (index * 100));
      });
      
      this.renderFullDeck();
      this.updateStats();
    }
  }

  resetDeck(): void {
    this.deckManager.resetDeck(this.currentDeckId);
    this.hand.innerHTML = '';
    this.renderFullDeck();
    this.updateStats();
    console.log('Deck reset!');
  }

  toggleView(): void {
    this.isGridView = !this.isGridView;
    this.renderFullDeck();
  }

  private renderFullDeck(): void {
    const deck = this.deckManager.getDeck(this.currentDeckId);
    if (!deck) return;

    this.fullDeck.innerHTML = '';

    if (this.isGridView) {
      // Render as grid
      CardRenderer.renderAsGrid(
        this.fullDeck,
        deck.cards,
        'classic',
        {
          columns: 13,
          gap: 8,
          size: 'sm'
        }
      );
    } else {
      // Render as flex wrap
      const elements = CardRenderer.createCardElements(deck.cards, 'classic', {
        size: 'sm'
      });
      elements.forEach(el => this.fullDeck.appendChild(el));
    }
  }

  private updateStats(): void {
    const deck = this.deckManager.getDeck(this.currentDeckId);
    if (!deck) return;

    const totalCardsElement = document.getElementById('total-cards');
    const cardsInDeckElement = document.getElementById('cards-in-deck');
    const cardsInHandElement = document.getElementById('cards-in-hand');
    const deckStyleElement = document.getElementById('deck-style');

    if (totalCardsElement) totalCardsElement.textContent = '52';
    if (cardsInDeckElement) cardsInDeckElement.textContent = deck.cards.length.toString();
    
    // Calculate cards in hand (total - remaining in deck)
    const cardsInHand = 52 - deck.cards.length;
    if (cardsInHandElement) cardsInHandElement.textContent = cardsInHand.toString();
    if (deckStyleElement) deckStyleElement.textContent = deck.style;
  }
}

// Initialize demo when DOM is ready
let demo: PlayingCardsDemo;

document.addEventListener('DOMContentLoaded', () => {
  demo = new PlayingCardsDemo();
  console.log('Playing Cards Demo initialized!');
});

// Export for global access
(window as any).demo = demo;
