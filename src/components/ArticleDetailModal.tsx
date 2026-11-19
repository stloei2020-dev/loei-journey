import React, { useState } from 'react';
import { Article } from '../types';
import { X, Clock, Calendar, Share2, Check, ExternalLink } from 'lucide-react';
import { OFFICIAL_CONTACT, buildArticleShareUrl } from '../constants/contact';

interface ArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({ article, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  if (!article) return null;

  const articleShareUrl = buildArticleShareUrl(article.id);
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleShareUrl)}`;
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(articleShareUrl)}&text=${encodeURIComponent(article.title)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(articleShareUrl)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Render paragraphs with markdown subheadings support
  const renderContent = () => {
    const paragraphs = article.content.split('\n\n');
    return paragraphs.map((block, idx) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 mt-8 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return (
          <div key={idx} className="py-4 my-6 border-y border-stone-200 text-base sm:text-lg font-serif italic text-stone-800 text-center">
            {trimmed.replace(/\*\*/g, '')}
          </div>
        );
      }
      // Opening paragraph gets drop cap styling
      if (idx === 0) {
        return (
          <p
            key={idx}
            className="text-stone-800 text-base sm:text-lg leading-relaxed mb-6 first-letter:text-5xl first-letter:font-editorial first-letter:font-bold first-letter:text-[#153326] first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1"
          >
            {trimmed}
          </p>
        );
      }
      return (
        <p key={idx} className="text-stone-700 text-base leading-relaxed mb-6 whitespace-pre-line">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 border border-stone-300">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200/90 bg-[#F4F0E8]">
          <div className="text-xs uppercase tracking-widest text-[#153326] font-mono">
            LOEI JOURNEY MAGAZINE · {article.category}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowShare(!showShare)}
                className="p-2 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
                title="แชร์บทความ"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {showShare && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-xl shadow-xl p-2 z-20 space-y-0.5">
                  <div className="text-[11px] font-semibold text-[#153326] px-2.5 py-1">
                    แชร์เฉพาะบทความนี้
                  </div>
                  <a
                    href={facebookShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-2.5 py-1.5 text-xs text-stone-700 hover:bg-stone-50 rounded-md flex items-center justify-between"
                  >
                    <span>Facebook</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                  <a
                    href={lineShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-2.5 py-1.5 text-xs text-stone-700 hover:bg-stone-50 rounded-md flex items-center justify-between"
                  >
                    <span>LINE</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                  <a
                    href={twitterShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-2.5 py-1.5 text-xs text-stone-700 hover:bg-stone-50 rounded-md flex items-center justify-between"
                  >
                    <span>X (Twitter)</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full text-left px-2.5 py-1.5 text-xs font-medium text-[#153326] hover:bg-emerald-50 rounded-md flex items-center justify-between"
                  >
                    <span>{copied ? 'คัดลอกลิงก์แล้ว' : 'คัดลอกลิงก์เฉพาะบทความ'}</span>
                    {copied && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Article Reading Body */}
        <div className="overflow-y-auto p-6 sm:p-10">
          <div className="max-w-prose mx-auto">
            
            {/* Headline & Metadata */}
            <h1 className="font-editorial text-2xl sm:text-4xl font-bold text-stone-900 leading-tight mb-4">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 pb-6 mb-8 border-b border-stone-200">
              <span className="font-medium text-stone-800">เรื่องโดย: {article.author}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>{article.publishedAt}</span>
              </span>
            </div>

            {/* Cover Image */}
            <div className="aspect-[16/9] rounded-xl overflow-hidden mb-8 border border-stone-200">
              <img
                src={article.coverImage}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Reading Column */}
            <div className="reading-column">
              {renderContent()}
            </div>

            {/* Editorial Footer Sign-off */}
            <div className="mt-12 pt-6 border-t border-stone-300 text-center space-y-1.5">
              <div className="text-xs text-stone-600 font-serif italic">
                — LOEI JOURNEY MAGAZINE · {OFFICIAL_CONTACT.organization} —
              </div>
              <div className="text-[11px] text-stone-500">
                {OFFICIAL_CONTACT.address} · เบอร์โทรศัพท์ {OFFICIAL_CONTACT.phoneDisplay}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
