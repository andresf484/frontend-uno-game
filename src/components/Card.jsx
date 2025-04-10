import React from 'react';
import { CardColor, CardType } from '../types';

const colorMap = {
  [CardColor.RED]: 'bg-red-500',
  [CardColor.BLUE]: 'bg-blue-500',
  [CardColor.GREEN]: 'bg-green-500',
  [CardColor.YELLOW]: 'bg-yellow-500',
};

const sizeMap = {
  sm: 'w-16 h-24',
  md: 'w-20 h-32',
  lg: 'w-24 h-36',
};

export function Card({ card, size = 'md', onClick, disabled }) {
  const bgColor = card.color ? colorMap[card.color] : 'bg-gray-800';
  const sizeClass = sizeMap[size];

  const handleClick = (e) => {
    e.preventDefault();
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${sizeClass}
        ${bgColor}
        rounded-lg
        shadow-lg
        text-white
        font-bold
        relative
        transition-transform
        hover:transform
        hover:-translate-y-2
        disabled:opacity-50
        disabled:hover:transform-none
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {card.type === CardType.NUMBER && (
          <span className="text-3xl">{card.value}</span>
        )}
        {card.type === CardType.SKIP && (
          <span className="text-2xl">⊘</span>
        )}
        {card.type === CardType.REVERSE && (
          <span className="text-2xl">↺</span>
        )}
        {card.type === CardType.DRAW_TWO && (
          <span className="text-xl">+2</span>
        )}
        {card.type === CardType.WILD && (
          <span className="text-xl">★</span>
        )}
        {card.type === CardType.WILD_DRAW_FOUR && (
          <span className="text-xl">+4</span>
        )}
      </div>
    </button>
  );
}