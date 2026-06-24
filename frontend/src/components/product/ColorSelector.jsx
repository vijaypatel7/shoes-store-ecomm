import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ColorSelector = ({ colors, selectedColor, onSelect }) => {
  return (
    <div>
      <h3 className="font-semibold text-sm mb-3">
        Color:{' '}
        <span className="font-normal text-dark-500">
          {selectedColor?.name || 'Select a color'}
        </span>
      </h3>
      <div className="flex gap-2.5">
        {colors?.map((color) => (
          <motion.button
            key={color.name}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelect(color)}
            className={`relative w-9 h-9 rounded-full transition-all
              ${
                selectedColor?.name === color.name
                  ? 'ring-2 ring-offset-2 ring-dark-950'
                  : 'hover:ring-2 hover:ring-offset-2 hover:ring-dark-300'
              }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          >
            {selectedColor?.name === color.name && (
              <Check
                size={16}
                className={`absolute inset-0 m-auto ${
                  ['White', 'Yellow', 'Beige'].includes(color.name)
                    ? 'text-dark-950'
                    : 'text-white'
                }`}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;