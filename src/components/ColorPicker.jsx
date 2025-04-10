import React from 'react';
import { CardColor } from '../types';

export function ColorPicker({ onColorSelect, onClose }) {
  const colors = [
    { name: 'Red', value: CardColor.RED, class: 'bg-red-500' },
    { name: 'Blue', value: CardColor.BLUE, class: 'bg-blue-500' },
    { name: 'Green', value: CardColor.GREEN, class: 'bg-green-500' },
    { name: 'Yellow', value: CardColor.YELLOW, class: 'bg-yellow-500' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Choose a color</h2>
        <div className="grid grid-cols-2 gap-4">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => onColorSelect(color.value)}
              className={`
                ${color.class}
                w-24 h-24
                rounded-lg
                shadow-md
                transition-transform
                hover:scale-105
                flex
                items-center
                justify-center
                text-white
                font-bold
              `}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}