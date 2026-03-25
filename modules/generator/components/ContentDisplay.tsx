'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bold,
  Eraser,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
} from 'lucide-react';
import { FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import { SiPeerlist } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormattedText } from './FormattedText';
import type { ContentResponse, Platform } from '@/types';
import { cn } from '@/lib/utils';

interface ContentDisplayProps {
  content: ContentResponse;
  isStreaming?: boolean;
}

const PLATFORM_CONFIG: Record<Platform, { name: string; icon: React.ReactNode; characterLimit?: number }> = {
  linkedin: {
    name: 'LinkedIn',
    icon: <FaLinkedin className="h-3.5 w-3.5" />,
    characterLimit: 3000,
  },
  twitter: {
    name: 'X',
    icon: <FaXTwitter className="h-3.5 w-3.5" />,
    characterLimit: 280,
  },
  instagram: {
    name: 'Instagram',
    icon: <FaInstagram className="h-3.5 w-3.5" />,
    characterLimit: 2200,
  },
  peerlist: {
    name: 'Peerlist',
    icon: <SiPeerlist className="h-3.5 w-3.5" />,
    characterLimit: 2000,
  },
};

const stripMarkdown = (text: string): string =>
  text
    .replace(/\*\*([\s\S]*?)\*\*/g, '$1')
    .replace(/\*([\s\S]*?)\*/g, '$1')
    .replace(/~~([\s\S]*?)~~/g, '$1')
    .replace(/<u>([\s\S]*?)<\/u>/gi, '$1')
    .replace(/^#{1,3}\s/gm, '')
    .replace(/^[\*\-]\s+/gm, '')
    .replace(/^\d+\.\s/gm, '')
    .replace(/^•\s/gm, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const markdownToHtml = (markdown: string): string =>
  markdown
    .replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__([\s\S]*?)__/g, '<strong>$1</strong>')
    .replace(/\*([\s\S]*?)\*/g, '<em>$1</em>')
    .replace(/_([\s\S]*?)_/g, '<em>$1</em>')
    .replace(/~~([\s\S]*?)~~/g, '<del>$1</del>')
    .replace(/<u>([\s\S]*?)<\/u>/gi, '<u>$1</u>')
    .replace(/\[([\s\S]*?)\]\(.*?\)/g, '$1')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*•]\s+/gm, '• ')
    .replace(/\n/g, '<br>');

const htmlToMarkdown = (html: string): string =>
  html
    .replace(/<strong>([\s\S]*?)<\/strong>/gi, '**$1**')
    .replace(/<b>([\s\S]*?)<\/b>/gi, '**$1**')
    .replace(/<em>([\s\S]*?)<\/em>/gi, '*$1*')
    .replace(/<i>([\s\S]*?)<\/i>/gi, '*$1*')
    .replace(/<del>([\s\S]*?)<\/del>/gi, '~~$1~~')
    .replace(/<s>([\s\S]*?)<\/s>/gi, '~~$1~~')
    .replace(/<strike>([\s\S]*?)<\/strike>/gi, '~~$1~~')
    .replace(/<u>([\s\S]*?)<\/u>/gi, '<u>$1</u>')
    .replace(/<li>([\s\S]*?)<\/li>/gi, '• $1\n')
    .replace(/<\/li>/gi, '')
    .replace(/<ul>/gi, '')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol>/gi, '')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p>([\s\S]*?)<\/p>/gi, '$1\n')
    .replace(/<\/div><div>/gi, '\n')
    .replace(/<div>/gi, '')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .trim();

function useTypingEffect(rawContent: string, isStreaming: boolean) {
  const [displayedContent, setDisplayedContent] = useState(rawContent);
  const targetRef = useRef(rawContent);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    targetRef.current = rawContent;

    if (!isStreaming) {
      const id = requestAnimationFrame(() => setDisplayedContent(rawContent));
      return () => cancelAnimationFrame(id);
    }

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    const tick = () => {
      setDisplayedContent((prev) => {
        if (prev.length >= targetRef.current.length) {
          return prev;
        }
        const nextLength = Math.min(prev.length + 2, targetRef.current.length);
        return targetRef.current.slice(0, nextLength);
      });
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [rawContent, isStreaming]);

  return displayedContent;
}

const EDITABLE_PLATFORMS: Platform[] = ['linkedin', 'twitter', 'instagram', 'peerlist'];

export function ContentDisplay({ content, isStreaming = false }: ContentDisplayProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Platform>('linkedin');
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [editedContent, setEditedContent] = useState<Partial<Record<Platform, string>>>({});
  const editableRef = useRef<HTMLDivElement | null>(null);

  const platformIds: Platform[] = ['linkedin', 'twitter', 'instagram', 'peerlist'];
  const streamingPlatform = isStreaming
    ? [...platformIds].reverse().find((id) => (content[id]?.length ?? 0) > 0) ?? null
    : null;

  const completedPlatforms = platformIds.filter((id) => {
    const hasContent = (content[id]?.length ?? 0) > 0;
    if (!isStreaming) return hasContent;
    if (!streamingPlatform) return false;
    return hasContent && id !== streamingPlatform && platformIds.indexOf(id) < platformIds.indexOf(streamingPlatform);
  });

  const typedContent = {
    linkedin: useTypingEffect(content.linkedin || '', isStreaming && activeTab === 'linkedin'),
    twitter: useTypingEffect(content.twitter || '', isStreaming && activeTab === 'twitter'),
    instagram: useTypingEffect(content.instagram || '', isStreaming && activeTab === 'instagram'),
    peerlist: useTypingEffect(content.peerlist || '', isStreaming && activeTab === 'peerlist'),
  };

  const activeConfig = PLATFORM_CONFIG[activeTab];
  const activeContent = editedContent[activeTab] ?? typedContent[activeTab] ?? '';
  const isEditing = editingPlatform === activeTab;
  const isEditable = EDITABLE_PLATFORMS.includes(activeTab);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(stripMarkdown(text));
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = async () => {
    const allContent = platformIds
      .map((id) => {
        const value = editedContent[id] ?? content[id];
        return value ? `--- ${PLATFORM_CONFIG[id].name.toUpperCase()} ---\n${value}\n` : '';
      })
      .filter(Boolean)
      .join('\n');

    await navigator.clipboard.writeText(stripMarkdown(allContent));
    setCopied('all');
    setTimeout(() => setCopied(null), 2000);
  };

  const startEditing = () => {
    const originalContent = editedContent[activeTab] ?? String(content[activeTab] || '');
    setEditingPlatform(activeTab);
    setEditedContent((prev) => ({ ...prev, [activeTab]: originalContent }));

    setTimeout(() => {
      if (editableRef.current) {
        editableRef.current.innerHTML = markdownToHtml(originalContent);
        editableRef.current.focus();
      }
    }, 0);
  };

  const saveEdit = () => {
    if (editableRef.current) {
      const markdown = htmlToMarkdown(editableRef.current.innerHTML);
      setEditedContent((prev) => ({ ...prev, [activeTab]: markdown }));
    }
    setEditingPlatform(null);
  };

  const cancelEdit = () => {
    setEditingPlatform(null);
    if (editableRef.current) {
      editableRef.current.innerHTML = '';
    }
  };

  const handleEditableInput = () => {
    if (editableRef.current) {
      const markdown = htmlToMarkdown(editableRef.current.innerHTML);
      setEditedContent((prev) => ({ ...prev, [activeTab]: markdown }));
    }
  };

  const applyFormat = (type: 'bold' | 'italic' | 'strike' | 'underline' | 'bullet' | 'numbered' | 'clear') => {
    const selection = window.getSelection();
    const hasSelection = selection && selection.rangeCount > 0 && selection.toString().trim() !== '';

    if (!hasSelection && !['bullet', 'numbered', 'clear'].includes(type)) return;

    switch (type) {
      case 'bold':
        document.execCommand('bold');
        break;
      case 'italic':
        document.execCommand('italic');
        break;
      case 'strike':
        document.execCommand('strikeThrough');
        break;
      case 'underline':
        document.execCommand('underline');
        break;
      case 'bullet':
        document.execCommand('insertUnorderedList');
        break;
      case 'numbered':
        document.execCommand('insertOrderedList');
        break;
      case 'clear':
        document.execCommand('removeFormat');
        if (document.queryCommandState('insertUnorderedList')) document.execCommand('insertUnorderedList');
        if (document.queryCommandState('insertOrderedList')) document.execCommand('insertOrderedList');
        break;
    }

    if (editableRef.current) {
      const markdown = htmlToMarkdown(editableRef.current.innerHTML);
      setEditedContent((prev) => ({ ...prev, [activeTab]: markdown }));
    }
  };

  const cleanLength = stripMarkdown(activeContent).length;
  const limit = activeConfig.characterLimit || 280;
  const progress = cleanLength / limit;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .content-display {
            font-family: Inter, system-ui, sans-serif;
            background: #FAFAFA;
            color: #0F0F0F;
          }
          .dark .content-display {
            background: #111111;
            color: #EDEDED;
          }
          .content-tabs {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 0 20px;
            border-bottom: 1px solid rgba(0,0,0,0.08);
            overflow-x: auto;
          }
          .dark .content-tabs {
            border-bottom-color: rgba(255,255,255,0.08);
          }
          .content-tab {
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            height: 40px;
            padding: 0;
            border: 0;
            background: transparent;
            color: #6B7280;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
          }
          .dark .content-tab {
            color: #A3A3A3;
          }
          .content-tab.active {
            color: #0F0F0F;
          }
          .dark .content-tab.active {
            color: #EDEDED;
          }
          .content-tab.active::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: -1px;
            height: 2px;
            background: #2563EB;
          }
          .content-scroll::-webkit-scrollbar {
            width: 4px;
            height: 4px;
          }
          .content-scroll::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.12);
            border-radius: 999px;
          }
          .dark .content-scroll::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.12);
          }
          .editor-container ul {
            list-style-type: disc;
            padding-left: 1.25rem;
            margin: 0.5rem 0;
          }
          .editor-container ol {
            list-style-type: decimal;
            padding-left: 1.25rem;
            margin: 0.5rem 0;
          }
          .editor-container [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9CA3AF;
            pointer-events: none;
          }
          .stream-dot {
            width: 6px;
            height: 6px;
            border-radius: 999px;
            background: #2563EB;
            animation: stream-pulse 0.8s ease-in-out infinite;
          }
          @keyframes stream-pulse {
            0%, 100% { opacity: 0.35; }
            50% { opacity: 1; }
          }
        `,
        }}
      />

      <div className="content-display flex h-full flex-col overflow-hidden rounded-[10px] border border-[rgba(0,0,0,0.08)] bg-white dark:border-[rgba(255,255,255,0.08)] dark:bg-[#1A1A1A]">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-medium text-[#0F0F0F] dark:text-[#EDEDED]">Generated drafts</h3>
            {isStreaming ? <span className="stream-dot" /> : null}
          </div>

          <button
            type="button"
            onClick={copyAll}
            disabled={isStreaming || !content.linkedin}
            className="rounded-[8px] border border-[rgba(0,0,0,0.12)] px-3 py-1.5 text-[13px] font-medium text-[#0F0F0F] disabled:opacity-50 dark:border-[rgba(255,255,255,0.12)] dark:text-[#EDEDED]"
          >
            {copied === 'all' ? 'Copied all' : 'Export all'}
          </button>
        </div>

        <div className="content-tabs content-scroll">
          {platformIds.map((id) => {
            const isActive = activeTab === id;
            const isComplete = completedPlatforms.includes(id);

            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={cn('content-tab', isActive && 'active')}
              >
                <span className="text-[#6B7280] dark:text-[#A3A3A3]">{PLATFORM_CONFIG[id].icon}</span>
                <span>{PLATFORM_CONFIG[id].name}</span>
                {isComplete ? <span className="h-1 w-1 rounded-full bg-[#22C55E]" /> : null}
              </button>
            );
          })}
        </div>

        <div className="content-scroll flex-1 overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.14 }}
              className="mx-auto w-full max-w-3xl"
            >
              <Card className="rounded-[10px] border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.08)] dark:bg-[#1A1A1A]">
                <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[#6B7280] dark:text-[#A3A3A3]">{activeConfig.icon}</span>
                    <CardTitle className="text-[13px] font-medium text-[#0F0F0F] dark:text-[#EDEDED]">{activeConfig.name}</CardTitle>
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditable && !isEditing && content[activeTab] ? (
                      <button
                        type="button"
                        onClick={startEditing}
                        className="rounded-[8px] border border-[rgba(0,0,0,0.12)] px-3 py-1.5 text-[13px] font-medium text-[#0F0F0F] dark:border-[rgba(255,255,255,0.12)] dark:text-[#EDEDED]"
                      >
                        Edit
                      </button>
                    ) : null}

                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-2 py-1.5 text-[13px] font-medium text-[#6B7280] dark:text-[#A3A3A3]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={saveEdit}
                          className="px-2 py-1.5 text-[13px] font-medium text-[#2563EB]"
                        >
                          Save
                        </button>
                      </>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => copyToClipboard(activeContent, activeTab)}
                      disabled={!content[activeTab]}
                      className="rounded-[8px] border border-[rgba(0,0,0,0.12)] px-3 py-1.5 text-[13px] font-medium text-[#0F0F0F] disabled:opacity-50 dark:border-[rgba(255,255,255,0.12)] dark:text-[#EDEDED]"
                    >
                      {copied === activeTab ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="editor-container px-4 pb-4 pt-0">
                  {isEditing ? (
                    <>
                      <div className="mb-3 flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-[6px] p-0 hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.08)]" onClick={() => applyFormat('bold')}>
                          <Bold className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-[6px] p-0 hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.08)]" onClick={() => applyFormat('italic')}>
                          <Italic className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-[6px] p-0 hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.08)]" onClick={() => applyFormat('strike')}>
                          <Strikethrough className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-[6px] p-0 hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.08)]" onClick={() => applyFormat('underline')}>
                          <Underline className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-[6px] p-0 hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.08)]" onClick={() => applyFormat('bullet')}>
                          <List className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-[6px] p-0 hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.08)]" onClick={() => applyFormat('numbered')}>
                          <ListOrdered className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-[6px] p-0 hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.08)]" onClick={() => applyFormat('clear')}>
                          <Eraser className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <div
                        ref={editableRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={handleEditableInput}
                        data-placeholder={`Edit your ${activeConfig.name} draft...`}
                        className="min-h-[120px] rounded-[8px] border border-[rgba(0,0,0,0.12)] px-[14px] py-3 text-sm font-normal leading-relaxed text-[#0F0F0F] outline-none focus:border-[#2563EB] dark:border-[rgba(255,255,255,0.12)] dark:text-[#EDEDED]"
                      />
                    </>
                  ) : content[activeTab] ? (
                    <FormattedText
                      text={activeContent}
                      className="text-sm font-normal leading-relaxed text-[#0F0F0F] dark:text-[#EDEDED]"
                    />
                  ) : (
                    <div className="py-10 text-center text-[12px] font-normal text-[#9CA3AF]">
                      {isStreaming && streamingPlatform !== activeTab ? 'Generating…' : 'No content yet'}
                    </div>
                  )}

                  {activeConfig.characterLimit && content[activeTab] ? (
                    <div className="mt-4 flex items-center justify-between gap-4 border-t border-[rgba(0,0,0,0.08)] pt-3 dark:border-[rgba(255,255,255,0.08)]">
                      <span className="text-[12px] font-normal text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                        {cleanLength} / {limit}
                      </span>
                      <div className="flex flex-1 justify-end gap-[2px]">
                        {[...Array(10)].map((_, index) => {
                          let segmentClass = 'bg-[rgba(0,0,0,0.08)] dark:bg-[rgba(255,255,255,0.08)]';
                          if (index < Math.ceil(Math.min(progress, 1) * 10)) {
                            if (progress > 1) segmentClass = 'bg-[#EF4444]';
                            else if (progress >= 0.8) segmentClass = 'bg-[#F59E0B]';
                            else segmentClass = 'bg-[#22C55E]';
                          }
                          return <div key={index} className={cn('h-[2px] w-4 rounded-[2px]', segmentClass)} />;
                        })}
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
