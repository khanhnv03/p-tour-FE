import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UserNavbar from '../components/UserNavbar';
import { BRAND_NAME } from '../constants';
import { getBlogPostBySlug, type BlogBlock, type BlogPostDetail } from '../api/blogData';

function formatDate(value: string | null | undefined) {
  if (!value) return '';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(value));
}

function readMinutes(post: BlogPostDetail | null) {
  if (!post) return 1;
  let text = '';
  if (post.blocks && post.blocks.length > 0) {
    text = post.blocks.map(b => b.content ?? '').join(' ');
  } else {
    text = post.content ?? '';
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

// ── inline markdown → React nodes (**bold**, *italic*) ───────────────────────

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*'))
      return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

// split on \n and render each line, with inline markdown per line
function renderText(text: string): React.ReactNode {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>
      {renderInline(line)}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

// ── block renderers ────────────────────────────────────────────────────────

function RenderBlock({ block }: { block: BlogBlock }) {
  switch (block.blockType) {
    case 'HEADING':
      return (
        <h2 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight mt-10 mb-4 leading-snug">
          {block.content}
        </h2>
      );

    case 'PARAGRAPH':
      return (
        <p className="text-[17px] leading-relaxed text-on-surface-variant mb-6">
          {renderText(block.content ?? '')}
        </p>
      );

    case 'QUOTE':
      return (
        <blockquote className="my-8 pl-5 border-l-4 border-primary/40">
          <p className="text-lg italic text-on-surface-variant leading-relaxed font-medium">
            {renderText(block.content ?? '')}
          </p>
        </blockquote>
      );

    case 'IMAGE':
      return block.imageUrl ? (
        <figure className="my-8">
          <img
            src={block.imageUrl}
            alt={block.content ?? ''}
            className="w-full rounded-2xl object-cover max-h-[500px] shadow-md"
          />
          {block.content && (
            <figcaption className="text-center text-sm text-on-surface-variant mt-3 italic">
              {block.content}
            </figcaption>
          )}
        </figure>
      ) : null;

    case 'GALLERY':
      if (!block.images || block.images.length === 0) return null;
      return (
        <div className={`my-8 grid gap-3 ${block.images.length === 1 ? 'grid-cols-1' : block.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
          {block.images.map((img, i) => (
            <figure key={i} className="overflow-hidden rounded-xl">
              <img
                src={img.imageUrl}
                alt={img.altText ?? ''}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
            </figure>
          ))}
        </div>
      );

    default:
      return null;
  }
}

// ── main component ─────────────────────────────────────────────────────────

export default function BlogPost() {
  const { slug } = useParams();
  const currentSlug = slug ?? '';
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentSlug]);

  useEffect(() => {
    if (!currentSlug) { setError('Đường dẫn bài viết không hợp lệ'); setLoading(false); return; }
    setLoading(true);
    setError(null);
    let cancelled = false;
    getBlogPostBySlug(currentSlug)
      .then(data => { if (!cancelled) setPost(data); })
      .catch(() => { if (!cancelled) setError('Không tìm thấy bài viết'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [currentSlug]);

  const minutes = useMemo(() => readMinutes(post), [post]);
  const hasBlocks = (post?.blocks?.length ?? 0) > 0;

  return (
    <div className="bg-surface text-on-surface font-sans selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      <UserNavbar />

      <main className="max-w-4xl mx-auto px-8 py-12 flex-grow w-full">
        <Link to="/journal" className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors mb-8">
          <span className="material-symbols-outlined">arrow_back</span>
          Quay lại Nhật ký
        </Link>

        {loading ? (
          <div className="py-24 text-center text-sm font-bold text-on-surface-variant">Đang tải bài viết...</div>
        ) : error || !post ? (
          <div className="rounded-xl border border-red-100 bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold">
            {error ?? 'Không tìm thấy bài viết'}
          </div>
        ) : (
          <>
            {/* Header */}
            <header className="mb-12 text-center">
              <div className="flex items-center justify-center gap-3 mb-6 text-on-surface-variant flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Nhật ký</span>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                <span className="text-sm font-bold">{formatDate(post.publishedAt)}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                <span className="text-sm font-bold">{minutes} phút đọc</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-on-surface mb-8 leading-[1.1]">
                {post.title}
              </h1>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full shadow-md bg-primary/10 text-primary flex items-center justify-center font-black">
                  {(post.authorName ?? '').split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase() || '?'}
                </div>
                <div className="text-left">
                  <div className="font-bold text-on-surface">{post.authorName}</div>
                  <div className="text-xs text-on-surface-variant">Biên tập viên</div>
                </div>
              </div>
            </header>

            {/* Cover image */}
            {post.coverImageUrl && (
              <figure className="mb-12 rounded-[2rem] overflow-hidden shadow-2xl h-[360px] md:h-[560px]">
                <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
              </figure>
            )}

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl font-medium text-on-surface leading-loose mb-10 italic border-l-4 border-secondary/30 pl-6">
                {post.excerpt}
              </p>
            )}

            {/* Content */}
            <article className="pb-20 border-b border-outline-variant/20">
              {hasBlocks
                ? post.blocks!.map((block, i) => <RenderBlock key={block.id ?? i} block={block} />)
                : <div className="prose prose-lg max-w-none text-on-surface-variant leading-relaxed text-lg whitespace-pre-wrap">{post.content}</div>
              }
            </article>
          </>
        )}
      </main>

      <footer className="bg-slate-50 w-full mt-auto">
        <div className="border-t border-slate-200 py-8 px-8 text-center">
          <p className="text-slate-400 text-xs font-medium">© 2026 {BRAND_NAME}. Vượt ra ngoài giới hạn.</p>
        </div>
      </footer>
    </div>
  );
}
