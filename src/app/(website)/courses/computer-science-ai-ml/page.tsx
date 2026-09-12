import AIMLHero from "@/src/components/sections/courses/cse-ai-ml/AIMLHero";
import AIMLOverview from "@/src/components/sections/courses/cse-ai-ml/AIMLOverview";
import AIMLOpportunities from "@/src/components/sections/courses/cse-ai-ml/AIMLOpportunities";
import AIMLCareers from "@/src/components/sections/courses/cse-ai-ml/AIMLCareers";
import AIMLWhyStudy from "@/src/components/sections/courses/cse-ai-ml/AIMLWhyStudy";
import AIMLLearning from "@/src/components/sections/courses/cse-ai-ml/AIMLLearning";
import CourseCallToAction from "@/src/components/ui/CourseCallToAction";

export default function ComputerScienceEngineeringPage() {
  return (
    <>
      <AIMLHero />
      <AIMLOverview />
      <AIMLLearning />
      <AIMLOpportunities />
      <AIMLWhyStudy />
      <AIMLCareers />
      <CourseCallToAction
        heading={
          <>
            Learn the fundamentals.
            <span className="text-accent-400"> Explore intelligence.</span>{" "}
            Build what comes next.
          </>
        }
      />
    </>
  );
}
