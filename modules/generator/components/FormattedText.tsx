import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export const FormattedText = ({ text, className = '' }: FormattedTextProps) => {
  if (!text) return null;

  const processedText = text.replace(/\n{3,}/g, '\n\n').trim();

  const renderInline = (str: string, keyPrefix: string): React.ReactNode[] => {
    let parts: (string | React.ReactNode)[] = [str];

    parts = parts.flatMap((part) => {
      if (typeof part !== 'string') return part;
      return part.split(/(\*\*[^*]+?\*\*)/g).map((piece, index) => {
        if (piece.startsWith('**') && piece.endsWith('**') && piece.length > 4) {
          return <strong key={`${keyPrefix}-bold-${index}`}>{piece.slice(2, -2)}</strong>;
        }
        return piece;
      });
    });

    parts = parts.flatMap((part) => {
      if (typeof part !== 'string') return part;
      return part.split(/(\*[^*]+?\*)/g).map((piece, index) => {
        if (piece.startsWith('*') && piece.endsWith('*') && !piece.startsWith('**') && piece.length > 2) {
          return <em key={`${keyPrefix}-italic-${index}`}>{piece.slice(1, -1)}</em>;
        }
        return piece;
      });
    });

    parts = parts.flatMap((part) => {
      if (typeof part !== 'string') return part;
      return part.split(/(~~[^~]+?~~)/g).map((piece, index) => {
        if (piece.startsWith('~~') && piece.endsWith('~~') && piece.length > 4) {
          return <del key={`${keyPrefix}-strike-${index}`}>{piece.slice(2, -2)}</del>;
        }
        return piece;
      });
    });

    parts = parts.flatMap((part) => {
      if (typeof part !== 'string') return part;
      return part.split(/(<u>.*?<\/u>)/gi).map((piece, index) => {
        if (piece.toLowerCase().startsWith('<u>') && piece.toLowerCase().endsWith('</u>')) {
          return <u key={`${keyPrefix}-underline-${index}`}>{piece.slice(3, -4)}</u>;
        }
        return piece;
      });
    });

    return parts;
  };

  const lines = processedText.split('\n');
  const elements: React.ReactNode[] = [];
  let currentGroup: { type: 'ul' | 'ol' | 'p'; items: React.ReactNode[] } | null = null;

  const pushGroup = () => {
    if (!currentGroup) return;
    const group = currentGroup;

    if (group.type === 'ul' || group.type === 'ol') {
      const Tag = group.type;
      const listClass = Tag === 'ul' ? 'list-disc' : 'list-decimal';
      elements.push(
        <Tag key={`list-${elements.length}`} className={`${listClass} pl-5 space-y-1 my-3`}>
          {group.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </Tag>
      );
    } else {
      elements.push(
        <p key={`p-${elements.length}`} className="mb-3 last:mb-0">
          {group.items.map((item, index) => (
            <React.Fragment key={index}>
              {item}
              {index < group.items.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    }

    currentGroup = null;
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('### ')) {
      pushGroup();
      elements.push(
        <h3 key={`h3-${index}`} className="text-base font-bold mt-4 mb-2">
          {renderInline(trimmedLine.slice(4), `h3-${index}`)}
        </h3>
      );
      return;
    }

    if (trimmedLine.startsWith('## ')) {
      pushGroup();
      elements.push(
        <h2 key={`h2-${index}`} className="text-lg font-bold mt-5 mb-2">
          {renderInline(trimmedLine.slice(3), `h2-${index}`)}
        </h2>
      );
      return;
    }

    if (trimmedLine.startsWith('# ')) {
      pushGroup();
      elements.push(
        <h1 key={`h1-${index}`} className="text-xl font-bold mt-6 mb-3">
          {renderInline(trimmedLine.slice(2), `h1-${index}`)}
        </h1>
      );
      return;
    }

    if (/^(?:•|\*|-)\s+/.test(trimmedLine)) {
      const content = trimmedLine.replace(/^(?:•|\*|-)\s+/, '');
      if (currentGroup?.type === 'ul') {
        currentGroup.items.push(renderInline(content, `ul-${index}`));
      } else {
        pushGroup();
        currentGroup = { type: 'ul', items: [renderInline(content, `ul-${index}`)] };
      }
      return;
    }

    if (/^\d+\.\s/.test(trimmedLine)) {
      const content = trimmedLine.replace(/^\d+\.\s+/, '');
      if (currentGroup?.type === 'ol') {
        currentGroup.items.push(renderInline(content, `ol-${index}`));
      } else {
        pushGroup();
        currentGroup = { type: 'ol', items: [renderInline(content, `ol-${index}`)] };
      }
      return;
    }

    if (trimmedLine === '') {
      pushGroup();
      elements.push(<div key={`space-${index}`} className="h-2" />);
      return;
    }

    if (currentGroup?.type === 'p') {
      currentGroup.items.push(renderInline(line, `p-${index}`));
    } else {
      pushGroup();
      currentGroup = { type: 'p', items: [renderInline(line, `p-${index}`)] };
    }
  });

  pushGroup();

  return <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>{elements}</div>;
};
