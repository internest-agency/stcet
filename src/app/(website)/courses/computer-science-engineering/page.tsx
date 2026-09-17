import CourseHero from "@/src/components/sections/courses/CourseHero";
import CourseOverview from "@/src/components/sections/courses/CourseOverview";
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

const careerGroups: CareerGroup[] = [
  {
    number: "01",
    title: "Artificial Intelligence & Machine Learning",
    roles: ["AI/ML Engineer", "Machine Learning Developer"],
    image: "/images/courses/ai-ml/roles/artificial-intelligence.webp",
  },
  {
    number: "02",
    title: "Data & Analytics",
    roles: ["Data Analyst", "Data Engineer"],
    image: "/images/courses/ai-ml/roles/dataset.webp",
  },
  {
    number: "03",
    title: "Software Engineering",
    roles: ["Software Engineer", "AI Application Developer"],
    image: "/images/courses/ai-ml/roles/software-development.webp",
  },
  {
    number: "04",
    title: "Natural Language Processing",
    roles: ["NLP Engineer"],
    image: "/images/courses/ai-ml/roles/natural-language-processing.webp",
  },
];

const futurePaths: FuturePath[] = [
  {
    number: "01",
    title: "Postgraduate Education",
    description:
      "Pursue postgraduate education to deepen knowledge and specialise in advanced areas of computing.",
  },
  {
    number: "02",
    title: "Research",
    description:
      "Explore research opportunities and contribute to new ideas, technologies and solutions.",
  },
  {
    number: "03",
    title: "Specialised Technology Certifications",
    description:
      "Build specialised expertise through professional certifications and continuous technology learning.",
  },
];

const curriculum: CurriculumSlide[] = [
  {
    number: "01",
    title: "Programming & Computational Thinking",
    description:
      "Master core logic, problem-solving techniques, and fundamental programming concepts to build a strong computing foundation.",
    image: "/images/courses/cse/learning/programming.webp",
  },
  {
    number: "02",
    title: "Data Structures & Algorithms",
    description:
      "Learn essential data organization and algorithmic strategies to solve complex problems efficiently and write optimized code.",
    image: "/images/courses/cse/learning/data-structures.webp",
  },
  {
    number: "03",
    title: "Object-Oriented Programming",
    description:
      "Understand modern software design using object-oriented principles like encapsulation, inheritance, polymorphism, and abstraction.",
    image: "/images/courses/cse/learning/object-oriented-programming.webp",
  },
  {
    number: "04",
    title: "Database Management Systems",
    description:
      "Explore relational databases, SQL, data modeling, and query processing to manage and secure organizational data.",
    image: "/images/courses/cse/learning/database-management.webp",
  },
  {
    number: "05",
    title: "Operating Systems",
    description:
      "Gain insight into resource management, process scheduling, memory allocations, and file systems driving modern computing devices.",
    image: "/images/courses/cse/learning/operating-systems.webp",
  },
  {
    number: "06",
    title: "Computer Networks",
    description:
      "Discover network architecture, routing protocols, data communication, and distributed system fundamentals.",
    image: "/images/courses/cse/learning/computer-networks.webp",
  },
  {
    number: "07",
    title: "Software Engineering",
    description:
      "Apply agile methodologies, system design principles, testing frameworks, and software development lifecycles.",
    image: "/images/courses/cse/learning/software-engineering.webp",
  },
  {
    number: "08",
    title: "Web & Application Development",
    description:
      "Design and build responsive front-end interfaces, robust backend APIs, and scalable mobile application experiences.",
    image: "/images/courses/cse/learning/web-development.webp",
  },
  {
    number: "09",
    title: "Cloud Computing",
    description:
      "Deploy, scale, and manage distributed infrastructure using virtualized environments and modern cloud services.",
    image: "/images/courses/cse/learning/cloud-computing.webp",
  },
  {
    number: "10",
    title: "Cybersecurity",
    description:
      "Study network security, cryptography, threat mitigation, and defensive mechanisms to protect digital infrastructure.",
    image: "/images/courses/cse/learning/cybersecurity.webp",
  },
  {
    number: "11",
    title: "Artificial Intelligence & Emerging Technologies",
    description:
      "Explore machine learning, neural networks, intelligent systems, and cutting-edge innovations transforming industry paradigms.",
    image: "/images/courses/cse/learning/artificial-intelligence.webp",
  },
];

const whyStudyDept: WhyStudyReason[] = [
  {
    number: "01",
    title: "Strong Foundation",
    description: "Strong foundation across core computing disciplines.",
  },
  {
    number: "02",
    title: "Programming & Problem-Solving",
    description: "Emphasis on programming and problem-solving.",
  },
  {
    number: "03",
    title: "Contemporary Technology",
    description: "Exposure to contemporary technology areas.",
  },
  {
    number: "04",
    title: "Practical Learning",
    description: "Opportunities for practical and project-based learning.",
  },
  {
    number: "05",
    title: "Specialised Skills",
    description:
      "Scope to build specialised skills according to individual interests.",
  },
];

export default function ComputerScienceEngineeringPage() {
  return (
    <>
      <CourseHero
        image="/images/cse-hero-bg.webp"
        programmeLabel="B.E. Programme"
        heading="Computer Science and Engineering"
        tagline="Think. Build. Transform."
        breadcrumbItems={[
          {
            label: "Courses",
            href: "/courses",
          },
          {
            label: "Computer Science and Engineering",
          },
        ]}
      />
      <CourseOverview
        label="About the Programme"
        heading="Computing is at the heart of today's digital world."
        paragraphs={[
          {
            content:
              "Computer Science is at the heart of today's digital world. Software, cloud platforms, mobile applications, cybersecurity, artificial intelligence and digital services all depend on computing technologies.",
          },
          {
            content: (
              <>
                The{" "}
                <strong className="font-extrabold text-primary-700">
                  B.E. Computer Science and Engineering
                </strong>{" "}
                programme at STCET provides students with a strong foundation in
                computing, programming and software development while developing
                the analytical and problem-solving abilities required to address
                real-world challenges.,
              </>
            ),
          },
        ]}
        keyStatement="The programme is designed to help students understand not only how technology works, but how it can be used to create solutions."
      />
      <CurriculumExplorer
        title="Build your foundation in computing."
        intro="The programme progresses from core programming and computational
                concepts to software development, systems, networking, cloud
                computing, cybersecurity and emerging technologies."
        slides={curriculum}
      />
      <OpportunityAreas
        title="Explore the technologies shaping what comes next."
        data={[
          "Software Development",
          "Cloud Computing",
          "Cybersecurity",
          "Data Engineering",
          "Artificial Intelligence",
          "Web Technologies",
          "Mobile Applications",
          "DevOps",
          "Emerging Computing Technologies",
        ]}
      />
      <WhyStudy
        label="Why Study CSE"
        heading="Build the skills to shape the digital world"
        intro="A strong foundation in computing gives students the knowledge,
                practical skills and flexibility to explore different areas of
                technology."
        reasons={whyStudyDept}
      />
      <CareerPathways
        careerTitle="Build your future in computing."
        careerIntro="Computer Science opens pathways across software, cloud systems,
                data, cybersecurity and emerging technology domains."
        careerGroups={careerGroups}
        beyondTitle="Keep learning. Keep growing."
        beyondIntro="The degree provides a foundation for postgraduate education,
                research, and specialised technology certifications."
        futurePaths={futurePaths}
      />
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
