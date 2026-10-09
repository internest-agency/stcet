export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export const fallbackGalleryCategories = [
  "All",
  "Campus",
  "Academics",
  "Library",
  "Hostel",
  "Student Life",
];

export const fallbackGalleryItems: GalleryItem[] = [
  {
    id: 1,
    title: "Engineering Block",
    category: "Campus",
    image: "/images/gallery/stcet-engineering-block-entrance.jpg",
  },
  {
    id: 2,
    title: "Computer Laboratory",
    category: "Academics",
    image: "/images/gallery/stcet-computer-lab-1.jpg",
  },
  {
    id: 3,
    title: "Classroom",
    category: "Academics",
    image: "/images/gallery/stcet-classroom.jpg",
  },
  {
    id: 4,
    title: "College Library",
    category: "Library",
    image: "/images/gallery/stcet-college-library.jpg",
  },
  {
    id: 5,
    title: "Digital Library",
    category: "Library",
    image: "/images/gallery/stcet-library-computer.jpg",
  },
  {
    id: 6,
    title: "Boys Hostel",
    category: "Hostel",
    image: "/images/gallery/stcet-boys-hostel.jpg",
  },
  {
    id: 7,
    title: "Girls Hostel",
    category: "Hostel",
    image: "/images/gallery/stcet-girls-hostel.jpg",
  },
  {
    id: 8,
    title: "Girls Hostel Interior",
    category: "Hostel",
    image: "/images/gallery/stcet-girls-hostel-inside-1.jpg",
  },
  {
    id: 9,
    title: "Dining Hall",
    category: "Student Life",
    image: "/images/gallery/stcet-dining-hall.jpg",
  },
];
