import { CardColor, CardType } from '../../src/types.js';

export function createDeck() {
  const deck = [];
  const colors = [CardColor.RED, CardColor.BLUE, CardColor.GREEN, CardColor.YELLOW];

  // Add number cards (0-9)
  colors.forEach(color => {
    // One zero per color
    deck.push({ color, type: CardType.NUMBER, value: 0 });
    
    // Two of each 1-9
    for (let i = 1; i <= 9; i++) {
      deck.push({ color, type: CardType.NUMBER, value: i });
      deck.push({ color, type: CardType.NUMBER, value: i });
    }

    // Action cards (two of each per color)
    [CardType.SKIP, CardType.REVERSE, CardType.DRAW_TWO].forEach(type => {
      deck.push({ color, type });
      deck.push({ color, type });
    });
  });

  // Wild cards (4 of each)
  for (let i = 0; i < 4; i++) {
    deck.push({ type: CardType.WILD });
    deck.push({ type: CardType.WILD_DRAW_FOUR });
  }

  return deck;
}

export function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}