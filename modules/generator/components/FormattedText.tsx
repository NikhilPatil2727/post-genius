// components/FormattedText.tsx
import React from 'react';

export const FormattedText = ({ text, className = "" }: { text: string, className?: string }) => {
  if (!text) return null;

  // 1. First, handle bullet points. 
  // Replace "* " at the start of a line with "• " for a cleaner look.
  const cleanBullets = text.replace(/^\s*\*\s/gm, '• ');

  // 2. Split by double asterisks to handle bolding
  const parts = cleanBullets.split(/(\*\*.*?\*\*)/g);

  return (
    <div className={`whitespace-pre-wrap ${className}`}>
      {parts.map((part, index) => {
        // Check if this part is a bold section (wrapped in **)
        if (part.startsWith('**') && part.endsWith('**')) {
          // Remove the first 2 and last 2 characters (the asterisks)
          const content = part.slice(2, -2);
          return (
            <span key={index} className="font-bold text-foreground">
              {content}
            </span>
          );
        }
        
        // Return regular text (and remove any stray single asterisks if necessary)
        // This .replace(/\*/g, '') is a safety net to remove any remaining stars
        return <span key={index}>{part.replace(/\*/g, '')}</span>;
      })}
    </div>
  );
};