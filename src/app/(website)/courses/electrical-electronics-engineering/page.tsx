import CourseHero from "@/src/components/sections/courses/CourseHero";
import OpportunityAreas from "@/src/components/sections/courses/OpportunityAreas";
import CareerPathways, {
  CareerGroup,
} from "@/src/components/sections/courses/CareerPathways";
import CurriculumExplorer, {
  type CurriculumSlide,
} from "@/src/components/sections/courses/CurriculumExplorer";
import WhyStudy, {
  type WhyStudyReason,
} from "@/src/components/sections/courses/WhyStudy";
import CourseOverview from "@/src/components/sections/courses/CourseOverview";

const careerGroups: CareerGroup[] = [
  {
    number: "01",
    title: "Electrical Engineering",
    roles: ["Electrical Engineer", "Electrical Design Engineer"],
    image: "/images/courses/eee/roles/electrical-engineering.webp",
  },
  {
    number: "02",
    title: "Power Systems",
    roles: ["Power Systems Engineer", "Power Electronics Engineer"],
    image: "/images/courses/eee/roles/power-systems.webp",
  },
  {
    number: "03",
    title: "Control & Automation",
    roles: ["Control Systems Engineer", "Automation Engineer"],
    image: "/images/courses/eee/roles/control-automation.webp",
  },
  {
    number: "04",
    title: "Energy & Renewables",
    roles: ["Renewable Energy Engineer", "Systems Engineer"],
    image: "/images/courses/eee/roles/renewable-energy.webp",
  },
  {
    number: "05",
    title: "Testing & Maintenance",
    roles: ["Electrical Testing Engineer", "Maintenance Engineer"],
    image: "/images/courses/eee/roles/testing-maintenance.webp",
  },
];

const curriculum: CurriculumSlide[] = [
  {
    number: "01",
    title: "Electrical Circuits & Systems",
    description:
      "Understand fundamental electrical concepts, circuit analysis and the behaviour of electrical systems used in engineering applications.",
    image: "/images/courses/eee/learning/electrical-circuits.webp",
  },
  {
    number: "02",
    title: "Electrical Machines",
    description:
      "Learn the principles and operation of electrical machines including transformers, motors and generators used across modern power applications.",
    image: "/images/courses/eee/learning/electrical-machines.webp",
  },
  {
    number: "03",
    title: "Power Systems",
    description:
      "Explore the generation, transmission, distribution and management of electrical power systems and their role in modern infrastructure.",
    image: "/images/courses/eee/learning/power-systems.webp",
  },
  {
    number: "04",
    title: "Power Electronics",
    description:
      "Study power semiconductor devices, converters and control techniques used to efficiently manage and convert electrical energy.",
    image: "/images/courses/eee/learning/power-electronics.webp",
  },
  {
    number: "05",
    title: "Control Systems",
    description:
      "Understand feedback, system modelling and control techniques used to regulate and automate electrical and engineering systems.",
    image: "/images/courses/eee/learning/control-systems.webp",
  },
  {
    number: "06",
    title: "Measurements & Instrumentation",
    description:
      "Develop knowledge of electrical measurements, sensors, instrumentation systems and techniques for accurate monitoring and analysis.",
    image: "/images/courses/eee/learning/measurements-instrumentation.webp",
  },
  {
    number: "07",
    title: "Digital Electronics",
    description:
      "Learn digital logic, combinational and sequential circuits and electronic systems that form the foundation of modern digital technology.",
    image: "/images/courses/eee/learning/digital-electronics.webp",
  },
  {
    number: "08",
    title: "Microcontrollers",
    description:
      "Explore microcontroller architecture, programming and interfacing to develop embedded and intelligent electronic applications.",
    image: "/images/courses/eee/learning/microcontrollers.webp",
  },
  {
    number: "09",
    title: "Electrical Drives",
    description:
      "Understand electric drive systems, motor control and power conversion techniques used in industrial and automated applications.",
    image: "/images/courses/eee/learning/electrical-drives.webp",
  },
  {
    number: "10",
    title: "Renewable Energy Systems",
    description:
      "Explore renewable energy technologies and their integration into modern electrical systems for efficient and sustainable power generation.",
    image: "/images/courses/eee/learning/renewable-energy.webp",
  },
  {
    number: "11",
    title: "Automation & Industrial Control",
    description:
      "Learn automation principles, industrial control systems and technologies used to improve efficiency, reliability and productivity.",
    image: "/images/courses/eee/learning/automation-industrial-control.webp",
  },
];

const whyStudyDept: WhyStudyReason[] = [
  {
    number: "01",
    title: "Strong Foundation in Electrical Engineering",
    description:
      "Build a strong foundation across core electrical engineering principles and systems.",
  },
  {
    number: "02",
    title: "Electrical & Electronic Concepts",
    description:
      "Develop an integrated understanding of electrical and electronic concepts and their applications.",
  },
  {
    number: "03",
    title: "Automation & Emerging Energy Technologies",
    description:
      "Gain exposure to automation and emerging technologies transforming the energy sector.",
  },
  {
    number: "04",
    title: "Practical & Application-Oriented Learning",
    description:
      "Learn through practical and application-oriented approaches that connect engineering concepts with real-world systems.",
  },
  {
    number: "05",
    title: "Core & Emerging Career Opportunities",
    description:
      "Develop skills that support diverse opportunities across both core electrical and emerging technology sectors.",
  },
];

export default function ComputerScienceEngineeringPage() {
  return (
    <>
      <CourseHero
        image="/images/eee-hero-bg.webp"
        programmeLabel="B.E. Programme"
        heading="Electrical and Electronics Engineering"
        tagline="Powering Technology. Enabling Tomorrow."
        breadcrumbItems={[
          {
            label: "Courses",
            href: "/courses",
          },
          {
            label: "Electrical and Electronics Engineering",
          },
        ]}
      />
      <CourseOverview
        label="About the Programme"
        heading="Powering Technology. Enabling Tomorrow."
        paragraphs={[
          {
            content:
              "Electricity powers modern life—from homes and industries to transportation, communication and emerging digital infrastructure. Electrical and Electronics Engineering plays a central role in designing, controlling and managing the systems that make this possible.",
          },
          {
            content: (
              <>
                The{" "}
                <strong className="font-extrabold text-primary-700">
                  B.E. Electrical and Electronics Engineering{" "}
                </strong>
                programme at STCET provides students with a strong foundation in
                electrical systems, electronics, power technologies, control
                systems and automation.
              </>
            ),
          },
          {
            content:
              "The programme combines fundamental engineering principles with contemporary applications, preparing students to understand and develop systems that generate, transmit, control and efficiently use electrical energy.",
          },
        ]}
        keyStatement="Engineering intelligence to understand energy, shape electronic systems and build solutions that power a smarter world."
      />
      <CurriculumExplorer
        title="Master the principles shaping electrical and electronic innovation."
        intro="Students develop knowledge across electrical systems,
                electronics, power technologies, control systems,
                instrumentation, automation and emerging energy technologies."
        slides={curriculum}
      />
      <OpportunityAreas
        title="Find your place in the technologies powering the world ahead."
        data={[
          "Renewable Energy",
          "Electric Vehicles",
          "Smart Grids",
          "Power Electronics",
          "Industrial Automation",
          "Energy Management",
          "Battery Technologies",
          "Control Systems",
          "Smart Electrical Systems",
        ]}
      />
      <WhyStudy
        label="Why Study EEE at STCET"
        heading="Turn EEE into a world of private and public sector career possibilities."
        intro="Develop a strong foundation in electrical engineering while
                building practical knowledge across electronics, automation,
                energy technologies and modern electrical systems."
        reasons={whyStudyDept}
      />
      <CareerPathways
        careerTitle="Build your future in electrical engineering."
        careerIntro="EEE graduates can pursue opportunities across core electrical
                industries, infrastructure, manufacturing, automation, energy
                and technology."
        careerGroups={careerGroups}
      />
    </>
  );
}
