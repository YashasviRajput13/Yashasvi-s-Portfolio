import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ExternalLink, Github, Award, X, Layers } from 'lucide-react';
import { RESUME_DATA } from '../data/resumeData';

interface ProjectShowcaseModalProps {
  selectedProjectId: number | null;
  onClose: () => void;
  onSelectProject: (id: number) => void;
}

export const ProjectShowcaseModal: React.FC<ProjectShowcaseModalProps> = ({
  selectedProjectId,
  onClose,
  onSelectProject
}) => {
  const projects = RESUME_DATA.projects;
  const [direction, setDirection] = useState<'next' | 'prev' | 'start'>('start');

  useEffect(() => {
    if (selectedProjectId === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        setDirection('next');
        onSelectProject((selectedProjectId + 1) % projects.length);
      }
      if (e.key === 'ArrowLeft') {
        setDirection('prev');
        onSelectProject((selectedProjectId - 1 + projects.length) % projects.length);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedProjectId, onClose, onSelectProject, projects.length]);

  if (selectedProjectId === null) return null;

  const curSlide = selectedProjectId;
  const project = projects[curSlide] || projects[0];

  const handlePrev = () => {
    setDirection('prev');
    onSelectProject((curSlide - 1 + projects.length) % projects.length);
  };

  const handleNext = () => {
    setDirection('next');
    onSelectProject((curSlide + 1) % projects.length);
  };

  const offset = 120;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050811]/92 flex items-center justify-center pointer-events-auto"
      onClick={onClose}
    >
      <div
        className="w-full h-screen relative overflow-y-auto md:overflow-hidden flex items-center justify-center px-4 py-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Project Showcase"
          className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>Close</span>
          <X className="w-4 h-4" />
        </button>

        {/* Top-Left Counter & Navigation Dots */}
        <div className="fixed top-6 left-6 z-40 flex items-center gap-3">
          <span className="text-xs font-mono text-white/60 uppercase tracking-widest">
            Project Archive
          </span>
          <span className="text-white/30">·</span>
          <div className="flex items-center gap-1.5">
            {projects.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setDirection(idx > curSlide ? 'next' : 'prev');
                  onSelectProject(idx);
                }}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  idx === curSlide
                    ? 'bg-[#719CED] text-slate-950 font-semibold'
                    : 'text-white/60 hover:text-white bg-white/5'
                }`}
              >
                {p.short}
              </button>
            ))}
          </div>
        </div>

        {/* Main mousham.design zte Layout */}
        <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Arrow */}
          <div className="hidden lg:flex lg:col-span-1 justify-start">
            <button
              onClick={handlePrev}
              aria-label="Previous Project"
              className="p-3 rounded-full border border-white/20 hover:border-white/60 text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>

          {/* Center 3:4 Architectural Card + Giant Kinetic Number */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Giant Kinetic Number (mousham.design signature) */}
            <div className="absolute -top-10 left-2 md:-left-8 z-20 pointer-events-none select-none overflow-hidden h-24 md:h-32">
              <motion.span
                key={`num-${project.id}`}
                initial={{ y: direction === 'prev' ? -offset : offset, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.18, duration: 0.55 }}
                className="font-display text-7xl md:text-9xl font-extrabold text-white tracking-tighter block leading-none drop-shadow-2xl"
              >
                {project.short}
              </motion.span>
            </div>

            {/* Interactive 3D Visual Card */}
            <motion.div
              key={`card-${project.id}`}
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-md aspect-[4/5] rounded-2xl border border-white/15 bg-gradient-to-br from-slate-900 via-[#0B1325] to-slate-950 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl"
            >
              {/* Subtle Ambient Glow */}
              <div
                className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ backgroundColor: project.accentColor }}
              />

              <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4 pt-6">
                <span className="text-xs font-mono text-[#9DDCE9] tracking-wider uppercase">
                  {project.category}
                </span>
                <span className="text-xs font-mono text-white/50 tabular-nums">
                  {project.short} / 0{projects.length}
                </span>
              </div>

              {/* Interactive System Architecture Blueprint Visual */}
              <div className="relative z-10 my-auto py-6">
                <div className="flex items-center gap-2 text-xs font-mono text-white/60 mb-3">
                  <Layers className="w-3.5 h-3.5 text-[#719CED]" />
                  <span>System Pipeline &amp; Execution Flow</span>
                </div>
                <div className="space-y-2.5">
                  {project.architecturePattern.split(' → ').map((stage, i) => (
                    <div
                      key={stage}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10"
                    >
                      <span
                        className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold text-slate-950 shrink-0"
                        style={{ backgroundColor: project.accentColor }}
                      >
                        0{i + 1}
                      </span>
                      <span className="text-xs md:text-sm font-medium text-white/90">
                        {stage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unboxed Metadata Tech Stack */}
              <div className="relative z-10 border-t border-white/10 pt-4">
                <p className="text-[11px] font-mono uppercase tracking-wider text-white/40 mb-1.5">
                  Core Stack
                </p>
                <p className="text-xs text-white/80 leading-relaxed">
                  {project.techStack.join(' · ')}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Kinetic Staggered Outlined Title + Details + Links */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-5 project-detail-panel bg-[#060a14]/92 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl">
            {/* Outlined Kinetic Display Header (mousham.design zte signature) */}
            <div className="overflow-hidden">
              <motion.h2
                key={`title-${project.id}`}
                initial={{ y: direction === 'prev' ? -60 : 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.15, duration: 0.55 }}
                className="font-display text-5xl md:text-7xl font-extrabold text-outline-stroke tracking-tight leading-none select-none"
              >
                {project.title}
              </motion.h2>
              <h3 className="font-display text-xl md:text-2xl font-semibold text-white mt-2 leading-snug">
                {project.subtitle}
              </h3>
            </div>

            {/* Lead Description with improved line height */}
            <motion.p
              key={`desc-${project.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="project-detail-description text-sm md:text-base font-normal text-slate-50 leading-[1.75]"
            >
              {project.description}
            </motion.p>

            {/* Engineering Highlights from Resume */}
            <div className="space-y-3 border-t border-white/15 pt-4">
              {project.highlights.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs md:text-sm text-slate-100/95 leading-[1.75]">
                  <span className="font-mono text-[#719CED] shrink-0 mt-0.5">0{idx + 1}.</span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons (Visit Live / GitHub / Patent Certificate) */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-[#719CED] hover:bg-[#8ab0f4] text-slate-950 font-semibold text-xs md:text-sm rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <span>Visit Live →</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-white/10 border border-white/30 rounded-lg hover:bg-white/20 hover:border-white/60 text-white text-xs md:text-sm font-light transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository →</span>
              </a>
              {project.certificateUrl && (
                <a
                  href={project.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-amber-500/15 border border-amber-400/40 rounded-lg hover:bg-amber-500/25 text-amber-200 text-xs md:text-sm font-light transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <Award className="w-4 h-4" />
                  <span>Patent Certificate →</span>
                </a>
              )}
            </div>

            {/* Mobile Prev/Next Controls */}
            <div className="flex lg:hidden items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={handlePrev}
                className="px-4 py-2 rounded-lg border border-white/20 text-white text-xs flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-lg border border-white/20 text-white text-xs flex items-center gap-2 cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Arrow */}
          <div className="hidden lg:flex lg:col-span-1 justify-end">
            <button
              onClick={handleNext}
              aria-label="Next Project"
              className="p-3 rounded-full border border-white/20 hover:border-white/60 text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
