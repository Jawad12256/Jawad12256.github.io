export const experience = [

    {
        id: 'software-internship',
        organisation: 'Gemba Advantage',
        role: 'Software Engineering Intern',
        period: 'Summer 2026',
        type: 'Internship',

        shortDescription:
            'Completed a 10-week software engineering internship, developing an individual full-stack security application before contributing to a collaborative, data-intensive ETL platform.',

        description:
            'Over 10 weeks at Gemba Advantage, I developed my software engineering skills through a combination of technical workshops, an individual full-stack project, and a collaborative group project. The first two weeks introduced me to professional development practices, DevOps, REST APIs and AWS cloud services, culminating in my AWS Certified Cloud Practitioner qualification.\n\nI then spent four weeks developing Trivyal, an individual full-stack application for centralising vulnerability scanning and management across developer code repositories. In the final four weeks, I joined five other interns to develop Cyphon, a data-processing platform built around an ETL pipeline capable of processing thousands of records per day.\n\nThis experience gave me valuable insight into professional software development: making architectural decisions, managing competing priorities, iterating in response to feedback, and collaborating across frontend and backend development.',

        technologies: [
            'JavaScript',
            'React',
            'Vite',
            'Tailwind CSS',
            'Node.js',
            'Express',
            'MongoDB',
            'AWS',
            'Docker',
            'Trivy',
            'AWS RDS',
            'AWS Neptune'
        ],

        skills: [
            'Full-Stack Development',
            'Frontend Development',
            'Backend Development',
            'REST API Design',
            'DevOps',
            'Cloud Computing',
            'Cybersecurity',
            'ETL Pipelines',
            'Database Design',
            'Software Architecture',
            'Agile Development',
            'Technical Communication',
            'Teamwork'
        ],

        projects: [
            {
                id: 'trivyal',
                title: 'Trivyal',

                shortDescription:
                    'An individual full-stack vulnerability management dashboard built around the Trivy security scanning tool.',

                description:
                    'My individual project during the internship was to develop a full-stack application that centralised the scanning, understanding, tracking, reporting and remediation of security vulnerabilities across developer code repositories. I built Trivyal around Trivy, a command-line vulnerability scanner, transforming its output into a more accessible and organised interface for developers.\n\nWorking from scratch, I learned and applied React, Vite and Tailwind CSS on the frontend, alongside Node.js, Express and MongoDB on the backend. I made architectural decisions, managed application secrets and Docker containers, and prioritised developer needs throughout the design process.\n\nFollowing four weeks of development, debugging, testing and evaluation, I presented the application to senior engineers and executives at Gemba Advantage and received positive feedback from developers on its potential for centralised vulnerability tracking.',

                technologies: [
                    'JavaScript',
                    'React',
                    'Vite',
                    'Tailwind CSS',
                    'Node.js',
                    'Express',
                    'MongoDB',
                    'Docker',
                    'Trivy'
                ],

                skills: [
                    'Full-Stack Development',
                    'Frontend Development',
                    'Backend Development',
                    'REST API Design',
                    'Cybersecurity',
                    'Vulnerability Management',
                    'Application Architecture',
                    'Requirements Analysis',
                    'Testing',
                    'Technical Presentation'
                ],

                images: [],

                links: {}
            },

            {
                id: 'cyphon',
                title: 'Cyphon',

                shortDescription:
                    'A collaborative ETL platform developed by six interns to process large datasets, identify patterns and present the results through a user interface.',

                description:
                    'For the final four weeks of my internship, I worked in a team of six interns to develop a fully working ETL pipeline designed to process thousands of records per day, identify patterns and present the resulting data through a user interface. During the final two weeks, we moved from a test dataset to a live API feed, ultimately logging over 70,000 records.\n\nI naturally gravitated towards frontend engineering, drawing on my experience with React from Trivyal to prototype and refine the user interface. I worked closely with backend teammates to align frontend requirements with the capabilities and performance constraints of our API. The team also made significant architectural decisions around containerised data-processing services and database technologies, selecting AWS RDS over DynamoDB and AWS Neptune to represent complex relationships using nodes and edges.\n\nThe project taught me a great deal about collaborative engineering: iterating on designs, communicating technical requirements, responding to backend feedback and adapting solutions to meet a tight delivery deadline.',

                technologies: [
                    'React',
                    'JavaScript',
                    'AWS',
                    'AWS RDS',
                    'AWS Neptune',
                    'Docker',
                    'REST APIs',
                    'ETL'
                ],

                skills: [
                    'Frontend Development',
                    'UI Design',
                    'Rapid Prototyping',
                    'API Integration',
                    'Database Design',
                    'Data Engineering',
                    'ETL Pipelines',
                    'Performance Optimisation',
                    'Technical Collaboration',
                    'Agile Development'
                ],

                images: [],

                links: {}
            }
        ],

        images: [],

        links: {
            linkedinTrivyal:
                'https://lnkd.in/p/eJQfSi88',

            linkedinCyphon:
                'https://lnkd.in/p/e8Z4tmNf'
        }
    },

    {
        id: 'tutoring',
        role: 'Private Tutor',
        period: '2024 - Present',
        type: 'Teaching',

        shortDescription:
            'Private GCSE and A-Level Maths and Physics tutor, using tailored explanations and metacognitive strategies to develop students\' understanding and exam confidence.',

        description:
            'I have tutored students in GCSE and A-Level Mathematics and Physics for several years, tailoring lessons to individual needs and levels of understanding. I place particular emphasis on metacognitive strategies: helping students recognise what a question is testing, anticipate common mistakes and understand how marks are awarded before attempting a problem.\n\nMy approach is therefore both exam-focused and student-centred, using targeted explanations, worked examples and reflection to build confidence and independent problem-solving skills. I take particular satisfaction in helping students develop a new perspective on a topic, rather than simply arriving at the correct answer.',

        technologies: [
            'Microsoft PowerPoint',
            'Desmos',
            'PhET Simulations'
        ],

        skills: [
            'Teaching',
            'Mentoring',
            'Communication',
            'Metacognition',
            'Lesson Planning',
            'Mathematical Problem Solving'
        ],

        images: [],

        links: {}
    },

    {
        id: 'academic-representative',
        role: 'Academic Representative',
        period: '2025 - Present',
        type: 'Leadership',

        shortDescription:
            'Representing my Design Engineering cohort at Imperial College London, communicating student feedback and advocating for improvements to the academic experience.',

        description:
            'I have served as Academic Representative for my Design Engineering undergraduate cohort at Imperial College London, acting as a link between students and departmental leadership. I represent cohort interests in Staff-Student Committee meetings, raise course and delivery issues with module leads, and support peers navigating university processes.\n\nBeyond formal representation, I have managed student communications, created supplementary academic resources such as exam walkthrough tutorials, and advocated for practical improvements to departmental facilities. The role has developed my ability to gather feedback, communicate concerns constructively and turn collective student experiences into actionable improvements.',

        technologies: [
            'Microsoft PowerPoint'
        ],

        skills: [
            'Leadership',
            'Student Representation',
            'Communication',
            'Stakeholder Engagement',
            'Advocacy',
            'Problem Solving',
            'Resource Development'
        ],

        images: [],

        links: {}
    }

];