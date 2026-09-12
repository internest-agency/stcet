import EEEHero from "@/src/components/sections/courses/eee/EEEHero";
import EEEOverview from "@/src/components/sections/courses/eee/EEEOverview";
import EEEOpportunities from "@/src/components/sections/courses/eee/EEEOpportunities";
import EEECareers from "@/src/components/sections/courses/eee/EEECareers";
import EEEWhyStudy from "@/src/components/sections/courses/eee/EEEWhyStudy";
import EEELearning from "@/src/components/sections/courses/eee/EEELearning";
import CourseCallToAction from "@/src/components/ui/CourseCallToAction";

export default function ComputerScienceEngineeringPage() {
  return (
    <>
      <EEEHero />
      <EEEOverview />
      <EEELearning />
      <EEEOpportunities />
      <EEEWhyStudy />
      <EEECareers />
      <CourseCallToAction
        heading={
          <>
            Understand power.
            <span className="text-accent-400"> Control systems.</span> Build a
            more connected and sustainable future.
          </>
        }
      />
    </>
  );
}
