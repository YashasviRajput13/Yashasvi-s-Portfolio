import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  HACKATHONS_DATA,
  OTHER_ACHIEVEMENTS_DATA,
  HackathonItem,
  OtherAchievementItem,
} from '../data/hackathonsData';

export interface HackathonSelection {
  type: 'hackathon' | 'achievement';
  id: number;
  fullModal?: boolean;
}

interface HackathonsAchievementsProps {
  selection: HackathonSelection | null;
  onSelect: (selection: HackathonSelection | null) => void;
  onClose: () => void;
}

const FALLBACK_IMAGE_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#FFF8F0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6E626A" font-family="sans-serif" font-size="16">Photo Unavailable</text></svg>'
  );

export const HackathonsAchievements: React.FC<HackathonsAchievementsProps> = ({
  selection,
  onSelect,
  onClose,
}) => {
  const hackathons: HackathonItem[] =
    (typeof window !== 'undefined' && window.__HACKATHON_DATA__?.hackathons) || HACKATHONS_DATA;
  const achievements: OtherAchievementItem[] =
    (typeof window !== 'undefined' && window.__HACKATHON_DATA__?.achievements) ||
    OTHER_ACHIEVEMENTS_DATA;

  const allEpisodes = useMemo(() => {
    const hList = hackathons.map((h, idx) => ({
      ...h,
      selectionType: 'hackathon' as const,
      selectionId: idx,
    }));
    const aList = achievements.map((a, idx) => ({
      id: 100 + idx,
      ep: a.ep || `EP ${String(hackathons.length + idx + 1).padStart(2, '0')}`,
      title: a.title || a.text,
      event: a.badge || 'Achievement',
      result: a.subtitle || a.stamp || 'Verified Achievement',
      teamSize: idx === 0 ? '100k+ participants' : 'Individual Honor',
      image: a.image,
      experience: a.experience || a.text,
      fullText: a.text,
      link: a.link,
      isEditableResult: false,
      defaultPlaceholder: '',
      selectionType: 'achievement' as const,
      selectionId: idx,
    }));
    return [...hList, ...aList];
  }, [hackathons, achievements]);

  const activeEpisodeIdx =
    selection?.type === 'achievement'
      ? hackathons.length + (selection.id || 0)
      : selection?.id || 0;
  const item = allEpisodes[activeEpisodeIdx] || allEpisodes[0];

  const reduceMotion =
    typeof window !== 'undefined' &&
    Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);

  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [titResult, setTitResult] = useState<string>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('tit_srijan_2026_result') || '' : ''
  );

  const selectEpisodeByIdx = useCallback(
    (epIdx: number) => {
      const total = allEpisodes.length;
      const norm = ((epIdx % total) + total) % total;
      const target = allEpisodes[norm];
      if (target.selectionType === 'achievement') {
        onSelect({ type: 'achievement', id: target.selectionId, fullModal: true });
      } else {
        onSelect({ type: 'hackathon', id: target.selectionId });
      }
    },
    [allEpisodes, onSelect]
  );

  const prevHack = useCallback(
    () => selectEpisodeByIdx(activeEpisodeIdx - 1),
    [activeEpisodeIdx, selectEpisodeByIdx]
  );
  const nextHack = useCallback(
    () => selectEpisodeByIdx(activeEpisodeIdx + 1),
    [activeEpisodeIdx, selectEpisodeByIdx]
  );

  useEffect(() => {
    if (!selection) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        if (expandedImage) setExpandedImage(null);
        else onClose();
      } else if (ev.key === 'ArrowRight') {
        nextHack();
      } else if (ev.key === 'ArrowLeft') {
        prevHack();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selection, onClose, nextHack, prevHack, expandedImage]);

  if (!selection || !item) return null;

  const handleTitResultChange = (val: string) => {
    setTitResult(val);
    try {
      localStorage.setItem('tit_srijan_2026_result', val);
      window.dispatchEvent(new Event('tit-result-updated'));
    } catch {
      // ignore storage errors
    }
  };

  const resultLabel = item.isEditableResult
    ? titResult || item.defaultPlaceholder || item.result
    : item.result;

  return (
    <div
      className="hackathon-pastel-modal fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/25 backdrop-blur-md pointer-events-auto"
      onClick={onClose}
    >
      {expandedImage && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={ev => {
            ev.stopPropagation();
            setExpandedImage(null);
          }}
        >
          <div
            className="relative max-w-4xl w-full rounded-3xl bg-[#FFF8F0] p-4 shadow-[0_20px_50px_rgba(74,64,71,0.25)]"
            onClick={ev => ev.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[16px] font-bold text-[#4A4047]">{item.title}</span>
              <button
                type="button"
                onClick={() => setExpandedImage(null)}
                className="w-8 h-8 rounded-full bg-[#EFECE8] hover:bg-[#F9D5E5] text-[#4A4047] hover:text-[#8B3A5E] text-[13px] font-bold flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close enlarged photo"
              >
                ✕
              </button>
            </div>
            <img
              src={expandedImage}
              alt={item.title}
              onError={ev => {
                ev.currentTarget.onerror = null;
                ev.currentTarget.src = FALLBACK_IMAGE_SVG;
              }}
              className="w-full max-h-[75vh] object-contain rounded-2xl border-2 border-white bg-white"
            />
          </div>
        </div>
      )}

      <div
        className="relative w-full max-w-[920px] my-auto pointer-events-auto"
        onClick={ev => ev.stopPropagation()}
      >
        <div className="rounded-3xl bg-[#FFF8F0]/95 backdrop-blur-md border border-white/80 shadow-[0_20px_50px_rgba(74,64,71,0.16)] p-6 sm:p-8 md:p-10 text-[#4A4047]">
          <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-[#4A4047]/10">
            <div className="hackathon-tabs-scroll flex items-center gap-2 overflow-x-auto pb-1">
              {allEpisodes.map((epItem, idx) => {
                const isActive = idx === activeEpisodeIdx;
                return (
                  <button
                    key={epItem.ep}
                    type="button"
                    onClick={() => selectEpisodeByIdx(idx)}
                    className={`shrink-0 min-w-[36px] h-9 px-3 rounded-full text-[13px] transition-colors duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#F9D5E5] text-[#8B3A5E] font-bold'
                        : 'bg-[#EFECE8] text-[#6E626A] font-medium hover:bg-[#E4DCF8]/60 hover:text-[#4A4047]'
                    }`}
                    title={epItem.title}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 w-9 h-9 rounded-full bg-[#EFECE8] hover:bg-[#F9D5E5] text-[#4A4047] hover:text-[#8B3A5E] flex items-center justify-center transition-colors cursor-pointer"
              title="Close (Esc)"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <motion.div
            key={activeEpisodeIdx}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.24, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-12 gap-7 md:gap-10 items-center"
          >
            {item.image && (
              <div className="md:col-span-5">
                <div
                  onClick={() => setExpandedImage(item.image)}
                  className="group relative w-full h-64 sm:h-72 md:h-[300px] rounded-2xl border-2 border-white bg-white/85 shadow-[0_8px_24px_rgba(74,64,71,0.07)] overflow-hidden flex items-center justify-center cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={ev => {
                      ev.currentTarget.onerror = null;
                      ev.currentTarget.src = FALLBACK_IMAGE_SVG;
                    }}
                    className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              </div>
            )}

            <div
              className={`${
                item.image ? 'md:col-span-7' : 'md:col-span-12'
              } flex flex-col justify-between gap-5`}
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-[#E4DCF8] text-[#4A4047] text-[13px] font-semibold">
                    {item.ep}
                  </span>
                  <span className="text-[13px] font-semibold text-[#6E626A]">{item.event}</span>
                </div>
                <h2 className="text-[28px] font-bold text-[#4A4047] leading-[1.25] tracking-tight">
                  {item.title}
                </h2>
                <p className="text-[16px] text-[#4A4047]/90 leading-[1.65] line-clamp-3">
                  {item.experience || item.fullText}
                </p>
                {item.isEditableResult && (
                  <input
                    type="text"
                    value={titResult}
                    onChange={ev => handleTitResultChange(ev.target.value)}
                    placeholder="Optional: Update TIT SRIJAN result..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#4A4047]/15 text-[#4A4047] text-[13px] focus:outline-none focus:border-[#F9D5E5]"
                  />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-1.5 rounded-full bg-[#D5F0E3] text-[#4A4047] text-[13px] font-semibold">
                  {resultLabel}
                </span>
                {item.teamSize && (
                  <span className="px-3.5 py-1.5 rounded-full bg-[#FFE3CF] text-[#4A4047] text-[13px] font-semibold">
                    {item.teamSize}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#4A4047]/10">
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D6EAF8] hover:bg-[#c3e0f4] text-[#4A4047] text-[13px] font-semibold transition-colors"
                  >
                    Verify ↗
                  </a>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={prevHack}
                    className="px-4 py-2 rounded-full bg-[#EFECE8] hover:bg-[#F9D5E5] text-[#4A4047] hover:text-[#8B3A5E] text-[13px] font-semibold transition-colors cursor-pointer"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={nextHack}
                    className="px-4 py-2 rounded-full bg-[#F9D5E5] hover:bg-[#f4bfd6] text-[#8B3A5E] text-[13px] font-semibold transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
