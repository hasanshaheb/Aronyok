"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, Calendar, Clock } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { fallbackBlogPosts } from "../../lib/supabase/fallback-data";
import { isSupabaseConfigured, supabase } from "../../lib/supabase/client";
import { BlogPost } from "../../lib/types";

export default function BlogIndexPage() {
  const { language, t, localize } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>(fallbackBlogPosts);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch("/api/admin/data?entity=blogs");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPosts(data.filter((b: any) => b.status === "published"));
          }
        }
      } catch (err) {
        console.warn("Using fallback blogs:", err);
      }
    }
    loadBlogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-earth-100 text-earth-800 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5 text-earth-600" />
          <span>{language === "bn" ? "প্রকৃতি ডায়েরি" : "Eco Journal"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950 tracking-tight">
          {t.blog.title}
        </h1>
        <p className="text-sm text-forest-700/80">{t.blog.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-3xl bg-white border border-forest-100/90 overflow-hidden shadow-soft-sm hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative w-full aspect-[16/10] bg-stone-100 overflow-hidden">
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={localize(post.title)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-forest-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase">
                {post.category || "Herbal Care"}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-extrabold text-lg text-forest-950 group-hover:text-forest-700 transition-colors line-clamp-2">
                  {localize(post.title)}
                </h3>
                <p className="text-xs text-forest-700/80 mt-2 line-clamp-3 leading-relaxed">
                  {localize(post.excerpt)}
                </p>
              </div>

              <div className="pt-3 border-t border-forest-50 flex items-center justify-between text-xs text-forest-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-forest-500" />
                  <span>{post.read_time || "5 min read"}</span>
                </span>
                <span className="font-bold text-forest-800 flex items-center gap-1 group-hover:text-forest-600">
                  <span>{t.blog.readMore}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
