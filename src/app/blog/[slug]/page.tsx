"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Leaf, Share2 } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { fallbackBlogPosts } from "../../../lib/supabase/fallback-data";
import { isSupabaseConfigured, supabase } from "../../../lib/supabase/client";
import { BlogPost } from "../../../lib/types";

export default function SingleBlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { language, t, localize } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch("/api/admin/data?entity=blogs");
        if (res.ok) {
          const blogs = await res.json();
          if (Array.isArray(blogs)) {
            const found = blogs.find((b: any) => b.slug === slug);
            if (found) {
              setPost(found);
              return;
            }
          }
        }
      } catch {}

      const foundFallback = fallbackBlogPosts.find((b) => b.slug === slug);
      if (foundFallback) setPost(foundFallback);
    }
    loadPost();
  }, [slug]);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-forest-900">
          {language === "bn" ? "নিবন্ধটি পাওয়া যায়নি" : "Article Not Found"}
        </h2>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-forest-700 hover:text-forest-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.blog.backToBlog}</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-xs font-bold text-forest-700 hover:text-forest-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.blog.backToBlog}</span>
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
            {post.category || "Herbal Care"}
          </span>
          <span className="text-xs text-forest-600 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.read_time || "5 min read"}</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest-950 tracking-tight leading-tight">
          {localize(post.title)}
        </h1>

        <p className="text-base sm:text-lg text-forest-800/80 leading-relaxed italic border-l-4 border-forest-400 pl-4 py-1">
          {localize(post.excerpt)}
        </p>
      </div>

      {/* Featured Banner Image */}
      {post.image_url && (
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-soft-md">
          <img
            src={post.image_url}
            alt={localize(post.title)}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80";
            }}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Body Content */}
      <div className="prose prose-forest max-w-none text-forest-900 space-y-4 leading-relaxed text-sm sm:text-base bg-white p-6 sm:p-10 rounded-3xl border border-forest-100/90 shadow-soft-sm">
        <div className="whitespace-pre-line leading-relaxed">
          {localize(post.content)}
        </div>
      </div>
    </article>
  );
}
