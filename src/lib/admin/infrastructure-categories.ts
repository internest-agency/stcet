export const infrastructureFacilityCategories = [
  { value: "academic", label: "Academic Facilities" },
  { value: "laboratory", label: "Laboratories" },
  { value: "library", label: "Library & Learning Resources" },
  { value: "classroom", label: "Classrooms & Lecture Halls" },
  { value: "seminar", label: "Seminar & Conference Facilities" },
  { value: "computing", label: "Computing & IT Facilities" },
  { value: "research", label: "Research & Innovation" },
  { value: "hostel", label: "Hostel & Accommodation" },
  { value: "transport", label: "Transport Facilities" },
  { value: "sports", label: "Sports & Recreation" },
  { value: "student", label: "Student Facilities" },
  { value: "amenities", label: "Student Amenities" },
  { value: "canteen", label: "Canteen & Dining" },
] as const;

export type InfrastructureFacilityCategoryValue =
  (typeof infrastructureFacilityCategories)[number]["value"];

export const infrastructureFacilityCategoryValues = infrastructureFacilityCategories.map(
  (c) => c.value,
) as [InfrastructureFacilityCategoryValue, ...InfrastructureFacilityCategoryValue[]];

export function getCategoryLabel(value: string): string {
  const found = infrastructureFacilityCategories.find((c) => c.value === value);
  return found?.label ?? value;
}

export function isValidCategory(value: string): value is InfrastructureFacilityCategoryValue {
  return infrastructureFacilityCategoryValues.includes(
    value as InfrastructureFacilityCategoryValue,
  );
}