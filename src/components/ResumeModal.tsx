import React, { useState } from 'react';
import { X, Download, ExternalLink, Github, Linkedin, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { RESUME_DATA } from '../data/resumeData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'interactive' | 'pdf'>('interactive');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 md:p-8 pointer-events-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl h-[90vh] bg-[#0B1222] border border-white/15 rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/10 bg-[#070D19]">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#719CED]" />
            <span className="font-display font-bold text-white text-base">
              {RESUME_DATA.name} — Curriculum Vitae
            </span>
          </div>

          {/* Interactive Filter Controls (Segmented Tabs) */}
          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
            <button
              onClick={() => setTab('interactive')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                tab === 'interactive'
                  ? 'bg-[#719CED] text-slate-950 font-semibold'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Structured Dossier
            </button>
            <button
              onClick={() => setTab('pdf')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                tab === 'pdf'
                  ? 'bg-[#719CED] text-slate-950 font-semibold'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Original Resume PDF
            </button>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={RESUME_DATA.resumePdfPath}
              download="Yashasvi_Singh_Rajput_Resume.pdf"
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>
            <button
              onClick={onClose}
              aria-label="Close Resume Viewer"
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {tab === 'pdf' ? (
          <div className="flex-1 w-full h-full bg-slate-900">
            <iframe
              src={RESUME_DATA.resumePdfPath}
              title="Yashasvi Singh Rajput Resume PDF"
              className="w-full h-full border-0"
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 text-white/90">
            {/* Header Block */}
            <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
                  {RESUME_DATA.name}
                </h1>
                <p className="text-sm text-[#9DDCE9] mt-1">{RESUME_DATA.role}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/60 mt-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {RESUME_DATA.location}
                  </span>
                  <span>·</span>
                  <a href={`tel:${RESUME_DATA.phone}`} className="hover:text-white flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {RESUME_DATA.phone}
                  </a>
                  <span>·</span>
                  <a href={`mailto:${RESUME_DATA.email}`} className="hover:text-white flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {RESUME_DATA.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={RESUME_DATA.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg border border-white/20 hover:border-white/50 text-xs text-white flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#719CED]" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={RESUME_DATA.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg border border-white/20 hover:border-white/50 text-xs text-white flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>

            {/* Summary */}
            <section>
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-[#719CED] mb-2">
                01. Summary
              </h2>
              <p className="text-sm text-white/80 leading-relaxed">{RESUME_DATA.summary}</p>
            </section>

            {/* Education */}
            <section>
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-[#719CED] mb-3">
                02. Education
              </h2>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-white text-base">
                    {RESUME_DATA.education.institution} · {RESUME_DATA.education.location}
                  </h3>
                  <span className="text-xs font-mono text-white/60 tabular-nums">
                    {RESUME_DATA.education.period}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                  <p className="text-sm text-[#9DDCE9]">{RESUME_DATA.education.degree}</p>
                  <span className="text-sm font-mono font-semibold text-white tabular-nums">
                    CGPA: {RESUME_DATA.education.cgpa}
                  </span>
                </div>
                <p className="text-xs text-white/60 mt-3">
                  Relevant Coursework: {RESUME_DATA.education.coursework.join(' · ')}
                </p>
              </div>
            </section>

            {/* Technical Skills */}
            <section>
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-[#719CED] mb-3">
                03. Technical Skills
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {RESUME_DATA.skillPillars.map((pillar) => (
                  <div
                    key={pillar.category}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/10"
                  >
                    <h3 className="text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                      {pillar.category}
                    </h3>
                    <p className="text-xs text-white/85 leading-relaxed">
                      {pillar.skills.join(' · ')}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Experience */}
            <section>
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-[#719CED] mb-3">
                04. Experience
              </h2>
              <div className="space-y-4">
                {RESUME_DATA.experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-white text-base">
                          {exp.organization} — <span className="text-[#9DDCE9]">{exp.role}</span>
                        </h3>
                        <p className="text-xs text-white/50">{exp.subtitle}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        {exp.liveUrl && (
                          <a
                            href={exp.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#719CED] hover:underline flex items-center gap-1"
                          >
                            <span>Live</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {exp.githubUrl && (
                          <a
                            href={exp.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/70 hover:text-white flex items-center gap-1"
                          >
                            <span>GitHub</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                    <ul className="space-y-1.5 text-xs md:text-sm text-white/75 pt-1">
                      {exp.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#719CED]">·</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-[#719CED] mb-3">
                05. Selected Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RESUME_DATA.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-white text-base">{proj.subtitle}</h3>
                        <div className="flex items-center gap-2 text-xs">
                          {proj.liveUrl && (
                            <a
                              href={proj.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#719CED] hover:underline"
                            >
                              Demo ↗
                            </a>
                          )}
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/70 hover:text-white"
                          >
                            GitHub ↗
                          </a>
                        </div>
                      </div>
                      <p className="text-xs text-white/75 mt-2 leading-relaxed">{proj.description}</p>
                    </div>
                    <p className="text-[11px] font-mono text-[#9DDCE9] mt-3 pt-2 border-t border-white/10">
                      {proj.techStack.join(' · ')}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Achievements & Certifications */}
            <section>
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-[#719CED] mb-3">
                06. Achievements &amp; Certifications
              </h2>
              <div className="space-y-2.5">
                {RESUME_DATA.achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-2"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-white">{ach.title}</h3>
                      <p className="text-xs text-white/60 mt-0.5">{ach.detail}</p>
                    </div>
                    {ach.certificateUrl && (
                      <a
                        href={ach.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#719CED] hover:underline flex items-center gap-1 shrink-0"
                      >
                        <span>Certificate</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
