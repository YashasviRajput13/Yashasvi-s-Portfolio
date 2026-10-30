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
  image: string;
  experience: string;
  link: string;
}

export interface OtherAchievementItem {
  id: number;
  ep: string;
  text: string;
  title: string;
  subtitle: string;
  badge: string;
  kanji: string;
  stamp?: string;
  stampKanji?: string;
  isGoldHighlight?: boolean;
  image: string;
  experience: string;
  link?: string;
}

export const HACKATHONS_DATA: HackathonItem[] = [
  {
    id: 0,
    ep: 'EP 01',
    kanji: '誉',
    fullText: "Google Developer Hackathon, Tech Sprint '26: 2nd Runner-Up (100+ teams)",
    title: "Tech Sprint '26",
    event: 'Google Developer Hackathon · GDG OIST',
    result: '2nd Runner-Up (100+ teams)',
    teamSize: '100+ teams',
    stamp: '2nd Runner-Up',
    stampKanji: '準優',
    isGoldHighlight: true,
    counterTarget: 100,
    counterSuffix: '+ teams',
    image: '/assets/aistudio/image_2735fdb5.png',
    experience:
      'Competed against 100+ teams in the Google Developer Group (GDG OIST) TechSprint Hackathon under the Open Innovation theme, securing the 2nd Runner-Up trophy, medals, and certificates of excellence.',
    link: 'https://www.linkedin.com/in/yashasvi-s-rajput-492154319',
  },
  {
    id: 1,
    ep: 'EP 02',
    kanji: '忍',
    fullText: 'MANIT Bhopal 36-Hour Hackathon: Selected among 21 teams from 1,000+ applicants',
    title: 'MANIT Version Beta (36-Hr)',
    event: 'MANIT Bhopal · Version Beta',
    result: 'Selected among 21 teams from 1,000+ applicants',
    teamSize: '21 teams / 1,000+ applicants',
    stamp: 'Selected',
    stampKanji: '選抜',
    isGoldHighlight: false,
    counterTarget: 1000,
    counterSuffix: '+ applicants',
    hasClock36: true,
    image: '/assets/aistudio/image_8037811e.png',
    experience:
      'Shortlisted among the top 21 finalist teams out of 1,000+ national applicants for the 36-hour non-stop Version Beta hackathon hosted by ISTE at Maulana Azad National Institute of Technology (MANIT), Bhopal.',
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
    image: '/assets/aistudio/image_19f41daf.png',
    experience:
      "Selected from over 10,000+ national entries to build and pitch live at the Startup MP Hack&Make arena ('Code It. Build It. Ship It.') during the Madhya Pradesh Startup Summit 2026.",
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
    image: '/assets/aistudio/image_84ab171b.png',
    experience:
      'Represented the squad at Technocrats Institute of Technology for TIT SRIJAN 2026, competing against 350+ engineering teams across rigorous problem-solving and prototype evaluation rounds.',
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
    image: '/assets/aistudio/image_e242f8e4.png',
    experience:
      'Led Team Dhurandar to victory at the Oriental TechHack 2.0 National Level Hackathon, winning the trophy and gold medals for Overall Best Design and Implementation.',
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
    teamSize: 'Team SYSAN (Team Leader)',
    stamp: 'Finalist',
    stampKanji: '決戦',
    isGoldHighlight: true,
    counterTarget: null,
    image: '/assets/aistudio/image_2fe710e3.png',
    experience:
      'Spearheaded Team SYSAN as Team Leader to qualify for the prestigious Smart India Hackathon (SIH) 2025 National Grand Finale, solving high-impact national problem statements.',
    link: 'https://www.linkedin.com/in/yashasvi-s-rajput-492154319',
  },
  {
    id: 6,
    ep: 'EP 07',
    kanji: '勝',
    fullText: 'Build-a-thon, Story 2.0: First position',
    title: 'Build-a-thon, Story 2.0',
    event: 'Story India × Bhopal DAO',
    result: 'First position',
    teamSize: '1st Position Winner',
    stamp: '1st Place',
    stampKanji: '一位',
    isGoldHighlight: true,
    counterTarget: null,
    image: '/assets/aistudio/image_6a2fcaa0.png',
    experience:
      'Claimed 1st Position at Build w/ Story 2.0 (powered by Story India × Bhopal DAO), pitching and shipping a winning Web3 & AI product prototype.',
    link: 'https://www.linkedin.com/in/yashasvi-s-rajput-492154319',
  },
];

export const OTHER_ACHIEVEMENTS_DATA: OtherAchievementItem[] = [
  {
    id: 0,
    ep: 'EP 08',
    text: 'Winner of the SDE Sheet Challenge among 100k+ participants',
    title: 'takeUforward SDE Sheet Challenge',
    subtitle: 'Top 50 among 100k+ participants',
    badge: 'TOP 50 · 100K+ PARTICIPANTS',
    kanji: '極',
    stamp: 'Top 50 Winner',
    stampKanji: '極勝',
    isGoldHighlight: true,
    image: '/assets/aistudio/image_ed8740a0.png',
    experience:
      'Stood among the Top 50 winners out of 100,000+ participants nationwide in the takeUforward SDE Sheet Challenge, awarded official takeUforward merchandise and recognition.',
    link: 'https://x.com/hashtag/SDESheetChallenge',
  },
  {
    id: 1,
    ep: 'EP 09',
    text: 'Youth Icon Award 2.0, Oriental Institute of Science and Technology, Bhopal',
    title: 'Youth Icon Award 2.0',
    subtitle: 'Oriental Institute of Science and Technology, Bhopal',
    badge: 'YOUTH ICON 2.0',
    kanji: '誉',
    stamp: 'Awardee',
    stampKanji: '名誉',
    isGoldHighlight: true,
    image: '/assets/aistudio/image_d39a581d.png',
    experience:
      'Honored on stage with the Youth Icon Award 2.0 at Oriental Institute of Science and Technology (OIST), Bhopal for technical excellence and national hackathon victories.',
    link: 'https://www.linkedin.com/company/oriental-institute-of-science-and-technology-bhopal/',
  },
  {
    id: 2,
    ep: 'EP 10',
    text: 'NPTEL "Programming in Java": completed with Elite',
    title: 'NPTEL "Programming in Java"',
    subtitle: 'Completed with Elite (87% Score · IIT Kharagpur)',
    badge: 'ELITE CERTIFIED · 87%',
    kanji: '技',
    stamp: 'Elite 87%',
    stampKanji: '精鋭',
    isGoldHighlight: false,
    image: '/assets/aistudio/image_86057b3c.png',
    experience:
      'Earned the NPTEL Elite Certification in Programming in Java from IIT Kharagpur with a consolidated score of 87% (99.28/100 online assignments) among 14,557 certified candidates.',
    link: 'https://www.linkedin.com/company/nptel/',
  },
  {
    id: 3,
    ep: 'EP 11',
    text: 'Published design patent: AI-driven crop monitoring device',
    title: 'Published Design Patent',
    subtitle: 'AI Based Drone for Crop Monitoring (Design No. 438341-001)',
    badge: 'PATENT NO. 438341-001',
    kanji: '創',
    stamp: 'Registered',
    stampKanji: '特許',
    isGoldHighlight: true,
    image: '/assets/aistudio/image_7cad9120.png',
    experience:
      'Granted Certificate of Registration of Design (No. 438341-001, Class 12-07) by the Patent Office, Government of India, for an AI Based Drone for Crop Monitoring.',
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
