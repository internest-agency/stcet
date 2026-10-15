import Link from "next/link";
import Container from "@/src/components/ui/Container";
import type { Scholarship } from "@/src/generated/prisma/client";

export default function ManagedScholarships({ scholarships }: { scholarships: Scholarship[] }) {
  if (!scholarships.length) return null;
  return <section className="bg-white"><Container className="py-16 sm:py-20"><p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Current opportunities</p><h2 className="mt-4 text-3xl font-extrabold tracking-[-0.035em] text-primary-700 sm:text-4xl">Scholarships and support.</h2><div className="mt-10 grid gap-4 lg:grid-cols-2">{scholarships.map((item) => <article className="rounded-md border border-gray-200 p-6" key={item.id}><h3 className="text-xl font-bold text-gray-900">{item.name}</h3>{item.description ? <p className="mt-3 text-gray-600">{item.description}</p> : null}{item.eligibility ? <p className="mt-4 text-sm text-gray-700"><strong>Eligibility:</strong> {item.eligibility}</p> : null}{item.financialBenefit ? <p className="mt-2 text-sm text-gray-700"><strong>Benefit:</strong> {item.financialBenefit}</p> : null}{item.applicationUrl ? <Link className="mt-5 inline-flex text-sm font-bold text-primary-700 hover:text-primary-900" href={item.applicationUrl} rel="noreferrer" target="_blank">Official application link →</Link> : null}</article>)}</div></Container></section>;
}
