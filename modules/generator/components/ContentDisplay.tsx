'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bold,
  Eraser,
  Heart,
  Italic,
  List,
  ListOrdered,
  MessageCircle,
  Repeat2,
  Send,
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

const PLATFORM_CONFIG: Record<
  Platform,
  {
    name: string;
    icon: React.ReactNode;
    characterLimit?: number;
    brandClass: string;
    softClass: string;
  }
> = {
  linkedin: {
    name: 'LinkedIn',
    icon: <FaLinkedin className="h-4 w-4 text-[#0A66C2]" />,
    characterLimit: 3000,
    brandClass: 'border-[#0A66C2]/20 bg-[#0A66C2]/10 text-[#0A66C2]',
    softClass: 'from-[#0A66C2]/6 to-[#0A66C2]/0 dark:from-[#0A66C2]/15 dark:to-transparent',
  },
  twitter: {
    name: 'X',
    icon: <FaXTwitter className="h-4 w-4 text-[#111111] dark:text-white" />,
    characterLimit: 280,
    brandClass: 'border-zinc-400/30 bg-zinc-500/10 text-zinc-700 dark:text-zinc-200',
    softClass: 'from-zinc-500/8 to-transparent dark:from-zinc-400/15 dark:to-transparent',
  },
  instagram: {
    name: 'Instagram',
    icon: <FaInstagram className="h-4 w-4 text-[#E4405F]" />,
    characterLimit: 2200,
    brandClass: 'border-[#E4405F]/20 bg-[#E4405F]/10 text-[#E4405F]',
    softClass: 'from-[#F77737]/10 via-[#E4405F]/8 to-[#833AB4]/5 dark:from-[#F77737]/20 dark:via-[#E4405F]/15 dark:to-[#833AB4]/10',
  },
  peerlist: {
    name: 'Peerlist',
    icon: <SiPeerlist className="h-4 w-4 text-[#00AA45]" />,
    characterLimit: 2000,
    brandClass: 'border-[#00AA45]/20 bg-[#00AA45]/10 text-[#00AA45]',
    softClass: 'from-[#00AA45]/8 to-transparent dark:from-[#00AA45]/18 dark:to-transparent',
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
  const { user } = useUser();
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Platform>('linkedin');
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [editedContent, setEditedContent] = useState<Partial<Record<Platform, string>>>({});
  const [expandedPosts, setExpandedPosts] = useState<Partial<Record<Platform, boolean>>>({});
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
  const showPostActions = !isEditing && Boolean(content[activeTab]);
  const isExpanded = expandedPosts[activeTab] ?? false;
  const PREVIEW_LIMIT = 360;
  const strippedActiveContent = stripMarkdown(activeContent);
  const isLongPost = strippedActiveContent.length > PREVIEW_LIMIT;
  const previewText = isExpanded || !isLongPost ? activeContent : `${strippedActiveContent.slice(0, PREVIEW_LIMIT).trimEnd()}...`;
  const fakeLikes = Math.max(12, Math.min(96, Math.round(cleanLength / 14)));
  const fakeComments = Math.max(2, Math.min(34, Math.round(cleanLength / 80)));
  const displayName = user?.fullName || user?.firstName || 'You';

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .content-display {
            font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: #f3f4f6;
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
            gap: 8px;
            height: 38px;
            padding: 0 12px;
            border: 1px solid rgba(0,0,0,0.08);
            border-radius: 999px;
            background: #FFFFFF;
            color: #52525B;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
            transition: all 0.2s ease;
          }
          .content-tab:focus-visible {
            outline: none;
            border-color: rgba(59,130,246,0.45);
            box-shadow: 0 0 0 3px rgba(59,130,246,0.14);
          }
          .dark .content-tab {
            color: #A1A1AA;
            border-color: rgba(255,255,255,0.12);
            background: #1A1A1A;
          }
          .content-tab.active {
            color: #0F0F0F;
            border-color: rgba(37,99,235,0.25);
            box-shadow: 0 8px 20px rgba(37,99,235,0.12);
          }
          .dark .content-tab.active {
            color: #EDEDED;
            border-color: rgba(96,165,250,0.35);
          }
          .content-tab.active::after {
            content: none;
          }
          .content-tab:hover {
            transform: translateY(-1px);
          }
          .post-shell {
            border-radius: 0;
            border: 1px solid #e5e7eb;
            background: #FFFFFF;
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
            overflow: hidden;
          }
          .dark .post-shell {
            border-color: rgba(255,255,255,0.08);
            background: #18181B;
            box-shadow: 0 18px 52px rgba(0,0,0,0.35);
          }
          .content-scroll::-webkit-scrollbar {
            width: 4px;
            height: 4px;
          }
          .content-scroll::-webkit-scrollbar-thumb {
            background: rgba(0,0,0,0.12);
            border-radius: 999px;
          }
          .action-btn {
            transition: background-color 0.18s ease, color 0.18s ease;
          }
          .action-btn:hover {
            background: #f3f4f6;
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

      <div className="content-display flex h-full flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-[#f3f4f6] dark:border-[rgba(255,255,255,0.08)] dark:bg-[#1A1A1A]">
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
                <span>{PLATFORM_CONFIG[id].icon}</span>
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
              className="mx-auto w-full max-w-[480px]"
            >
              <Card className="post-shell relative flex w-full flex-col rounded-none border-0">
                <div className={cn('absolute inset-x-0 top-0 h-24 bg-gradient-to-r', activeConfig.softClass)} />
                <CardHeader className="relative flex shrink-0 flex-row items-center justify-between border-b border-[#e5e7eb] px-4 py-4 dark:border-[rgba(255,255,255,0.08)]">
                  <div className="flex items-center gap-3">
                    <span className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#e5e7eb] bg-white text-base shadow-sm dark:border-white/15 dark:bg-zinc-900">
                      {user?.imageUrl ? (
                        <img src={user.imageUrl} alt={displayName} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-200">{displayName.charAt(0)}</span>
                      )}
                    </span>
                    <div className="space-y-0.5">
                      <CardTitle className="text-[14px] font-semibold text-[#111827] dark:text-[#EDEDED]">{displayName}</CardTitle>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{activeConfig.name} Member · now</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <span className={cn('rounded-full border px-2 py-1 text-[11px] font-semibold', activeConfig.brandClass)} aria-hidden>
                      {activeConfig.icon}
                    </span>
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

                <CardContent className="editor-container flex flex-col px-4 pb-4 pt-3">
                  <div className="pr-1">
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
                        className="min-h-[220px] rounded-[12px] border border-[#d1d5db] bg-white px-[14px] py-3 text-sm font-normal leading-relaxed text-[#111827] outline-none transition-all duration-200 focus:border-[#60a5fa] focus:ring-2 focus:ring-[#bfdbfe] dark:border-[rgba(255,255,255,0.12)] dark:text-[#EDEDED] md:min-h-full"
                      />
                    </>
                  ) : content[activeTab] ? (
                    <div>
                      <FormattedText
                        text={previewText}
                        className="text-[15px] font-normal leading-7 text-[#111827] dark:text-[#EDEDED]"
                      />
                      {isLongPost ? (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedPosts((prev) => ({ ...prev, [activeTab]: !isExpanded }))
                          }
                          className="mt-1 text-[12px] font-semibold text-zinc-500 transition-colors duration-200 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
                        >
                          {isExpanded ? 'See less' : 'See more'}
                        </button>
                      ) : null}
                    </div>
                  ) : (
                    <div className="py-10 text-center text-[12px] font-normal text-[#9CA3AF]">
                      {isStreaming && streamingPlatform !== activeTab ? 'Generating…' : 'Share your thoughts...'}
                    </div>
                  )}

                  </div>

                  {isEditing ? (
                    <div className="mt-4 flex items-center justify-between border-t border-[#e5e7eb] pt-3 dark:border-[rgba(255,255,255,0.08)]">
                      <div className="flex items-center gap-1">
                        <button type="button" className="action-btn inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
                          <Heart className="h-3.5 w-3.5" />
                          <span>Like</span>
                        </button>
                        <button type="button" className="action-btn inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>Comment</span>
                        </button>
                        <button type="button" className="action-btn inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
                          <Repeat2 className="h-3.5 w-3.5" />
                          <span>Repost</span>
                        </button>
                        <button type="button" className="action-btn inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
                          <Send className="h-3.5 w-3.5" />
                          <span>Send</span>
                        </button>
                      </div>
                      <button
                        type="button"
                        className="rounded-md bg-[#2563eb] px-4 py-2 text-[12px] font-semibold text-white transition-colors duration-200 hover:bg-[#1d4ed8]"
                      >
                        Post
                      </button>
                    </div>
                  ) : null}

                  {showPostActions ? (
                    <>
                    <div className="mt-4 flex items-center justify-between border-t border-[#e5e7eb] pt-3 text-[12px] text-zinc-500 dark:border-[rgba(255,255,255,0.08)] dark:text-zinc-400">
                      <span>{fakeLikes} likes</span>
                      <span>{fakeComments} comments · 1 repost</span>
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-2 border-t border-[#e5e7eb] pt-2 dark:border-[rgba(255,255,255,0.08)]">
                      <button
                        type="button"
                        className="action-btn inline-flex items-center justify-center gap-1 rounded-md py-1.5 text-[12px] font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                      >
                        <Heart className="h-3.5 w-3.5" />
                        <span>Like</span>
                      </button>
                      <button
                        type="button"
                        className="action-btn inline-flex items-center justify-center gap-1 rounded-md py-1.5 text-[12px] font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>Comment</span>
                      </button>
                      <button
                        type="button"
                        className="action-btn inline-flex items-center justify-center gap-1 rounded-md py-1.5 text-[12px] font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                      >
                        <Repeat2 className="h-3.5 w-3.5" />
                        <span>Repost</span>
                      </button>
                      <button
                        type="button"
                        className="action-btn inline-flex items-center justify-center gap-1 rounded-md py-1.5 text-[12px] font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Send</span>
                      </button>
                    </div>
                    </>
                  ) : null}

                  {activeConfig.characterLimit && content[activeTab] ? (
                    <div className="mt-3 flex items-center justify-between gap-4 border-t border-[rgba(0,0,0,0.08)] pt-3 dark:border-[rgba(255,255,255,0.08)]">
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
