/**
 * Bundled defaults for the public Governing Council section.
 *
 * These mirror the members that were previously hardcoded in
 * `GoverningCouncil.tsx`. They are only used to seed the
 * `GoverningCouncilMember` table the first time (see
 * `scripts/seed-governing-council.ts`); after that, the admin panel is the
 * source of truth and these values are never written again.
 */
export interface GoverningCouncilMemberContent {
  name: string;
  role: string;
  imagePath: string | null;
  biography: string | null;
}

export const governingCouncilMembers: GoverningCouncilMemberContent[] = [
  {
    name: "Shri. Murugesan T",
    role: "Chairman",
    imagePath: "/images/council/murugesan-t.jpg",
    biography: null,
  },
  {
    name: "Shri. Balakrishnan G",
    role: "Trust Nominee",
    imagePath: "/images/council/balakrishnan-g.jpg",
    biography: null,
  },
  {
    name: "Shri. Murugaiah A",
    role: "Trust Nominee",
    imagePath: "/images/council/murugaiah-a.jpg",
    biography: null,
  },
  {
    name: "Shri. Tamil Veeran R",
    role: "Academic Expert",
    imagePath: "/images/council/tamil-veeran-r.jpg",
    biography: null,
  },
  {
    name: "Shri. Bala Murugan C",
    role: "Academic Expert",
    imagePath: "/images/council/bala-murugan-c.jpg",
    biography: null,
  },
  {
    name: "Prof. Dr.Manikandan V",
    role: "Faculty from Affiliated College",
    imagePath: "/images/council/manikandan-v.jpg",
    biography: null,
  },
  {
    name: "Shri. Rajkumar C",
    role: "Industrial Expert",
    imagePath: "/images/council/rajkumar-c.jpg",
    biography: null,
  },
  {
    name: "Prof. Dr. Sundaram M",
    role: "Member Secretary (ex-officio)",
    imagePath: "/images/council/sundaram-m.jpg",
    biography: null,
  },
];
