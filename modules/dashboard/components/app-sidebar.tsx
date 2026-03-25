"use client";
import {
  Wand2,
  Trash2,
  Clock,
  RotateCw,
  FileText,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getUserPostsAction, deletePostAction } from "@/modules/generator/actions";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { toUserFriendlyError } from "@/lib/error-utils";

// Main navigation items
const mainNavItems = [
  {
    title: "Generate",
    url: "/admin/generate",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getUserPostsAction();
      if (result.success && result.posts) {
        setPosts(result.posts);
      } else if (!result.success) {
        toast.error(result.error || "We could not load your recent posts.");
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      toast.error(toUserFriendlyError(error, "We could not load your recent posts."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();

    // Listen for custom event when a new post is saved
    const handlePostSaved = (event: any) => {
      const newPost = event.detail;
      if (newPost) {
        // Optimistically add the new post to the top of history
        setPosts(prev => {
          const exists = prev.some(p => p.id === newPost.id);
          if (exists) return prev;
          return [newPost, ...prev];
        });
      } else {
        // Fallback if no detail provided
        fetchPosts();
      }
    };

    window.addEventListener('post-saved', handlePostSaved as any);

    return () => {
      window.removeEventListener('post-saved', handlePostSaved as any);
    };
  }, [fetchPosts]);

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const result = await deletePostAction(postId);
      if (result.success) {
        toast.success("Post deleted successfully");
        setPosts(posts.filter(p => p.id !== postId));
      } else {
        toast.error(result.error || "Failed to delete post");
      }
    } catch (error) {
      toast.error(toUserFriendlyError(error, "We could not delete this post."));
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={"/"} className="flex flex-col gap-0 items-start p-4 hover:opacity-80 transition-opacity">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white leading-none">
            Post<span className="text-blue-600">Bloom</span>
          </h1>
          <span className="text-[8px] uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500 font-black mt-1.5">
            Editorial
          </span>
        </Link>
        <SidebarSeparator />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size={"lg"}
                    isActive={pathname === item.url}
                    className={`rounded-xl transition-all ${pathname === item.url ? 'bg-primary/10 text-primary shadow-sm' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
                  >
                    <Link href={item.url}>
                      <span className="font-bold text-[15px]">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2" />

        <SidebarGroup className="flex-1 flex flex-col">
          <SidebarGroupLabel className="px-4 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
            <span>Recent Creations</span>
            <button
              onClick={fetchPosts}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors group"
              title="Refresh History"
            >
              <RotateCw className={`size-3.5 text-zinc-400 group-hover:text-primary transition-all ${loading ? 'animate-spin' : ''}`} />
            </button>
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex-1 overflow-hidden">
            <SidebarMenu className="px-2 space-y-1">
              {loading && posts.length === 0 ? (
                <div className="px-4 py-8 flex flex-col items-center gap-3 opacity-50">
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Loading Posts...</span>
                </div>
              ) : posts.length === 0 ? (
                <div className="px-6 py-12 text-center rounded-2xl border-2 border-dashed border-zinc-100 dark:border-zinc-800/50">
                  <FileText className="size-8 text-zinc-200 dark:text-zinc-800 mx-auto mb-3" />
                  <p className="text-[11px] font-bold text-zinc-400 leading-tight">
                    No posts yet.<br />Your history will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-200 dark:scroll-thumb-zinc-800">
                  {posts.map((post) => (
                    <SidebarMenuItem key={post.id} className="group relative list-none">
                      <SidebarMenuButton
                        asChild
                        className="pr-10 h-auto py-3 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900 transition-all shadow-none hover:shadow-sm"
                      >
                        <Link href={`/admin/generate?id=${post.id}`}>
                          <div className="flex flex-col items-start gap-1 w-full truncate">
                            <span className="truncate w-full font-bold text-[13px] text-zinc-700 dark:text-zinc-200">
                              {post.topic || (post.sourceText ? post.sourceText.slice(0, 40) : "Draft Creation")}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-zinc-400 flex items-center gap-1 uppercase tracking-tighter">
                                <Clock className="size-3" />
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                              </span>
                              <div className="flex gap-1">
                                {post.variants?.map((v: any, i: number) => (
                                  <div key={i} className="h-1 w-1 rounded-full bg-primary/40" />
                                ))}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </SidebarMenuItem>
                  ))}
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

