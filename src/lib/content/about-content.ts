/**
 * Single source of truth for the About page's structured content.
 *
 * These values are the content that was previously hardcoded inside the About
 * section components. They are used in two places:
 *  - as idempotent seed data (scripts/seed-about-content.ts), and
 *  - as the fallback the public components render when no database content is
 *    available, so the page never breaks and keeps its current text.
 *
 * Rich-text fields are stored as sanitized-friendly HTML strings. Only the
 * shared allowlist in src/lib/content/html.ts survives sanitization.
 */

export type AboutFounderContent = {
  id?: number;
  name: string;
  designation?: string | null;
  roleLabel?: string | null;
  imagePath?: string | null;
  biography?: string | null;
  quote?: string | null;
};

export type AboutChairmanMessageContent = {
  id?: number;
  eyebrow?: string | null;
  heading?: string | null;
  quote?: string | null;
  body?: string | null;
  closingStatement?: string | null;
  name?: string | null;
  designation?: string | null;
  imagePath?: string | null;
};

export type AboutMissionItemContent = {
  id?: number;
  title: string;
  description?: string | null;
  icon?: string | null;
};

export type AboutVisionMissionContent = {
  id?: number;
  visionEyebrow?: string | null;
  visionHeading?: string | null;
  visionStatement?: string | null;
  visionTags?: string | null;
  visionImagePath?: string | null;
  visionCaptionTitle?: string | null;
  visionCaptionSubtitle?: string | null;
  missionHeading?: string | null;
  missionIntro?: string | null;
  missionTags?: string | null;
  missionItems?: AboutMissionItemContent[];
};

export type AboutTrustPillarContent = {
  id?: number;
  title: string;
  description?: string | null;
  tag?: string | null;
  icon?: string | null;
};

export type AboutTrustContent = {
  id?: number;
  eyebrow?: string | null;
  heading?: string | null;
  intro?: string | null;
  closingEyebrow?: string | null;
  closingLabel?: string | null;
  closingStatement?: string | null;
  closingFooter?: string | null;
  pillars?: AboutTrustPillarContent[];
};

export const aboutFounders: AboutFounderContent[] = [
  {
    name: "Thiru. S. Thangapazham",
    designation: "Chairman",
    roleLabel: "Founder",
    imagePath: null,
    biography:
      "<p>Thiru. S. Thangapazham is a distinguished industrialist and philanthropist with a strong commitment to education, institution-building and social development.</p><p>His vision is to create opportunities for quality learning and provide students with a strong foundation for their future.</p>",
    quote:
      "Building institutions that create opportunities, develop capabilities and contribute meaningfully to society.",
  },
  {
    name: "Thiru. S.T. Murugesan",
    designation: "Managing Trustee",
    roleLabel: "Founder",
    imagePath: null,
    biography:
      "<p>Thiru. S.T. Murugesan works alongside his father in contributing to the growth and development of the Trust and its educational initiatives.</p><p>His leadership combines academic excellence with professional skills, discipline and strong values, supporting the institution's continued development.</p>",
    quote:
      "Supporting academic excellence while strengthening the institution's professional and educational foundations.",
  },
];

export const aboutChairmanMessage: AboutChairmanMessageContent = {
  eyebrow: "Chairman's Message",
  heading: "Education is<br>more than<br>knowledge.",
  quote:
    "At S. Thangapazham College of Engineering and Technology, we believe that education is not merely about acquiring knowledge; it is about developing the ability to think, question, create and contribute. Engineering, in particular, calls for a strong foundation in fundamentals, a practical approach to problem-solving and the ability to adapt to a constantly changing world.",
  body:
    "<p>Our endeavour is to create an academic environment where students are encouraged to explore their potential, embrace new ideas and develop the confidence to pursue their aspirations. Alongside academic and technical competence, we place great importance on discipline, integrity, responsibility and respect for others.</p><p>As an institution, our aspiration is to nurture capable professionals and grounded individuals who are prepared not only for the opportunities of today, but also for the challenges and possibilities of tomorrow.</p>",
  closingStatement: null,
  name: "Thiru. S. Thangapazham",
  designation: "Chairman",
  imagePath: null,
};

export const aboutMissionItems: AboutMissionItemContent[] = [
  {
    title: "Quality Technical Education",
    description:
      "Provide quality technical education through innovative teaching, industry-relevant learning and strong academic foundations.",
    icon: "graduation-cap",
  },
  {
    title: "Research & Innovation",
    description:
      "Promote research, innovation, entrepreneurship and lifelong learning among students and faculty.",
    icon: "lightbulb",
  },
  {
    title: "Ethics & Leadership",
    description:
      "Foster ethical values, leadership, professional responsibility and a commitment to excellence.",
    icon: "users",
  },
  {
    title: "Industry Collaboration",
    description:
      "Develop collaborations with industry, academia and society for knowledge exchange, practical learning and sustainable development.",
    icon: "handshake",
  },
  {
    title: "Future-Ready Graduates",
    description:
      "Prepare skilled, adaptable and socially responsible graduates to meet evolving global and local challenges.",
    icon: "bullseye",
  },
];

export const aboutVisionMission: AboutVisionMissionContent = {
  visionEyebrow: "Our Vision",
  visionHeading:
    'Shaping a Brighter Tomorrow Through <span class="text-accent-400">Knowledge</span> and <span class="text-accent-400">Innovation.</span>',
  visionStatement:
    "To be a centre of excellence in technical education, fostering knowledge, innovation and ethical values to develop competent professionals who contribute meaningfully to society and address the challenges of a changing world.",
  visionTags: "People, Progress, A Better Tomorrow",
  visionImagePath: null,
  visionCaptionTitle:
    "S. Thangapazham College of Engineering & Technology",
  visionCaptionSubtitle: "Engineering the Future",
  missionHeading:
    'Turning Our Vision<br><span class="text-accent-500">Into Action.</span>',
  missionIntro:
    "Our commitment to nurturing capable professionals through education, discovery, collaboration and responsibility.",
  missionTags: "Educate, Innovate, Empower",
  missionItems: aboutMissionItems,
};

export const aboutTrustPillars: AboutTrustPillarContent[] = [
  {
    title: "Quality",
    description:
      "We are committed to maintaining high standards and creating meaningful learning experiences that contribute to the academic and personal development of students.",
    tag: "Learning Standards",
    icon: "graduation-cap",
  },
  {
    title: "Opportunity",
    description:
      "We believe in expanding access to quality higher education, enabling students to pursue their aspirations, build confidence and realise their potential.",
    tag: "Access & Growth",
    icon: "lightbulb",
  },
  {
    title: "Excellence",
    description:
      "We continually strive to learn, improve and raise our standards across our educational initiatives, creating an environment that encourages continuous growth.",
    tag: "Continuous Progress",
    icon: "award",
  },
  {
    title: "Values",
    description:
      "We aim to nurture responsible, disciplined and confident individuals who uphold strong values and contribute positively to their professions and society.",
    tag: "Character & Purpose",
    icon: "heart",
  },
];

export const aboutTrust: AboutTrustContent = {
  eyebrow: "Our Trust",
  heading:
    'Four pillars.<br><span class="text-accent-400">One purpose.</span>',
  intro:
    "The Trust oversees four educational institutions across the southern districts of Tamil Nadu. Our approach is guided by a commitment to quality, opportunity, excellence and values.",
  closingEyebrow: "STCET",
  closingLabel: "Our Approach",
  closingStatement:
    "Our institution is committed to creating a learning environment where students can develop the knowledge, skills and confidence required to navigate an evolving engineering landscape and build meaningful futures.",
  closingFooter: "Learn · Innovate · Grow",
  pillars: aboutTrustPillars,
};
