const DEFAULT_PRICE = 99;

export const UNIVERSITIES = [
  { id: 'sppu', shortName: 'SPPU', name: 'Savitribai Phule Pune University' },
  { id: 'dbatu', shortName: 'DBATU', name: 'Dr. Babasaheb Ambedkar Technological University' }
];

export const YEARS = [
  { id: 'fy', label: 'FY', name: 'First Year', semesters: 'Sem 1 and 2' },
  { id: 'sy', label: 'SY', name: 'Second Year', semesters: 'Sem 3 and 4' },
  { id: 'ty', label: 'TY', name: 'Third Year', semesters: 'Sem 5 and 6' },
  { id: 'be', label: 'BE', name: 'Final Year', semesters: 'Sem 7 and 8' }
];

export const BRANCHES = [
  { id: 'computer-science', name: 'Computer Engineering / CSE' },
  { id: 'civil', name: 'Civil Engineering' },
  { id: 'mechanical', name: 'Mechanical Engineering' },
  { id: 'it', name: 'Information Technology' },
  { id: 'electrical', name: 'Electrical Engineering' },
  { id: 'entc', name: 'Electronics and Telecommunication' },
  { id: 'aids', name: 'AI and Data Science' }
];

export const CONTENT_KEYWORDS = [
  'Star Questions',
  'Important Notes',
  'Solved PYQs',
  'Upcoming Exam Focus',
  'High-Chance Questions',
  'Unit-Wise Answers',
  'Formula Sheets',
  'Last-Minute Revision'
];

export const CATALOG_SOURCES = {
  sppu:
    'SPPU 2019 pattern public syllabus PDFs for FE, SE, TE, and BE branches. SPPU 2024 pattern is still rolling forward, so owner should verify new-pattern branch updates before import.',
  dbatu:
    'DBATU affiliated-college syllabus pages for AY 2024-25 first year and AY 2025-26 NEP second-year branch syllabi, with projected higher-year NEP rows where published.'
};

const COMMON_FIRST_YEAR = [
  'Engineering Mathematics I',
  'Engineering Mathematics II',
  'Engineering Physics',
  'Engineering Chemistry',
  'Basic Electrical and Electronics Engineering',
  'Engineering Mechanics',
  'Engineering Graphics and Design',
  'Programming for Problem Solving',
  'Workshop and Manufacturing Practices',
  'Environmental Science',
  'Universal Human Values',
  'Project-Based Learning'
];

const CATALOG = {
  sppu: {
    common: {
      fy: COMMON_FIRST_YEAR
    },
    'computer-science': {
      sy: [
        'Discrete Mathematics',
        'Fundamentals of Data Structures',
        'Object Oriented Programming',
        'Computer Graphics',
        'Digital Electronics and Logic Design',
        'Engineering Mathematics III',
        'Data Structures and Algorithms',
        'Software Engineering',
        'Microprocessor',
        'Principles of Programming Languages'
      ],
      ty: [
        'Database Management Systems',
        'Theory of Computation',
        'Systems Programming and Operating Systems',
        'Computer Networks and Security',
        'Software Modeling and Design',
        'Data Science and Big Data Analytics',
        'Web Technology',
        'Artificial Intelligence',
        'Cloud Computing',
        'Internet of Things and Embedded Systems'
      ],
      be: [
        'Design and Analysis of Algorithms',
        'Machine Learning',
        'High Performance Computing',
        'Blockchain Technology',
        'Deep Learning',
        'Information and Cyber Security',
        'Natural Language Processing',
        'Business Intelligence',
        'Project Stage I',
        'Project Stage II'
      ]
    },
    it: {
      sy: [
        'Discrete Mathematics',
        'Logic Design and Computer Organization',
        'Data Structures and Algorithms',
        'Object Oriented Programming',
        'Computer Graphics',
        'Engineering Mathematics III',
        'Processor Architecture and Interfacing',
        'Database Management Systems',
        'Operating Systems',
        'Software Engineering'
      ],
      ty: [
        'Computer Networks',
        'Theory of Computation',
        'Web Technology',
        'Data Science and Analytics',
        'Software Engineering and Project Management',
        'Cloud Computing',
        'Artificial Intelligence',
        'Cyber Security',
        'Human Computer Interaction',
        'Internet of Things'
      ],
      be: [
        'Machine Learning',
        'Big Data Analytics',
        'Information Storage and Retrieval',
        'Blockchain Technology',
        'Deep Learning',
        'DevOps',
        'Information Security',
        'Project Stage I',
        'Project Stage II'
      ]
    },
    aids: {
      sy: [
        'Discrete Mathematics',
        'Data Structures',
        'Object Oriented Programming',
        'Computer Organization',
        'Database Management Systems',
        'Engineering Mathematics III',
        'Artificial Intelligence',
        'Probability and Statistics',
        'Python Programming',
        'Data Visualization'
      ],
      ty: [
        'Machine Learning',
        'Operating Systems',
        'Data Warehousing and Mining',
        'Computer Networks',
        'Deep Learning',
        'Natural Language Processing',
        'Big Data Analytics',
        'Cloud Computing',
        'Computer Vision',
        'Data Engineering'
      ],
      be: [
        'Generative AI',
        'Reinforcement Learning',
        'MLOps',
        'Information Security',
        'Business Intelligence',
        'AI Ethics',
        'Research Methodology',
        'Project Stage I',
        'Project Stage II'
      ]
    },
    civil: {
      sy: [
        'Engineering Mathematics III',
        'Building Technology and Architectural Planning',
        'Mechanics of Structures',
        'Fluid Mechanics',
        'Engineering Geology',
        'Surveying',
        'Concrete Technology',
        'Structural Analysis',
        'Geotechnical Engineering',
        'Hydraulics'
      ],
      ty: [
        'Structural Design I',
        'Transportation Engineering',
        'Hydrology and Water Resources Engineering',
        'Environmental Engineering',
        'Foundation Engineering',
        'Advanced Surveying',
        'Design of Steel Structures',
        'Quantity Surveying and Estimation',
        'Construction Management',
        'Water Supply Engineering'
      ],
      be: [
        'Design of Reinforced Concrete Structures',
        'Design of Steel Structures',
        'Transportation Engineering II',
        'Dams and Hydraulic Structures',
        'Advanced Foundation Engineering',
        'Environmental Engineering II',
        'Project Stage I',
        'Project Stage II'
      ]
    },
    mechanical: {
      sy: [
        'Engineering Mathematics III',
        'Solid Mechanics',
        'Fluid Mechanics',
        'Thermodynamics',
        'Manufacturing Processes',
        'Engineering Metallurgy',
        'Kinematics of Machinery',
        'Applied Thermodynamics',
        'Material Science',
        'Machine Drawing'
      ],
      ty: [
        'Design of Machine Elements I',
        'Heat Transfer',
        'Theory of Machines',
        'Turbo Machines',
        'Metrology and Quality Control',
        'Design of Machine Elements II',
        'Refrigeration and Air Conditioning',
        'Mechatronics',
        'Manufacturing Technology',
        'Industrial Engineering'
      ],
      be: [
        'Finite Element Analysis',
        'Computer Integrated Manufacturing',
        'Energy Engineering',
        'Automobile Engineering',
        'Operations Research',
        'Robotics',
        'Project Stage I',
        'Project Stage II'
      ]
    },
    electrical: {
      sy: [
        'Engineering Mathematics III',
        'Electrical Machines I',
        'Network Analysis',
        'Electrical Measurements and Instrumentation',
        'Analog and Digital Electronics',
        'Power Generation Technologies',
        'Material Science',
        'Electrical Machines II',
        'Power System I',
        'Control Systems'
      ],
      ty: [
        'Power System II',
        'Power Electronics',
        'Microcontroller Applications',
        'Electrical Machine Design',
        'High Voltage Engineering',
        'Utilization of Electrical Energy',
        'Switchgear and Protection',
        'Renewable Energy Systems',
        'Electric Drives',
        'PLC and SCADA'
      ],
      be: [
        'Power System Operation and Control',
        'Electrical Installation Design',
        'Smart Grid',
        'Electric and Hybrid Vehicles',
        'Industrial Drives and Control',
        'Energy Audit and Management',
        'Project Stage I',
        'Project Stage II'
      ]
    },
    entc: {
      sy: [
        'Engineering Mathematics III',
        'Signals and Systems',
        'Electronic Devices and Circuits',
        'Digital Electronics',
        'Network Theory',
        'Control Systems',
        'Analog Communication',
        'Microcontrollers',
        'Data Structures',
        'Electronic Circuits'
      ],
      ty: [
        'Digital Communication',
        'Digital Signal Processing',
        'Electromagnetic Field Theory',
        'Embedded Systems',
        'VLSI Design',
        'Computer Networks',
        'Power Electronics',
        'Information Theory and Coding',
        'Antenna and Wave Propagation',
        'Internet of Things'
      ],
      be: [
        'Mobile Communication',
        'Broadband Communication Systems',
        'Optical Fiber Communication',
        'Microwave Engineering',
        'Wireless Sensor Networks',
        'Machine Learning for Signal Processing',
        'Project Stage I',
        'Project Stage II'
      ]
    }
  },
  dbatu: {
    common: {
      fy: COMMON_FIRST_YEAR
    },
    'computer-science': {
      sy: [
        'Engineering Mathematics III',
        'Data Structures',
        'Discrete Mathematics',
        'Object-Oriented Programming',
        'Design and Analysis of Algorithms',
        'Computer Architecture and Organisation',
        'Probability and Statistics',
        'Python Programming'
      ],
      ty: [
        'Machine Learning',
        'Theory of Computation',
        'Operating Systems',
        'Database Management',
        'Software Engineering',
        'Compiler Design',
        'Data Communication and Computer Networks',
        'Internet of Things',
        'Big Data Analytics',
        'Computer Graphics',
        'Human Computer Interaction',
        'Deep Learning'
      ],
      be: [
        'Distributed Computing',
        'Natural Language Processing',
        'Advanced Algorithms',
        'Artificial Intelligence',
        'Cryptography and Network Security',
        'Computer Vision',
        'Blockchain Technology',
        'Virtual Reality',
        'AI Ethics',
        'Research Methodology',
        'Major Project'
      ]
    },
    aids: {
      sy: [
        'Engineering Mathematics III',
        'Data Structures',
        'Discrete Mathematics',
        'Artificial Intelligence',
        'Prompt Engineering',
        'Introduction to Operating Systems',
        'Data Analytics',
        'Probability and Statistics',
        'Full Stack Development'
      ],
      ty: [
        'Machine Learning',
        'Software Engineering and MLOps',
        'Theory of Computation',
        'Database Management Systems',
        'Vector Databases',
        'Human Computer Interaction',
        'Deep Learning',
        'Natural Language Processing',
        'Computer Vision',
        'Data Communication and Computer Networks',
        'Cyber Physical Systems'
      ],
      be: [
        'Internet of Things',
        'Graph Neural Networks',
        'Quantum Computing',
        'Optimization Techniques',
        'AI Ethics',
        'Generative AI',
        'AI for Social Good',
        'Business Analytics',
        'Research Methodology',
        'Major Project'
      ]
    },
    it: {
      sy: [
        'Engineering Mathematics III',
        'Data Structures',
        'Object Oriented Programming using Java',
        'IT Project Management',
        'Analysis of Algorithms',
        'Computer Organization and Architecture',
        'Discrete Mathematics',
        'Web Technology',
        'Innovation and Entrepreneurship'
      ],
      ty: [
        'Operating Systems',
        'Database Management Systems',
        'Computer Networks',
        'Software Engineering',
        'Machine Learning',
        'Cloud Computing',
        'Cyber Security',
        'Mobile Application Development',
        'Data Mining',
        'Internet of Things'
      ],
      be: [
        'Big Data Analytics',
        'Artificial Intelligence',
        'Blockchain Technology',
        'Information and Network Security',
        'DevOps',
        'Distributed Systems',
        'Research Methodology',
        'Major Project'
      ]
    },
    civil: {
      sy: [
        'Engineering Mathematics III',
        'Strength of Materials',
        'Surveying',
        'Building Planning and Drawing',
        'Fluid Mechanics',
        'Concrete Technology',
        'Structural Analysis',
        'Geotechnical Engineering',
        'Transportation Engineering',
        'Environmental Engineering'
      ],
      ty: [
        'Design of Concrete Structures',
        'Hydrology and Water Resources Engineering',
        'Foundation Engineering',
        'Construction Project Management',
        'Water and Wastewater Engineering',
        'Design of Steel Structures',
        'Irrigation Engineering',
        'Quantity Surveying and Valuation',
        'Open Channel Flow'
      ],
      be: [
        'Advanced Structural Design',
        'Bridge Engineering',
        'Advanced Transportation Engineering',
        'Disaster Management',
        'Environmental Impact Assessment',
        'Repair and Rehabilitation of Structures',
        'Research Methodology',
        'Major Project'
      ]
    },
    mechanical: {
      sy: [
        'Engineering Mathematics III',
        'Solid Mechanics',
        'Fluid Mechanics',
        'Thermodynamics',
        'Manufacturing Processes',
        'Material Science and Metallurgy',
        'Kinematics of Machinery',
        'Applied Thermodynamics',
        'Machine Drawing',
        'Measurements and Instrumentation'
      ],
      ty: [
        'Dynamics of Machinery',
        'Design of Machine Elements',
        'Heat Transfer',
        'Manufacturing Technology',
        'Industrial Engineering',
        'Refrigeration and Air Conditioning',
        'Mechatronics',
        'CAD/CAM',
        'Automobile Engineering'
      ],
      be: [
        'Finite Element Method',
        'Robotics and Automation',
        'Energy Engineering',
        'Operations Research',
        'Additive Manufacturing',
        'Computational Fluid Dynamics',
        'Research Methodology',
        'Major Project'
      ]
    },
    electrical: {
      sy: [
        'Engineering Mathematics III',
        'Electrical Circuit Analysis',
        'Electrical Machines I',
        'Analog and Digital Electronics',
        'Electrical Measurements',
        'Power Generation and Economics',
        'Electrical Machines II',
        'Power System I',
        'Control Systems',
        'Power Electronics'
      ],
      ty: [
        'Power System II',
        'Electrical Machine Design',
        'Microcontrollers and Applications',
        'High Voltage Engineering',
        'Electric Drives',
        'Switchgear and Protection',
        'Renewable Energy Systems',
        'Power System Operation and Control',
        'Utilization of Electrical Energy'
      ],
      be: [
        'Smart Grid',
        'Electric Vehicles',
        'Industrial Automation',
        'Energy Audit and Management',
        'FACTS and HVDC',
        'Advanced Power Electronics',
        'Research Methodology',
        'Major Project'
      ]
    },
    entc: {
      sy: [
        'Engineering Mathematics III',
        'Electronic Devices and Circuits',
        'Digital Logic Design',
        'Signals and Systems',
        'Network Analysis',
        'Analog Communication',
        'Microcontrollers',
        'Control Systems',
        'Data Structures',
        'Electronic Workshop'
      ],
      ty: [
        'Digital Communication',
        'Digital Signal Processing',
        'Embedded Systems',
        'VLSI Design',
        'Computer Communication Networks',
        'Antenna and Wave Propagation',
        'Information Theory and Coding',
        'Power Electronics',
        'Internet of Things'
      ],
      be: [
        'Wireless Communication',
        'Microwave Engineering',
        'Optical Communication',
        'Satellite Communication',
        'Image Processing',
        'Machine Learning Applications',
        'Research Methodology',
        'Major Project'
      ]
    }
  }
};

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function getUniversity(id) {
  return UNIVERSITIES.find((item) => item.id === id);
}

export function getYear(id) {
  return YEARS.find((item) => item.id === id);
}

export function getBranch(id) {
  return BRANCHES.find((item) => item.id === id);
}

export function getSubjectCatalogKey(universityId, yearId, branchId, name) {
  return `${universityId}:${yearId}:${branchId}:${name.toLowerCase().trim()}`;
}

export function makeCatalogSubject(universityId, yearId, branchId, name, index = 0) {
  const university = getUniversity(universityId);
  const year = getYear(yearId);
  const branch = getBranch(branchId);
  const sourcePattern = universityId === 'dbatu' ? 'DBATU NEP catalog' : 'SPPU 2019 pattern catalog';
  const catalogKey = getSubjectCatalogKey(universityId, yearId, branchId, name);

  return {
    id: `catalog-${universityId}-${yearId}-${branchId}-${slugify(name)}`,
    catalogKey,
    university: universityId,
    year: yearId,
    branch: branchId,
    name,
    description: `${university?.shortName || ''} ${year?.label || ''} ${branch?.name || ''} ${CONTENT_KEYWORDS.slice(0, 4).join(', ')} and solved PYQ packs.`,
    price: DEFAULT_PRICE + (index % 3) * 20,
    isPaid: true,
    active: true,
    catalogOnly: true,
    sourcePattern
  };
}

export function getCatalogSubjects(universityId, yearId, branchId) {
  const universityCatalog = CATALOG[universityId];
  if (!universityCatalog) return [];

  const commonSubjects = universityCatalog.common?.[yearId] || [];
  const branchSubjects = universityCatalog[branchId]?.[yearId] || [];
  const names = [...commonSubjects, ...branchSubjects];

  return names.map((name, index) => makeCatalogSubject(universityId, yearId, branchId, name, index));
}

export const ALL_CATALOG_SUBJECTS = UNIVERSITIES.flatMap((university) =>
  YEARS.flatMap((year) =>
    BRANCHES.flatMap((branch) => getCatalogSubjects(university.id, year.id, branch.id))
  )
);

export function getCatalogSubjectById(subjectId) {
  return ALL_CATALOG_SUBJECTS.find((subject) => subject.id === subjectId) || null;
}
