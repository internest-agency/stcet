import CourseHero from "@/src/components/sections/courses/CourseHero";
import CurriculumExplorer, {
  type CurriculumSlide,
} from "@/src/components/sections/courses/CurriculumExplorer";
import CourseCallToAction from "@/src/components/ui/CourseCallToAction";
import OpportunityAreas from "@/src/components/sections/courses/OpportunityAreas";
import CareerPathways, {
  CareerGroup,
  FuturePath,
} from "@/src/components/sections/courses/CareerPathways";
import WhyStudy, {
  type WhyStudyReason,
} from "@/src/components/sections/courses/WhyStudy";
import CourseOverview from "@/src/components/sections/courses/CourseOverview";

const careerGroups: CareerGroup[] = [
  {
    number: "01",
    title: "Software Development",
    roles: ["Software Developer", "Application Developer"],
    image: "/images/courses/it/roles/software-development.webp",
  },
  {
    number: "02",
    title: "Web Technologies",
    roles: ["Web Developer", "Application Developer"],
    image: "/images/courses/it/roles/web-technologies.webp",
  },
  {
    number: "03",
    title: "Cloud & Systems",
    roles: ["Cloud Engineer", "Systems Analyst"],
    image: "/images/courses/it/roles/cloud-and-systems.webp",
  },
  {
    number: "04",
    title: "Data & Databases",
    roles: ["Data Analyst", "Database Administrator"],
    image: "/images/courses/it/roles/data-and-databases.webp",
  },
  {
    number: "05",
    title: "Networks & Cybersecurity",
    roles: ["Network Engineer", "Cybersecurity Analyst"],
    image: "/images/courses/it/roles/networks-cybersecurity.webp",
  },
  {
    number: "06",
    title: "IT Services & DevOps",
    roles: ["IT Consultant", "DevOps Professional"],
    image: "/images/courses/it/roles/it-services-devops.webp",
  },
];

const futurePaths: FuturePath[] = [
  {
    number: "01",
    title: "Higher Studies",
    description:
      "Pursue higher studies to deepen knowledge and specialise in computing, information systems, data, cloud and cybersecurity.",
  },
  {
    number: "02",
    title: "Specialised Certifications",
    description:
      "Build specialised expertise through professional certifications across computing, information systems, data, cloud and cybersecurity.",
  },
  {
    number: "03",
    title: "Continuous Technology Learning",
    description:
      "Continue developing skills as technologies and digital business environments evolve.",
  },
];

const curriculum: CurriculumSlide[] = [
  {
    number: "01",
    title: "Programming",
    description:
      "Build a strong foundation in programming concepts, computational thinking and problem-solving techniques used to develop practical technology solutions.",
    image: "/images/courses/it/learning/programming.webp",
  },
  {
    number: "02",
    title: "Data Structures & Algorithms",
    description:
      "Learn how to organise data and apply algorithmic techniques to solve problems efficiently and develop effective software solutions.",
    image: "/images/courses/it/learning/data-structures.webp",
  },
  {
    number: "03",
    title: "Database Technologies",
    description:
      "Explore database concepts, data modelling, SQL and database management techniques used to store, organise and retrieve information.",
    image: "/images/courses/it/learning/database-technologies.webp",
  },
  {
    number: "04",
    title: "Web Technologies",
    description:
      "Learn to design and develop modern web applications using front-end, back-end and web development technologies.",
    image: "/images/courses/it/learning/web-technologies.webp",
  },
  {
    number: "05",
    title: "Software Engineering",
    description:
      "Understand software development processes, system design, testing and engineering practices for building reliable technology solutions.",
    image: "/images/courses/it/learning/software-engineering.webp",
  },
  {
    number: "06",
    title: "Computer Networks",
    description:
      "Develop knowledge of networking concepts, communication protocols and network infrastructure that enable connected digital systems.",
    image: "/images/courses/it/learning/computer-networks.webp",
  },
  {
    number: "07",
    title: "Operating Systems",
    description:
      "Understand how operating systems manage processes, memory, storage, files and other resources that support modern computing environments.",
    image: "/images/courses/it/learning/operating-systems.webp",
  },
  {
    number: "08",
    title: "Cloud Computing",
    description:
      "Explore cloud platforms, virtualisation, distributed infrastructure and modern cloud services used to deploy and scale digital solutions.",
    image: "/images/courses/it/learning/cloud-computing.webp",
  },
  {
    number: "09",
    title: "Cybersecurity",
    description:
      "Learn fundamental approaches to protecting systems, networks, applications and data against security threats and vulnerabilities.",
    image: "/images/courses/it/learning/cybersecurity.webp",
  },
  {
    number: "10",
    title: "Data Analytics & Information Systems",
    description:
      "Develop an understanding of data analytics and information systems to transform organisational data into useful insights and support effective decision-making.",
    image:
      "/images/courses/it/learning/data-analytics-information-systems.webp",
  },
  {
    number: "11",
    title: "Artificial Intelligence & Emerging Technologies",
    description:
      "Explore artificial intelligence and emerging technologies shaping the future of digital services, intelligent systems and technology-driven solutions.",
    image:
      "/images/courses/it/learning/artificial-intelligence-emerging-technologies.webp",
  },
];

const whyStudyDept: WhyStudyReason[] = [
  {
    number: "01",
    title: "Strong Foundation in Computing & IT",
    description:
      "Build a strong foundation across core computing and information technologies.",
  },
  {
    number: "02",
    title: "Practical Technology Applications",
    description:
      "Develop practical knowledge by applying technology concepts to real-world problems and applications.",
  },
  {
    number: "03",
    title: "Contemporary Digital Technologies",
    description:
      "Gain exposure to contemporary digital technologies shaping modern organisations and industries.",
  },
  {
    number: "04",
    title: "Application & Problem-Solving Skills",
    description:
      "Develop application development and problem-solving skills to create effective technology solutions.",
  },
  {
    number: "05",
    title: "Broad Career Possibilities",
    description:
      "Build skills that support diverse career opportunities across technology and digital sectors.",
  },
];

export default function ComputerScienceEngineeringPage() {
  return (
    <>
      <CourseHero
        image="/images/cse-ai-ml-hero-bg.webp"
        programmeLabel="B.Tech. Programme"
        heading="Information Technology"
        tagline="Transforming Information. Enabling Innovation."
        breadcrumbItems={[
          {
            label: "Courses",
            href: "/courses",
          },
          {
            label: "Information Technology",
          },
        ]}
      />
      <CourseOverview
        label="About the Programme"
        heading="Technology That Solves Real-World Problems"
        paragraphs={[
          {
            content:
              "Information Technology is the technology layer behind the digital services people and organisations use every day. From cloud platforms and enterprise applications to cybersecurity, databases and digital services, IT connects technology with real-world needs.",
          },
          {
            content: (
              <>
                The{" "}
                <strong className="font-extrabold text-primary-700">
                  B.Tech. Information Technology
                </strong>{" "}
                programme at STCET focuses on the development, management and
                application of computing technologies to solve problems across
                businesses, industries and society.
              </>
            ),
          },
        ]}
        keyStatement="While sharing a strong foundation with computer science, Information Technology places particular emphasis on using technology to develop, deploy and manage solutions in real-world environments."
      />
      <CurriculumExplorer
        title="Build your foundation in information technology."
        intro="The programme progresses from programming and data structures to databases, web technologies, software engineering, networking, cloud computing, cybersecurity, data analytics and emerging technologies."
        slides={curriculum}
      />
      <OpportunityAreas
        title="Explore the technology landscape shaping what comes next."
        data={[
          "Cloud Computing",
          "Cybersecurity",
          "Data Analytics",
          "AI Applications",
          "Enterprise Technology",
          "Internet of Things",
          "Digital Transformation",
          "Web & Mobile Technologies",
        ]}
      />
      <WhyStudy
        label="Why Study IT"
        heading="Learn technology. Apply it intelligently."
        intro="Build a strong foundation in information technology while
                developing practical skills to apply contemporary digital
                technologies and create meaningful solutions."
        reasons={whyStudyDept}
      />
      <CareerPathways
        careerTitle="Shape your IT future."
        careerIntro="The broad nature of Information Technology allows graduates to
                work across software, technology services and digital
                businesses."
        careerGroups={careerGroups}
        beyondTitle="Keep learning. Keep specialising."
        beyondIntro="Students can pursue higher studies and specialised
                certifications in computing, information systems, data, cloud
                and cybersecurity."
        futurePaths={futurePaths}
      />
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
