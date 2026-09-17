import CourseHero from "@/src/components/sections/courses/CourseHero";
import EEEOverview from "@/src/components/sections/courses/eee/EEEOverview";
import CourseCallToAction from "@/src/components/ui/CourseCallToAction";
import OpportunityAreas from "@/src/components/sections/courses/OpportunityAreas";
import CareerPathways, {
  CareerGroup,
  FuturePath,
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

const futurePaths: FuturePath[] = [
  {
    number: "01",
    title: "Higher Studies",
    description:
      "Pursue higher studies to deepen knowledge and specialise in advanced areas of electrical engineering.",
  },
  {
    number: "02",
    title: "Specialised Careers",
    description:
      "Build specialised careers in power systems, renewable energy, automation, control and related areas.",
  },
  {
    number: "03",
    title: "Advanced Engineering",
    description:
      "Continue developing expertise in emerging electrical technologies and advanced engineering applications.",
  },
];

const curriculum: CurriculumSlide[] = [
  {
    number: "01",
    title: "Electronic Devices & Circuits",
    description:
      "Understand electronic components, semiconductor devices and circuit principles used to design and develop electronic systems.",
    image: "/images/courses/ece/learning/electronic-devices-circuits.webp",
  },
  {
    number: "02",
    title: "Analog & Digital Electronics",
    description:
      "Explore analog and digital electronic circuits, logic systems and the principles behind modern electronic devices.",
    image: "/images/courses/ece/learning/analog-digital-electronics.webp",
  },
  {
    number: "03",
    title: "Digital Signal Processing",
    description:
      "Learn how digital signals are represented, processed and analysed for applications in communication, audio, imaging and intelligent systems.",
    image: "/images/courses/ece/learning/digital-signal-processing.webp",
  },
  {
    number: "04",
    title: "Communication Systems",
    description:
      "Study the principles of information transmission, modulation, communication channels and modern communication technologies.",
    image: "/images/courses/ece/learning/communication-systems.webp",
  },
  {
    number: "05",
    title: "Microprocessors & Microcontrollers",
    description:
      "Understand processor architectures, interfacing, programming and embedded control using microprocessors and microcontrollers.",
    image: "/images/courses/ece/learning/microprocessors-microcontrollers.webp",
  },
  {
    number: "06",
    title: "Embedded Systems",
    description:
      "Learn how hardware and software are integrated to develop embedded systems for connected and intelligent electronic applications.",
    image: "/images/courses/ece/learning/embedded-systems.webp",
  },
  {
    number: "07",
    title: "Computer Networks",
    description:
      "Explore networking fundamentals, data communication, network architecture and the technologies that connect computing and electronic systems.",
    image: "/images/courses/ece/learning/computer-networks.webp",
  },
  {
    number: "08",
    title: "Wireless Communication",
    description:
      "Understand wireless communication principles and technologies used to transmit information across modern communication networks.",
    image: "/images/courses/ece/learning/wireless-communication.webp",
  },
  {
    number: "09",
    title: "Antennas & Propagation",
    description:
      "Study antenna fundamentals, electromagnetic wave propagation and the technologies used in wireless and communication systems.",
    image: "/images/courses/ece/learning/antennas-propagation.webp",
  },
  {
    number: "10",
    title: "VLSI & Digital System Design",
    description:
      "Explore digital system design and VLSI concepts used to develop compact, high-performance integrated electronic systems.",
    image: "/images/courses/ece/learning/vlsi-digital-system-design.webp",
  },
  {
    number: "11",
    title: "Control & Instrumentation",
    description:
      "Learn measurement, instrumentation and control principles used to monitor, regulate and automate modern engineering systems.",
    image: "/images/courses/ece/learning/control-instrumentation.webp",
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
        keyStatement="Engineering intelligence to understand data, discover patterns and create intelligent solutions for a changing world."
      />
      <CurriculumExplorer
        title="Build your foundation in electrical engineering."
        intro="Students develop knowledge across electrical systems,
                electronics, power technologies, control systems,
                instrumentation, automation and emerging energy technologies."
        slides={curriculum}
      />
      <OpportunityAreas
        title="Explore the technologies shaping a smarter energy future."
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
        label="Why Study EEE"
        heading="Build the skills to power a connected and sustainable future."
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
        beyondTitle="Keep learning. Keep growing."
        beyondIntro="The programme provides a foundation for higher studies and
                specialised careers in power systems, renewable energy,
                automation, control and related areas."
        futurePaths={futurePaths}
      />
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
