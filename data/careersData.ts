export interface CareerPostingItem {
  id: string;
  title: string;
  slug: string;
  posting_type: 'internship' | 'fresher' | 'full_time';
  category: string;
  department: string;
  work_mode: string;
  location: string;
  duration: string;
  is_paid: number;
  stipend: string;
  required_skills: string;
  eligibility: string;
  certificate_available: number;
  has_ppo: number;
  description: string;
  responsibilities: string;
  status?: string;
  created_at?: string;
}

export const CAREERS_DATA: CareerPostingItem[] = [
  {
    id: 'cp_web_dev_intern',
    title: 'Web Development Intern',
    slug: 'web-development-intern',
    posting_type: 'internship',
    category: 'Internship Opportunities',
    department: 'Engineering',
    work_mode: 'Remote',
    location: 'Remote (India)',
    duration: '3 Months (Extendable)',
    is_paid: 1,
    stipend: '₹15,000 - ₹22,000 / month',
    required_skills: 'React, Next.js, TypeScript, HTML5/CSS3, Tailwind CSS, REST APIs',
    eligibility: 'B.Tech, BCA, MCA, or related degree students / recent graduates with strong JS fundamentals',
    certificate_available: 1,
    has_ppo: 1,
    description: 'Collaborate with Spanyx core engineers to build responsive web applications, client portals, and modern interactive web experiences.',
    responsibilities: 'Develop high-performance UI components in React and Next.js; integrate backend REST and GraphQL endpoints; ensure cross-device mobile responsiveness.',
    status: 'published',
    created_at: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'cp_frontend_intern',
    title: 'Frontend Development Intern',
    slug: 'frontend-development-intern',
    posting_type: 'internship',
    category: 'Internship Opportunities',
    department: 'Engineering',
    work_mode: 'Remote',
    location: 'Remote (India)',
    duration: '3 Months',
    is_paid: 1,
    stipend: '₹15,000 - ₹20,000 / month',
    required_skills: 'TypeScript, React, Next.js, CSS Animations, Responsive Design, State Management',
    eligibility: 'Undergraduates or postgraduates with demonstrated frontend projects or GitHub repositories',
    certificate_available: 1,
    has_ppo: 1,
    description: 'Focus exclusively on clean design execution, micro-interactions, accessibility, and high-performance client rendering.',
    responsibilities: 'Translate Figma UI specifications into pixel-perfect components; optimize page rendering speeds and Core Web Vitals; build fluid animations.',
    status: 'published',
    created_at: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'cp_backend_intern',
    title: 'Backend Development Intern',
    slug: 'backend-development-intern',
    posting_type: 'internship',
    category: 'Internship Opportunities',
    department: 'Engineering',
    work_mode: 'Remote',
    location: 'Remote (India)',
    duration: '3 to 6 Months',
    is_paid: 1,
    stipend: '₹18,000 - ₹25,000 / month',
    required_skills: 'Node.js, TypeScript, PostgreSQL / SQLite, REST APIs, Redis, Docker basics',
    eligibility: 'Students or freshers with understanding of database normalization, indexing, and API security',
    certificate_available: 1,
    has_ppo: 1,
    description: 'Architect reliable backend services, database schemas, authentication systems, and microservices for high-concurrency client workloads.',
    responsibilities: 'Implement secure, parameterized database queries; build resilient API endpoints; write automated unit and integration tests.',
    status: 'published',
    created_at: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'cp_uiux_intern',
    title: 'UI/UX Design Intern',
    slug: 'ui-ux-design-intern',
    posting_type: 'internship',
    category: 'Internship Opportunities',
    department: 'Design',
    work_mode: 'Remote',
    location: 'Remote (India)',
    duration: '3 Months',
    is_paid: 1,
    stipend: '₹15,000 - ₹20,000 / month',
    required_skills: 'Figma, Design Systems, Wireframing, User Research, Typography, Prototyping',
    eligibility: 'Design students or self-taught designers with a strong design portfolio (Behance, Dribbble, or web)',
    certificate_available: 1,
    has_ppo: 1,
    description: 'Create intuitive, minimalist, Apple-inspired user experiences and design systems for enterprise software and web applications.',
    responsibilities: 'Craft wireframes, interactive prototypes, and high-fidelity mockups in Figma; conduct usability reviews; maintain design tokens.',
    status: 'published',
    created_at: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'cp_aiml_intern',
    title: 'AI/ML Intern',
    slug: 'ai-ml-intern',
    posting_type: 'internship',
    category: 'Internship Opportunities',
    department: 'Engineering',
    work_mode: 'Remote',
    location: 'Remote (India)',
    duration: '3 to 6 Months',
    is_paid: 1,
    stipend: '₹20,000 - ₹30,000 / month',
    required_skills: 'Python, PyTorch / TensorFlow, LangChain, LLM APIs, Vector Databases, Data Processing',
    eligibility: 'Students pursuing Computer Science, Data Science, or Mathematics with strong linear algebra and Python foundations',
    certificate_available: 1,
    has_ppo: 1,
    description: 'Work on cutting-edge generative AI workflows, agentic automation systems, and domain-specific LLM fine-tuning.',
    responsibilities: 'Build multi-step AI agent orchestrations; benchmark embeddings and retrieval pipelines; assist in fine-tuning internal automation models.',
    status: 'published',
    created_at: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'cp_mobile_intern',
    title: 'Mobile App Development Intern',
    slug: 'mobile-app-development-intern',
    posting_type: 'internship',
    category: 'Internship Opportunities',
    department: 'Engineering',
    work_mode: 'Remote',
    location: 'Remote (India)',
    duration: '3 Months',
    is_paid: 1,
    stipend: '₹15,000 - ₹22,000 / month',
    required_skills: 'Flutter / React Native, Dart / TypeScript, Mobile UI Patterns, State Management',
    eligibility: 'College students or freshers with at least one published or demonstrable mobile app on GitHub/stores',
    certificate_available: 1,
    has_ppo: 1,
    description: 'Develop high-performance cross-platform Android and iOS mobile applications with smooth 60fps animations.',
    responsibilities: 'Implement mobile UI screens from Figma; integrate native device APIs and push notifications; optimize memory and battery usage.',
    status: 'published',
    created_at: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'cp_digital_marketing_intern',
    title: 'Digital Marketing Intern',
    slug: 'digital-marketing-intern',
    posting_type: 'internship',
    category: 'Internship Opportunities',
    department: 'Marketing',
    work_mode: 'Remote',
    location: 'Remote (India)',
    duration: '3 Months',
    is_paid: 1,
    stipend: '₹12,000 - ₹18,000 / month',
    required_skills: 'SEO, Google Analytics, Content Marketing, Social Media Strategy, Growth Experimentation',
    eligibility: 'Passionate marketing, business, or communications students with strong analytical and writing skills',
    certificate_available: 1,
    has_ppo: 1,
    description: 'Execute organic growth initiatives, technical SEO optimizations, and B2B engagement campaigns for Spanyx solutions.',
    responsibilities: 'Analyze search trends and keyword opportunities; coordinate technical article distribution; measure campaign conversion metrics.',
    status: 'published',
    created_at: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'cp_bizdev_intern',
    title: 'Business Development Intern',
    slug: 'business-development-intern',
    posting_type: 'internship',
    category: 'Internship Opportunities',
    department: 'Business Development',
    work_mode: 'Hybrid',
    location: 'Bengaluru / Remote',
    duration: '3 to 6 Months',
    is_paid: 1,
    stipend: '₹15,000 - ₹25,000 / month + Incentives',
    required_skills: 'B2B Sales Communication, Lead Generation, Market Research, Client Presentations',
    eligibility: 'Final-year students or MBA/BBA graduates with excellent spoken and written communication',
    certificate_available: 1,
    has_ppo: 1,
    description: 'Identify enterprise partnership opportunities, engage institutional stakeholders, and assist in client discovery calls.',
    responsibilities: 'Research target universities and enterprises; draft tailored partnership briefs; coordinate initial technical qualification discussions.',
    status: 'published',
    created_at: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'cp_content_writing_intern',
    title: 'Content Writing Intern',
    slug: 'content-writing-intern',
    posting_type: 'internship',
    category: 'Internship Opportunities',
    department: 'Marketing',
    work_mode: 'Remote',
    location: 'Remote (India)',
    duration: '3 Months',
    is_paid: 1,
    stipend: '₹12,000 - ₹18,000 / month',
    required_skills: 'Technical Writing, Proofreading, Research, Storytelling, Software Domain Familiarity',
    eligibility: 'Students with exceptional English command and ability to explain complex technical concepts cleanly',
    certificate_available: 1,
    has_ppo: 1,
    description: 'Produce high-quality case studies, engineering documentation, and thought leadership articles for the Spanyx publications.',
    responsibilities: 'Interview engineering squad leads to synthesize technical case studies; write engaging website copy; ensure brand editorial consistency.',
    status: 'published',
    created_at: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'cp_junior_software_engineer',
    title: 'Associate Software Engineer',
    slug: 'associate-software-engineer',
    posting_type: 'fresher',
    category: 'Fresher Opportunities',
    department: 'Engineering',
    work_mode: 'Remote',
    location: 'Remote (India)',
    duration: 'Permanent Full-Time',
    is_paid: 1,
    stipend: '₹4.5L - ₹7.0L CTC',
    required_skills: 'TypeScript, React, Node.js, SQL, Git, Problem Solving',
    eligibility: 'Fresh graduates (2024 / 2025 / 2026 batch) with strong computer science fundamentals and projects',
    certificate_available: 0,
    has_ppo: 0,
    description: 'Join our core engineering squads as a full-time associate engineer building modern cloud platforms and enterprise web applications.',
    responsibilities: 'Build and ship full-stack web features; participate in architecture and code reviews; debug production issues.',
    status: 'published',
    created_at: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'cp_senior_cloud_architect',
    title: 'Senior Cloud & Systems Architect',
    slug: 'senior-cloud-systems-architect',
    posting_type: 'full_time',
    category: 'Full-Time Jobs',
    department: 'Engineering',
    work_mode: 'Remote',
    location: 'Remote (India)',
    duration: 'Permanent Full-Time',
    is_paid: 1,
    stipend: 'Competitive Executive Compensation',
    required_skills: 'AWS / GCP, Kubernetes, Terraform, Distributed Systems, High-Concurrency DBs',
    eligibility: '5+ years experience designing and operating multi-region distributed cloud platforms',
    certificate_available: 0,
    has_ppo: 0,
    description: 'Lead infrastructure design, zero-trust cloud security, and multi-region failover deployments across all Spanyx products.',
    responsibilities: 'Architect infrastructure-as-code deployments; implement automated disaster recovery; ensure sub-50ms global ingress response.',
    status: 'published',
    created_at: '2026-01-15T00:00:00.000Z',
  },
];

export function getHardcodedCareerPostings(filter?: { category?: string; search?: string }) {
  let list = CAREERS_DATA;
  if (filter?.category && filter.category !== 'All Opportunities') {
    if (filter.category === 'Remote Opportunities') {
      list = list.filter((p) => p.work_mode.toLowerCase().includes('remote'));
    } else {
      list = list.filter((p) => p.category === filter.category);
    }
  }
  if (filter?.search && filter.search.trim()) {
    const q = filter.search.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.required_skills.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q)
    );
  }
  return list;
}

export function getHardcodedCareerPostingBySlug(slug: string) {
  return CAREERS_DATA.find((p) => p.slug === slug);
}

