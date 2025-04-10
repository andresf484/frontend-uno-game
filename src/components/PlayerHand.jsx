import React, { useState } from 'react';
import { Card } from './Card';
import { ColorPicker } from './ColorPicker';
import { socket } from '../services/socket';
import { CardType } from '../types';

export function PlayerHand({ cards, canPlay, currentColor }) {
  const [selectedWildCard, setSelectedWildCard] = useState(null);

  const isPlayable = (card) => {
    if (!canPlay) return false;
    if (card.type === CardType.WILD || card.type === CardType.WILD_DRAW_FOUR) return true;
    return card.color === currentColor || card.type === 'number';
  };

  const handleCardPlay = (card) => {
    if (!isPlayable(card)) return;

    if (card.type === CardType.WILD || card.type === CardType.WILD_DRAW_FOUR) {
      setSelectedWildCard(card);
    } else {
      socket.emit('playCard', card);
    }
  };

  const handleColorSelect = (color) => {
    if (selectedWildCard) {
      socket.emit('playCard', { ...selectedWildCard, color });
      setSelectedWildCard(null);
    }
  };

  return (
    <>
      <div className="flex justify-center items-end space-x-2">
        {cards.map((card, index) => (
          <div key={index} className="-ml-8 first:ml-0 hover:z-10">
            <Card
              card={card}
              disabled={!isPlayable(card)}
              onClick={() => handleCardPlay(card)}
            />
          </div>
        ))}
      </div>

      {selectedWildCard && (
        <ColorPicker
          onColorSelect={handleColorSelect}
          onClose={() => setSelectedWildCard(null)}
        />
      )}
    </>
  );
}