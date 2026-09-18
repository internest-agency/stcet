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
    title: "Electronics Engineering",
    roles: ["Electronics Engineer", "Hardware Design Engineer"],
    image: "/images/courses/ece/roles/electronics-engineering.webp",
  },
  {
    number: "02",
    title: "Embedded Systems",
    roles: ["Embedded Systems Engineer", "IoT Engineer"],
    image: "/images/courses/ece/roles/embedded-systems.webp",
  },
  {
    number: "03",
    title: "Communication & Networks",
    roles: ["Communication Engineer", "Network Engineer"],
    image: "/images/courses/ece/roles/communication-networks.webp",
  },
  {
    number: "04",
    title: "VLSI Design",
    roles: ["VLSI Design Engineer", "Test Engineer"],
    image: "/images/courses/ece/roles/vlsi-design.webp",
  },
  {
    number: "05",
    title: "Technology & Software",
    roles: ["Systems Engineer", "Software Professional"],
    image: "/images/courses/ece/roles/technology-software.webp",
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
        image="/images/ece-hero-bg.webp"
        programmeLabel="B.E. Programme"
        heading="Electronics and Communication Engineering"
        tagline="Connecting Ideas. Powering Innovation."
        breadcrumbItems={[
          {
            label: "Courses",
            href: "/courses",
          },
          {
            label: "Electronics and Communication Engineering",
          },
        ]}
      />
      <CourseOverview
        label="About the Programme"
        heading="Connecting Ideas. Powering Innovation."
        paragraphs={[
          {
            content:
              "From smartphones and communication networks to satellites, healthcare equipment, automobiles and intelligent devices, electronics and communication technologies are transforming the way the world connects and functions.",
          },
          {
            content: (
              <>
                The{" "}
                <strong className="font-extrabold text-primary-700">
                  B.E. Electronics and Communication Engineering
                </strong>{" "}
                programme at STCET combines electronics, communication,
                computing and signal technologies to prepare students for a
                broad range of technological applications.
              </>
            ),
          },
          {
            content:
              "Students develop an understanding of how electronic systems are designed, how information is processed and transmitted, and how hardware and software work together to create connected systems.",
          },
        ]}
      />
      <CurriculumExplorer
        title="Engineer the Technologies that connect the world."
        intro="The programme progresses from electronic devices and circuits to
                communication systems, signal processing, embedded technologies,
                networking, wireless communication, VLSI and control systems."
        slides={curriculum}
      />
      <OpportunityAreas
        title="Open doors to diverse careeers in Electronics & Communication."
        data={[
          "Internet of Things",
          "Embedded Systems",
          "VLSI",
          "Robotics",
          "Automotive Electronics",
          "Wireless Technologies",
          "Signal & Image Processing",
          "Smart Devices",
        ]}
      />
      <WhyStudy
        label="Why Study ECE at STCET"
        heading="Turn Signals into Solutions"
        intro="Build a strong foundation in electronics and communication while
                developing practical knowledge across hardware, software and
                emerging technologies."
        reasons={whyStudyDept}
      />
      <CareerPathways
        careerTitle="Explore Futures in Tech"
        careerIntro="ECE graduates have the flexibility to explore careers across
                electronics, communication, embedded systems, technology and
                software."
        careerGroups={careerGroups}
      />
    </>
  );
}
