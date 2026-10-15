export interface CourseContentSlide {
  number: string;
  title: string;
  description: string;
  image: string;
}

export interface CourseContentReason {
  number: string;
  title: string;
  description: string;
}

export interface CourseContentCareerGroup {
  number: string;
  title: string;
  roles: string[];
  image: string;
}

export interface CourseContent {
  name: string;
  degree: string;
  tagline: string;
  description: string;
  heroImage: string;
  overviewHeading: string;
  overviewParagraphs: string[];
  overviewKeyStatement: string;
  curriculumTitle: string;
  curriculumIntro: string;
  slides: CourseContentSlide[];
  opportunityTitle: string;
  opportunities: string[];
  whyStudyLabel: string;
  whyStudyHeading: string;
  whyStudyIntro: string;
  reasons: CourseContentReason[];
  careerTitle: string;
  careerIntro: string;
  careerGroups: CourseContentCareerGroup[];
}

export const courseContent: Record<string, CourseContent> = {
  "computer-science-engineering": {
    name: "Computer Science and Engineering",
    degree: "B.E.",
    tagline: "Think. Build. Transform.",
    description: "",
    heroImage: "/images/cse-hero-bg.webp",
    overviewHeading: "Computing is at the heart of today's digital world.",
    overviewParagraphs: [
      "Software, cloud platforms, mobile applications, cybersecurity, artificial intelligence and digital services all depend on computing technologies.",
      "The B.E. Computer Science and Engineering programme at STCET provides students with a strong foundation in computing, programming and software development while developing the analytical and problem-solving abilities required to address real-world challenges.",
    ],
    overviewKeyStatement:
      "The programme is designed to help students understand not only how technology works, but how it can be used to create solutions.",
    curriculumTitle: "Build your foundation in computing.",
    curriculumIntro:
      "The programme progresses from core programming and computational concepts to software development, systems, networking, cloud computing, cybersecurity and emerging technologies.",
    slides: [],
    opportunityTitle: "Explore the technologies shaping what comes next.",
    opportunities: [],
    whyStudyLabel: "Why Study CSE at STCET",
    whyStudyHeading: "Build the skills to shape the digital world",
    whyStudyIntro:
      "A strong foundation in computing gives students the knowledge, practical skills and flexibility to explore different areas of technology.",
    reasons: [],
    careerTitle: "From Learning to Leading What's Next.",
    careerIntro:
      "Computer Science opens pathways across software, cloud systems, data, cybersecurity and emerging technology domains.",
    careerGroups: [],
  },
  "electronics-communication-engineering": {
    name: "Electronics and Communication Engineering",
    degree: "B.E.",
    tagline: "Connecting Ideas. Powering Innovation.",
    description: "",
    heroImage: "/images/ece-hero-bg.webp",
    overviewHeading: "Connecting Ideas. Powering Innovation.",
    overviewParagraphs: [
      "From smartphones and communication networks to satellites, healthcare equipment, automobiles and intelligent devices, electronics and communication technologies are transforming the way the world connects and functions.",
      "The B.E. Electronics and Communication Engineering programme at STCET combines electronics, communication, computing and signal technologies to prepare students for a broad range of technological applications.",
      "Students develop an understanding of how electronic systems are designed, how information is processed and transmitted, and how hardware and software work together to create connected systems.",
    ],
    overviewKeyStatement: "",
    curriculumTitle: "Engineer the Technologies that connect the world.",
    curriculumIntro:
      "The programme progresses from electronic devices and circuits to communication systems, signal processing, embedded technologies, networking, wireless communication, VLSI and control systems.",
    slides: [
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
        image:
          "/images/courses/ece/learning/microprocessors-microcontrollers.webp",
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
    ],
    opportunityTitle:
      "Open doors to diverse careers in Electronics & Communication.",
    opportunities: [
      "Internet of Things",
      "Embedded Systems",
      "VLSI",
      "Robotics",
      "Automotive Electronics",
      "Wireless Technologies",
      "Signal & Image Processing",
      "Smart Devices",
    ],
    whyStudyLabel: "Why Study ECE at STCET",
    whyStudyHeading: "Turn Signals into Solutions",
    whyStudyIntro:
      "Build a strong foundation in electronics and communication while developing practical knowledge across hardware, software and emerging technologies.",
    reasons: [
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
    ],
    careerTitle: "Explore Futures in Tech",
    careerIntro:
      "ECE graduates have the flexibility to explore careers across electronics, communication, embedded systems, technology and software.",
    careerGroups: [
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
    ],
  },
  "electrical-electronics-engineering": {
    name: "Electrical and Electronics Engineering",
    degree: "B.E.",
    tagline: "Powering Technology. Enabling Tomorrow.",
    description: "",
    heroImage: "/images/eee-hero-bg.webp",
    overviewHeading: "Powering Technology. Enabling Tomorrow.",
    overviewParagraphs: [
      "Electricity powers modern life—from homes and industries to transportation, communication and emerging digital infrastructure. Electrical and Electronics Engineering plays a central role in designing, controlling and managing the systems that make this possible.",
      "The B.E. Electrical and Electronics Engineering programme at STCET provides students with a strong foundation in electrical systems, electronics, power technologies, control systems and automation.",
      "The programme combines fundamental engineering principles with contemporary applications, preparing students to understand and develop systems that generate, transmit, control and efficiently use electrical energy.",
    ],
    overviewKeyStatement:
      "Engineering intelligence to understand energy, shape electronic systems and build solutions that power a smarter world.",
    curriculumTitle:
      "Master the principles shaping electrical and electronic innovation.",
    curriculumIntro:
      "Students develop knowledge across electrical systems, electronics, power technologies, control systems, instrumentation, automation and emerging energy technologies.",
    slides: [
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
        image:
          "/images/courses/eee/learning/automation-industrial-control.webp",
      },
    ],
    opportunityTitle:
      "Find your place in the technologies powering the world ahead.",
    opportunities: [
      "Renewable Energy",
      "Electric Vehicles",
      "Smart Grids",
      "Power Electronics",
      "Industrial Automation",
      "Energy Management",
      "Battery Technologies",
      "Control Systems",
      "Smart Electrical Systems",
    ],
    whyStudyLabel: "Why Study EEE at STCET",
    whyStudyHeading:
      "Turn EEE into a world of private and public sector career possibilities.",
    whyStudyIntro:
      "Develop a strong foundation in electrical engineering while building practical knowledge across electronics, automation, energy technologies and modern electrical systems.",
    reasons: [
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
    ],
    careerTitle: "Build your future in electrical engineering.",
    careerIntro:
      "EEE graduates can pursue opportunities across core electrical industries, infrastructure, manufacturing, automation, energy and technology.",
    careerGroups: [
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
    ],
  },
  "information-technology": {
    name: "Information Technology",
    degree: "B.Tech.",
    tagline: "Transforming Information. Enabling Innovation.",
    description: "",
    heroImage: "/images/cse-ai-ml-hero-bg.webp",
    overviewHeading: "Technology That Solves Real-World Problems",
    overviewParagraphs: [
      "Information Technology is the technology layer behind the digital services people and organisations use every day. From cloud platforms and enterprise applications to cybersecurity, databases and digital services, IT connects technology with real-world needs.",
      "The B.Tech. Information Technology programme at STCET focuses on the development, management and application of computing technologies to solve problems across businesses, industries and society.",
    ],
    overviewKeyStatement:
      "While sharing a strong foundation with computer science, Information Technology places particular emphasis on using technology to develop, deploy and manage solutions in real-world environments.",
    curriculumTitle:
      "Learn how technology works, and how to put it to work.",
    curriculumIntro:
      "The programme progresses from programming and data structures to databases, web technologies, software engineering, networking, cloud computing, cybersecurity, data analytics and emerging technologies.",
    slides: [
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
    ],
    opportunityTitle:
      "Explore the technology landscape shaping what comes next.",
    opportunities: [
      "Cloud Computing",
      "Cybersecurity",
      "Data Analytics",
      "AI Applications",
      "Enterprise Technology",
      "Internet of Things",
      "Digital Transformation",
      "Web & Mobile Technologies",
    ],
    whyStudyLabel: "Why Study IT at STCET",
    whyStudyHeading: "Learn technology. Apply it intelligently.",
    whyStudyIntro:
      "Build a strong foundation in information technology while developing practical skills to apply contemporary digital technologies and create meaningful solutions.",
    reasons: [
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
    ],
    careerTitle: "From code to cloud, find your path in I.T.",
    careerIntro:
      "The broad nature of Information Technology allows graduates to work across software, technology services and digital businesses.",
    careerGroups: [
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
    ],
  },
  "computer-science-ai-ml": {
    name: "Computer Science and Engineering (AI & ML)",
    degree: "B.E.",
    tagline: "Learn. Predict. Innovate.",
    description: "",
    heroImage: "/images/cse-ai-ml-hero-bg.webp",
    overviewHeading: "Computing is at the heart of today's digital world.",
    overviewParagraphs: [
      "Artificial Intelligence and Machine Learning are transforming the way technology interacts with the world. From intelligent applications and automation to healthcare, finance, transportation and communication, AI is becoming an integral part of modern life.",
      "The B.E. Computer Science and Engineering (Artificial Intelligence & Machine Learning) programme at STCET brings together the foundations of computer science with the principles and applications of AI and ML. Students develop a strong understanding of computing while learning how machines can process information, identify patterns, learn from data and support intelligent decision-making.",
    ],
    overviewKeyStatement:
      "Turn data into intelligence. Turn intelligence into impact.",
    curriculumTitle: "Build your foundation in intelligent computing.",
    curriculumIntro:
      "The programme builds a strong foundation in areas such as programming, artificial intelligence, machine learning, data analytics, deep learning, natural language processing and computer vision.",
    slides: [
      {
        number: "01",
        title: "Programming & Computational Thinking",
        description:
          "Develop the logic, problem-solving, and coding skills to turn complex challenges into computational solutions.",
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
        image:
          "/images/courses/ai-ml/learning/deep-learning-neural-networks.webp",
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
    ],
    opportunityTitle: "Explore the possibilities of intelligent technology.",
    opportunities: [
      "Generative AI",
      "Computer Vision",
      "Natural Language Processing",
      "Robotics",
      "Intelligent Automation",
      "Data Analytics",
      "Deep Learning",
      "Responsible AI",
    ],
    whyStudyLabel: "Why Study CSE (AI+ML) at STCET",
    whyStudyHeading:
      "Build the skills to shape the future of intelligent technology.",
    whyStudyIntro:
      "Develop a strong foundation in computer science while building specialised knowledge and practical skills in artificial intelligence and machine learning.",
    reasons: [
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
    ],
    careerTitle: "Explore careers at the forefront of AI and ML.",
    careerIntro:
      "Graduates can explore opportunities across software and technology organisations as well as sectors increasingly adopting intelligent systems.",
    careerGroups: [
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
    ],
  },
};

export function getCourseContent(slug: string): CourseContent | undefined {
  return courseContent[slug];
}
