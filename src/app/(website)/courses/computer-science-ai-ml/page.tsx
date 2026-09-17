import CourseHero from "@/src/components/sections/courses/CourseHero";
import CourseOverview from "@/src/components/sections/courses/CourseOverview";
import OpportunityAreas from "@/src/components/sections/courses/OpportunityAreas";
import CareerPathways, {
  CareerGroup,
  FuturePath,
} from "@/src/components/sections/courses/CareerPathways";
import CourseCallToAction from "@/src/components/ui/CourseCallToAction";
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
      "Pursue postgraduate education to deepen knowledge and specialise in advanced areas of artificial intelligence, machine learning and data science.",
  },
  {
    number: "02",
    title: "Research",
    description:
      "Explore research opportunities and contribute to new ideas, technologies and intelligent solutions.",
  },
  {
    number: "03",
    title: "Specialised Learning",
    description:
      "Build specialised expertise through advanced learning in artificial intelligence, machine learning, data science and related areas.",
  },
];

const curriculum: CurriculumSlide[] = [
  {
    number: "01",
    title: "Programming & Computational Thinking",
    description:
      "Build a strong foundation in programming and computational thinking while developing the logical and problem-solving skills required for intelligent computing.",
    image: "/images/courses/ai-ml/learning/programming.webp",
  },
  {
    number: "02",
    title: "Data Structures & Algorithms",
    description:
      "Understand how data can be organised, processed and analysed while developing efficient algorithms for solving computational problems.",
    image: "/images/courses/ai-ml/learning/data-structures.webp",
  },
  {
    number: "03",
    title: "Database Management",
    description:
      "Learn how data is stored, organised, managed and retrieved through database concepts and technologies.",
    image: "/images/courses/ai-ml/learning/database-management.webp",
  },
  {
    number: "04",
    title: "Computer Networks & Operating Systems",
    description:
      "Develop an understanding of the systems and networks that support modern computing, communication and intelligent applications.",
    image: "/images/courses/ai-ml/learning/computer-networks.webp",
  },
  {
    number: "05",
    title: "Artificial Intelligence",
    description:
      "Explore the fundamental concepts of artificial intelligence and understand how intelligent systems can process information and support decision-making.",
    image: "/images/courses/ai-ml/learning/artificial-intelligence.webp",
  },
  {
    number: "06",
    title: "Machine Learning",
    description:
      "Learn how machines can learn from data, identify patterns and develop models that support prediction and intelligent decision-making.",
    image: "/images/courses/ai-ml/learning/machine-learning.webp",
  },
  {
    number: "07",
    title: "Data Analytics & Pattern Recognition",
    description:
      "Explore data analytics and pattern recognition techniques to discover meaningful relationships and insights from data.",
    image:
      "/images/courses/ai-ml/learning/data-analytics-pattern-recognition.webp",
  },
  {
    number: "08",
    title: "Deep Learning & Neural Networks",
    description:
      "Understand neural networks and deep learning approaches used to develop intelligent systems capable of learning from complex data.",
    image: "/images/courses/ai-ml/learning/deep-learning-neural-networks.webp",
  },
  {
    number: "09",
    title: "Natural Language Processing",
    description:
      "Explore how computers can process, understand and work with human language to build intelligent language-based applications.",
    image: "/images/courses/ai-ml/learning/natural-language-processing.webp",
  },
  {
    number: "10",
    title: "Computer Vision",
    description:
      "Learn how computer systems can process and interpret visual information to support intelligent applications and automated solutions.",
    image: "/images/courses/ai-ml/learning/computer-vision.webp",
  },
];

const whyStudyDept: WhyStudyReason[] = [
  {
    number: "01",
    title: "Strong Foundation in Computer Science",
    description:
      "Build a strong foundation across core computer science disciplines.",
  },
  {
    number: "02",
    title: "Specialised AI & Machine Learning",
    description:
      "Gain specialised exposure to artificial intelligence and machine learning.",
  },
  {
    number: "03",
    title: "Problem-Solving & Application",
    description:
      "Emphasis on problem-solving and applying concepts to practical challenges.",
  },
  {
    number: "04",
    title: "Emerging Technologies",
    description:
      "Opportunities to explore rapidly developing areas of intelligent technology.",
  },
  {
    number: "05",
    title: "Future-Ready Skills",
    description:
      "Focus on developing skills relevant to the evolving technology landscape.",
  },
];

export default function ComputerScienceEngineeringPage() {
  return (
    <>
      <CourseHero
        image="/images/cse-ai-ml-hero-bg.webp"
        programmeLabel="B.E. Programme"
        heading="Computer Science and Engineering (AI & ML)"
        tagline="Learn. Predict. Innovate."
        breadcrumbItems={[
          {
            label: "Courses",
            href: "/courses",
          },
          {
            label: "Computer Science and Engineering (AI & ML)",
          },
        ]}
      />
      <CourseOverview
        label="About the Programme"
        heading="Computing is at the heart of today's digital world."
        paragraphs={[
          {
            content:
              "Artificial Intelligence and Machine Learning are transforming the way technology interacts with the world. From intelligent applications and automation to healthcare, finance, transportation and communication, AI is becoming an integral part of modern life.",
          },
          {
            content: (
              <>
                The{" "}
                <strong className="font-extrabold text-primary-700">
                  B.E. Computer Science and Engineering (Artificial Intelligence
                  &amp; Machine Learning)
                </strong>{" "}
                programme at STCET brings together the foundations of computer
                science with the principles and applications of AI and ML.
                Students develop a strong understanding of computing while
                learning how machines can process information, identify
                patterns, learn from data and support intelligent
                decision-making.
              </>
            ),
          },
        ]}
      />
      <CurriculumExplorer
        title="Build your foundation in intelligent computing."
        intro="The programme builds a strong foundation in areas such as
                programming, artificial intelligence, machine learning, data
                analytics, deep learning, natural language processing and
                computer vision."
        slides={curriculum}
      />
      <OpportunityAreas
        title="Explore the possibilities of intelligent technology."
        data={[
          "Generative AI",
          "Computer Vision",
          "Natural Language Processing",
          "Robotics",
          "Intelligent Automation",
          "Data Analytics",
          "Deep Learning",
          "Responsible AI",
        ]}
      />
      <CareerPathways
        careerTitle="Build your future in intelligent technology."
        careerIntro="Graduates can explore opportunities across software and
                technology organisations as well as sectors increasingly
                adopting intelligent systems."
        careerGroups={careerGroups}
        beyondTitle="Keep learning. Keep growing."
        beyondIntro="The programme provides a foundation for higher studies and
                specialised learning in artificial intelligence, machine
                learning, data science and related areas."
        futurePaths={futurePaths}
      />
      <WhyStudy
        label="Why Study CSE (AI+ML)"
        heading="Build the skills to shape the future of intelligent technology."
        intro="Develop a strong foundation in computer science while building specialised knowledge and practical skills in artificial intelligence and machine learning."
        reasons={whyStudyDept}
      />
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
