import React, { useState } from 'react';
import { Article } from '../types';
import { BookOpen, Clock, User, ArrowUpRight, Calendar } from 'lucide-react';
import { ArticleDetailModal } from './ArticleDetailModal';

interface ArticlesSectionProps {
  articles: Article[];
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  if (!articles || articles.length === 0) return null;

  const leadArticle = articles.find(a => a.isFeatured) || articles[0];
  const secondaryArticles = articles.filter(a => a.id !== leadArticle?.id);

  return (
    <section className="py-16 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Curatorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-800 font-mono mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>EDITORIAL STORIES & ESSAYS</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900">
              บทความและบันทึกการเดินทาง
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-serif italic">
            เรื่องเล่าจากขุนเขา วัฒนธรรมท้องถิ่น และเส้นทางแนะนำ
          </span>
        </div>

        {/* Editorial Front-Page 3-Tier Salience (as recommended in skill) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Lead Story (7 cols) */}
          {leadArticle && (
            <div
              onClick={() => setSelectedArticle(leadArticle)}
              className="lg:col-span-7 group cursor-pointer bg-[#FAF8F5] rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-300 transition-all duration-300 hover:shadow-lg flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src={leadArticle.coverImage}
                  alt={leadArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-[#153326] text-white text-[11px] uppercase tracking-wider font-mono px-3 py-1 rounded-sm">
                  {leadArticle.category}
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-3 font-sans">
                    <span>{leadArticle.author}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>{leadArticle.readTime}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{leadArticle.publishedAt}</span>
                  </div>

                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 group-hover:text-[#153326] transition-colors leading-snug mb-3">
                    {leadArticle.title}
                  </h3>

                  <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed mb-6 line-clamp-3">
                    {leadArticle.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200/80 flex items-center justify-between text-xs font-medium text-[#153326]">
                  <span>อ่านบทความฉบับเต็ม</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          )}

          {/* Secondary Stories List (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {secondaryArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="group cursor-pointer p-5 bg-[#FAF8F5] rounded-xl border border-stone-200 hover:border-stone-300 transition-all hover:shadow-sm flex flex-col sm:flex-row gap-4"
              >
                <div className="relative w-full sm:w-36 aspect-[4/3] sm:aspect-square rounded-lg overflow-hidden bg-stone-100 shrink-0">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-1.5 font-sans">
                      <span className="text-[#153326] font-medium">{article.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h4 className="font-editorial text-base sm:text-lg font-semibold text-stone-900 group-hover:text-[#153326] transition-colors line-clamp-2 leading-snug mb-2">
                      {article.title}
                    </h4>

                    <p className="text-xs text-stone-600 line-clamp-2 font-light leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="mt-3 text-[11px] text-stone-400">
                    โดย {article.author}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Reader Modal */}
      <ArticleDetailModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </section>
  );
};
