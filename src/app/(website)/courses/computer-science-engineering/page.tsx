import CSEHero from "@/src/components/sections/courses/cse/CSEHero";
import CSEOverview from "@/src/components/sections/courses/cse/CSEOverview";
import CSEOpportunities from "@/src/components/sections/courses/cse/CSEOpportunities";
import CSECareers from "@/src/components/sections/courses/cse/CSECareers";
import CSEWhyStudy from "@/src/components/sections/courses/cse/CSEWhyStudy";
import CSELearning from "@/src/components/sections/courses/cse/CSELearning";
import CourseCallToAction from "@/src/components/ui/CourseCallToAction";

export default function ComputerScienceEngineeringPage() {
  return (
    <>
      <CSEHero />
      <CSEOverview />
      <CSELearning />
      <CSEOpportunities />
      <CSEWhyStudy />
      <CSECareers />
      <CourseCallToAction
        heading={
          <>
            Build your foundation in computing.
            <span className="text-accent-400">
              {" "}
              Create solutions for the digital world.
            </span>
          </>
        }
      />
    </>
  );
}
