import ITHero from "@/src/components/sections/courses/it/ITHero";
import ITOverview from "@/src/components/sections/courses/it/ITOverview";
import ITOpportunities from "@/src/components/sections/courses/it/ITOpportunities";
import ITCareers from "@/src/components/sections/courses/it/ITCareers";
import ITWhyStudy from "@/src/components/sections/courses/it/ITWhyStudy";
import ITLearning from "@/src/components/sections/courses/it/ITLearning";
import CourseCallToAction from "@/src/components/ui/CourseCallToAction";

export default function ComputerScienceEngineeringPage() {
  return (
    <>
      <ITHero />
      <ITOverview />
      <ITLearning />
      <ITOpportunities />
      <ITWhyStudy />
      <ITCareers />
      <CourseCallToAction
        heading={
          <>
            Learn Technology.
            <span className="text-accent-400">
              {" "}
              Apply it intelligently.
            </span>{" "}
            Create solutions that matter.
          </>
        }
      />
    </>
  );
}
