export interface HackathonItem {
  id: number;
  ep: string;
  kanji: string;
  fullText: string;
  title: string;
  event: string;
  result: string;
  teamSize: string;
  stamp: '1st Place' | '2nd Runner-Up' | 'Finalist' | 'Selected';
  stampKanji: string;
  isGoldHighlight: boolean;
  counterTarget: number | null;
  counterSuffix?: string;
  hasClock36?: boolean;
  isEditableResult?: boolean;
  defaultPlaceholder?: string;
  link: string;
}

export interface OtherAchievementItem {
  id: number;
  text: string;
  title: string;
  subtitle: string;
  badge: string;
  kanji: string;
  link?: string;
}

export const HACKATHONS_DATA: HackathonItem[] = [
  {
    id: 0,
    ep: 'EP 01',
    kanji: '誉',
    fullText: "Google Developer Hackathon, Tech Sprint '26: 2nd Runner-Up (100+ teams)",
    title: "Tech Sprint '26",
    event: 'Google Developer Hackathon',
    result: '2nd Runner-Up (100+ teams)',
    teamSize: '100+ teams',
    stamp: '2nd Runner-Up',
    stampKanji: '準優',
    isGoldHighlight: true,
    counterTarget: 100,
    counterSuffix: '+ teams',
    link: 'https://www.linkedin.com/in/yashasvi-s-rajput-492154319',
  },
  {
    id: 1,
    ep: 'EP 02',
    kanji: '忍',
    fullText: 'MANIT Bhopal 36-Hour Hackathon: Selected among 21 teams from 1,000+ applicants',
    title: '36-Hour Hackathon',
    event: 'MANIT Bhopal',
    result: 'Selected among 21 teams from 1,000+ applicants',
    teamSize: '21 teams / 1,000+ applicants',
    stamp: 'Selected',
    stampKanji: '選抜',
    isGoldHighlight: false,
    counterTarget: 1000,
    counterSuffix: '+ applicants',
    hasClock36: true,
    link: 'https://www.linkedin.com/in/yashasvi-s-rajput-492154319',
  },
  {
    id: 2,
    ep: 'EP 03',
    kanji: '創',
    fullText: 'Hack&Make, MP Startup Summit 2026: Selected among 10,000+ national entries',
    title: 'Hack&Make',
    event: 'MP Startup Summit 2026',
    result: 'Selected among 10,000+ national entries',
    teamSize: '10,000+ national entries',
    stamp: 'Selected',
    stampKanji: '選抜',
    isGoldHighlight: false,
    counterTarget: 10000,
    counterSuffix: '+ national entries',
    link: 'https://www.linkedin.com/in/yashasvi-s-rajput-492154319',
  },
  {
    id: 3,
    ep: 'EP 04',
    kanji: '挑',
    fullText: 'TIT SRIJAN 2026: from 350+ teams',
    title: 'TIT SRIJAN 2026',
    event: 'TIT SRIJAN 2026',
    result: 'from 350+ teams',
    teamSize: '350+ teams',
    stamp: 'Finalist',
    stampKanji: '決戦',
    isGoldHighlight: false,
    counterTarget: 350,
    counterSuffix: '+ teams',
    isEditableResult: true,
    defaultPlaceholder: 'Result TBA — Click to enter result',
    link: 'https://www.linkedin.com/in/yashasvi-s-rajput-492154319',
  },
  {
    id: 4,
    ep: 'EP 05',
    kanji: '覇',
    fullText: 'Oriental TechHack 2.0 (National Level Hackathon): Team Dhurandar secured "Overall (Best Design and Implementation)"',
    title: 'Oriental TechHack 2.0',
    event: 'National Level Hackathon',
    result: 'Team Dhurandar secured "Overall (Best Design and Implementation)"',
    teamSize: 'Team Dhurandar',
    stamp: '1st Place',
    stampKanji: '優勝',
    isGoldHighlight: true,
    counterTarget: null,
    link: 'https://www.linkedin.com/in/yashasvi-s-rajput-492154319',
  },
  {
    id: 5,
    ep: 'EP 06',
    kanji: '極',
    fullText: 'Smart India Hackathon (SIH) 2025: Selected for the Grand Finale',
    title: 'Smart India Hackathon (SIH) 2025',
    event: 'Smart India Hackathon 2025',
    result: 'Selected for the Grand Finale',
    teamSize: 'Grand Finale Squad',
    stamp: 'Finalist',
    stampKanji: '決戦',
    isGoldHighlight: true,
    counterTarget: null,
    link: 'https://www.linkedin.com/in/yashasvi-s-rajput-492154319',
  },
  {
    id: 6,
    ep: 'EP 07',
    kanji: '勝',
    fullText: 'Build-a-thon, Story 2.0: First position',
    title: 'Build-a-thon, Story 2.0',
    event: 'Build-a-thon, Story 2.0',
    result: 'First position',
    teamSize: '1st Position',
    stamp: '1st Place',
    stampKanji: '一位',
    isGoldHighlight: true,
    counterTarget: null,
    link: 'https://www.linkedin.com/in/yashasvi-s-rajput-492154319',
  },
];

export const OTHER_ACHIEVEMENTS_DATA: OtherAchievementItem[] = [
  {
    id: 0,
    text: 'Winner of the SDE Sheet Challenge among 100k+ participants',
    title: 'Winner of the SDE Sheet Challenge',
    subtitle: 'among 100k+ participants',
    badge: '100K+ PARTICIPANTS',
    kanji: '極',
    link: 'https://x.com/hashtag/SDESheetChallenge',
  },
  {
    id: 1,
    text: 'Youth Icon Award 2.0, Oriental Institute of Science and Technology, Bhopal',
    title: 'Youth Icon Award 2.0',
    subtitle: 'Oriental Institute of Science and Technology, Bhopal',
    badge: 'YOUTH ICON 2.0',
    kanji: '誉',
    link: 'https://www.linkedin.com/company/oriental-institute-of-science-and-technology-bhopal/',
  },
  {
    id: 2,
    text: 'NPTEL "Programming in Java": completed with Elite',
    title: 'NPTEL "Programming in Java"',
    subtitle: 'completed with Elite',
    badge: 'ELITE CERTIFIED',
    kanji: '技',
    link: 'https://www.linkedin.com/company/nptel/',
  },
  {
    id: 3,
    text: 'Published design patent: AI-driven crop monitoring device',
    title: 'Published Design Patent',
    subtitle: 'AI-driven crop monitoring device',
    badge: 'INDIAN DESIGN PATENT',
    kanji: '創',
  },
];

declare global {
  interface Window {
    __HACKATHON_DATA__?: {
      hackathons: HackathonItem[];
      achievements: OtherAchievementItem[];
    };
  }
}
