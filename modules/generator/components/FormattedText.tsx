// components/FormattedText.tsx
import React from 'react';

interface FormattedTextProps {
  text: string;
  className?: string;
}

export const FormattedText = ({ text, className = "" }: FormattedTextProps) => {
  if (!text) return null;

  // 1. Pre-process text: Collapse excess blank lines
  const processedText = text.replace(/\n{3,}/g, '\n\n').trim();

  // 2. Parse inline formatting helper
  const renderInline = (str: string): React.ReactNode[] => {
    let parts: (string | React.ReactNode)[] = [str];

    // Bold: **text**
    parts = parts.flatMap(part => {
      if (typeof part !== 'string') return part;
      return part.split(/(\*\*[^*]+?\*\*)/g).map(p => {
        if (p.startsWith('**') && p.endsWith('**') && p.length > 4) {
          return <strong key={Math.random()}>{p.slice(2, -2)}</strong>;
        }
        return p;
      });
    });

    // Italic: *text* (avoid bold)
    parts = parts.flatMap(part => {
      if (typeof part !== 'string') return part;
      return part.split(/(\*[^*]+?\*)/g).map(p => {
        if (p.startsWith('*') && p.endsWith('*') && !p.startsWith('**') && p.length > 2) {
          return <em key={Math.random()}>{p.slice(1, -1)}</em>;
        }
        return p;
      });
    });

    // Strike: ~~text~~
    parts = parts.flatMap(part => {
      if (typeof part !== 'string') return part;
      return part.split(/(~~[^~]+?~~)/g).map(p => {
        if (p.startsWith('~~') && p.endsWith('~~') && p.length > 4) {
          return <del key={Math.random()}>{p.slice(2, -2)}</del>;
        }
        return p;
      });
    });

    // Underline: <u>text</u>
    parts = parts.flatMap(part => {
      if (typeof part !== 'string') return part;
      return part.split(/(<u>.*?<\/u>)/gi).map(p => {
        if (p.toLowerCase().startsWith('<u>') && p.toLowerCase().endsWith('</u>')) {
          return <u key={Math.random()}>{p.slice(3, -4)}</u>;
        }
        return p;
      });
    });

    return parts;
  };

  // 3. Line-by-line parsing with state for grouping
  const lines = processedText.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentGroup: { type: 'ul' | 'ol' | 'p', items: React.ReactNode[] } | null = null;

  const pushGroup = () => {
    if (!currentGroup) return;

    if (currentGroup.type === 'ul' || currentGroup.type === 'ol') {
      const Tag = currentGroup.type;
      const listClass = Tag === 'ul' ? 'list-disc' : 'list-decimal';
      elements.push(
        <Tag key={`list-${elements.length}`} className={`${listClass} pl-5 space-y-1 my-3`}>
          {currentGroup.items.map((item, i) => <li key={i}>{item}</li>)}
        </Tag>
      );
    } else if (currentGroup.type === 'p') {
      elements.push(
        <p key={`p-${elements.length}`} className="mb-3 last:mb-0">
          {currentGroup.items.map((item, i) => (
            <React.Fragment key={i}>
              {item}
              {i < currentGroup!.items.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    }
    currentGroup = null;
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Headings
    if (trimmedLine.startsWith('### ')) {
      pushGroup();
      elements.push(<h3 key={`h3-${index}`} className="text-base font-bold mt-4 mb-2">{renderInline(trimmedLine.slice(4))}</h3>);
    } else if (trimmedLine.startsWith('## ')) {
      pushGroup();
      elements.push(<h2 key={`h2-${index}`} className="text-lg font-bold mt-5 mb-2">{renderInline(trimmedLine.slice(3))}</h2>);
    } else if (trimmedLine.startsWith('# ')) {
      pushGroup();
      elements.push(<h1 key={`h1-${index}`} className="text-xl font-bold mt-6 mb-3">{renderInline(trimmedLine.slice(2))}</h1>);
    }
    // Unordered Lists
    else if (trimmedLine.startsWith('• ') || trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      const content = trimmedLine.replace(/^(•|\*|-)\s+/, '');
      if (currentGroup && currentGroup.type === 'ul') {
        currentGroup.items.push(renderInline(content));
      } else {
        pushGroup();
        currentGroup = { type: 'ul', items: [renderInline(content)] };
      }
    }
    // Ordered Lists
    else if (/^\d+\.\s/.test(trimmedLine)) {
      const content = trimmedLine.replace(/^\d+\.\s+/, '');
      if (currentGroup && currentGroup.type === 'ol') {
        currentGroup.items.push(renderInline(content));
      } else {
        pushGroup();
        currentGroup = { type: 'ol', items: [renderInline(content)] };
      }
    }
    // Empty Line
    else if (trimmedLine === '') {
      pushGroup();
      elements.push(<div key={`space-${index}`} className="h-2" />);
    }
    // Paragraph content
    else {
      if (currentGroup && currentGroup.type === 'p') {
        currentGroup.items.push(renderInline(line));
      } else {
        pushGroup();
        currentGroup = { type: 'p', items: [renderInline(line)] };
      }
    }
  });

  pushGroup(); // Final flush

  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      {elements}
    </div>
  );
};