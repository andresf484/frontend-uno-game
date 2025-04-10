import { CardColor, CardType } from '../../src/types.js';
import { createDeck, shuffleDeck } from './deck.js';

export class GameManager {
  constructor() {
    this.deck = [];
    this.discardPile = [];
    this.players = new Map();
    this.currentPlayerIndex = 0;
    this.direction = 1;
    this.currentColor = CardColor.RED;
    this.winner = null;
  }

  startGame(players) {
    this.deck = shuffleDeck(createDeck());
    this.players.clear();
    this.winner = null;
    players.forEach(player => {
      this.players.set(player.id, {
        ...player,
        hand: this.drawCards(7)
      });
    });

    let topCard = this.drawCards(1)[0];
    while (topCard.type === CardType.WILD_DRAW_FOUR) {
      this.deck.unshift(topCard);
      this.deck = shuffleDeck(this.deck);
      topCard = this.drawCards(1)[0];
    }

    this.discardPile = [topCard];
    this.currentColor = topCard.color;
    this.currentPlayerIndex = Math.floor(Math.random() * players.length);
    this.direction = 1;
  }

  playCard(playerId, card) {
    const player = this.players.get(playerId);
    const currentPlayer = this.getCurrentPlayer();
    const topCard = this.getTopCard();

    if (!player || player.id !== currentPlayer.id) return false;

    // For wild cards, ensure a color was selected
    if ((card.type === CardType.WILD || card.type === CardType.WILD_DRAW_FOUR) && !card.color) {
      return false;
    }

    const isValidPlay = this.isValidPlay(card, topCard);
    if (!isValidPlay) return false;

    // Remove the card from player's hand
    const cardIndex = player.hand.findIndex(c => 
      c.type === card.type && 
      (card.type === CardType.WILD || card.type === CardType.WILD_DRAW_FOUR || c.color === card.color) && 
      (card.type !== CardType.NUMBER || c.value === card.value)
    );
    
    if (cardIndex === -1) return false;
    
    player.hand.splice(cardIndex, 1);
    this.discardPile.push(card);

    // Check if player has won
    if (player.hand.length === 0) {
      this.winner = player;
      return true;
    }

    // Update current color
    this.currentColor = card.color;

    // Handle special cards
    this.handleSpecialCard(card);

    // Move to next player
    this.moveToNextPlayer();

    return true;
  }

  drawCardForPlayer(playerId) {
    const player = this.players.get(playerId);
    const currentPlayer = this.getCurrentPlayer();

    if (!player || player.id !== currentPlayer.id) return false;

    const drawnCards = this.drawCards(1);
    player.hand.push(...drawnCards);
    
    // Move to next player after drawing
    this.moveToNextPlayer();
    
    return true;
  }

  isValidPlay(card, topCard) {
    // Wild cards can always be played
    if (card.type === CardType.WILD || card.type === CardType.WILD_DRAW_FOUR) {
      return true;
    }

    // Same color is valid
    if (card.color === this.currentColor) {
      return true;
    }

    // Same number is valid (regardless of color)
    if (card.type === CardType.NUMBER && topCard.type === CardType.NUMBER && card.value === topCard.value) {
      return true;
    }

    // Same action type is valid (Skip, Reverse, Draw Two) if same color
    if (card.type === topCard.type && card.type !== CardType.NUMBER && card.color === this.currentColor) {
      return true;
    }

    return false;
  }

  handleSpecialCard(card) {
    switch (card.type) {
      case CardType.SKIP:
        this.moveToNextPlayer();
        break;
      case CardType.REVERSE:
        this.direction *= -1;
        if (this.players.size === 2) {
          this.moveToNextPlayer(); // In 2-player game, reverse acts like skip
        }
        break;
      case CardType.DRAW_TWO:
        const nextPlayer = this.getNextPlayer();
        nextPlayer.hand.push(...this.drawCards(2));
        this.moveToNextPlayer();
        break;
      case CardType.WILD_DRAW_FOUR:
        const nextPlayerForWild = this.getNextPlayer();
        nextPlayerForWild.hand.push(...this.drawCards(4));
        this.moveToNextPlayer();
        break;
    }
  }

  drawCards(count) {
    const cards = this.deck.splice(0, count);
    if (this.deck.length === 0 && this.discardPile.length > 1) {
      const topCard = this.discardPile.pop();
      this.deck = shuffleDeck(this.discardPile);
      this.discardPile = [topCard];
    }
    return cards;
  }

  moveToNextPlayer() {
    const playerCount = Array.from(this.players.values()).length;
    this.currentPlayerIndex = (this.currentPlayerIndex + this.direction + playerCount) % playerCount;
  }

  getNextPlayer() {
    const players = Array.from(this.players.values());
    const nextIndex = (this.currentPlayerIndex + this.direction + players.length) % players.length;
    return players[nextIndex];
  }

  getGameState() {
    return {
      players: Array.from(this.players.values()),
      currentPlayer: this.getCurrentPlayer(),
      topCard: this.getTopCard(),
      currentColor: this.currentColor,
      direction: this.direction,
      deckCount: this.deck.length,
      winner: this.winner
    };
  }

  getCurrentPlayer() {
    return Array.from(this.players.values())[this.currentPlayerIndex];
  }

  getTopCard() {
    return this.discardPile[this.discardPile.length - 1];
  }

  resetGame() {
    const players = Array.from(this.players.values());
    this.startGame(players);
    return this.getGameState();
  }
}