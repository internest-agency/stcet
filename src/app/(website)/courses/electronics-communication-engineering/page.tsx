import ECEHero from "@/src/components/sections/courses/ece/ECEHero";
import ECEOverview from "@/src/components/sections/courses/ece/ECEOverview";
import ECEOpportunities from "@/src/components/sections/courses/ece/ECEOpportunities";
import ECECareers from "@/src/components/sections/courses/ece/ECECareers";
import ECEWhyStudy from "@/src/components/sections/courses/ece/ECEWhyStudy";
import ECELearning from "@/src/components/sections/courses/ece/ECELearning";
import CourseCallToAction from "@/src/components/ui/CourseCallToAction";

export default function ComputerScienceEngineeringPage() {
  return (
    <>
      <ECEHero />
      <ECEOverview />
      <ECELearning />
      <ECEOpportunities />
      <ECEWhyStudy />
      <ECECareers />
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
