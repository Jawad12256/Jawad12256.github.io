import cfdHero from '../assets/pythonic-cfd/hero.jpg';
import cfdFlow from '../assets/pythonic-cfd/cfdFlow.mp4';
import cfdPressure from '../assets/pythonic-cfd/cfdPressure.mp4';
import code from '../assets/morsemaster/code.png';
import debug from '../assets/morsemaster/debug.jpg';
import FFT from '../assets/morsemaster/FFT.jpg';
import guidesign from '../assets/morsemaster/guidesign.jpg';
import guiplanning from '../assets/morsemaster/guiplanning.jpg';
import improvement from '../assets/morsemaster/improvement.jpg';
import oop from '../assets/morsemaster/oop.png';
import problemdecomposition from '../assets/morsemaster/problemdecomposition.png';
import problemdecomposition2 from '../assets/morsemaster/problemdecomposition2.png';
import testingplan from '../assets/morsemaster/testingplan.jpg';
import uml from '../assets/morsemaster/uml.png';
import megabiteHero from '../assets/megabite/hero.jpg';
import diagram from '../assets/megabite/diagram.jpg';
import dataanalysis from '../assets/megabite/dataanalysis.jpg';
import CVandelectronics from '../assets/megabite/CVandelectronics.jpg';
import iterativedesign from '../assets/megabite/iterativedesign.jpg';
import research from '../assets/megabite/research.jpg';
import usertesting from '../assets/megabite/usertesting.jpg';
import electronicsHero from '../assets/electronics-racecar/hero.jpeg';
import wiringdiagram from '../assets/electronics-racecar/wiringdiagram.jpg';
import demo from '../assets/electronics-racecar/demo.mp4';
import dataHero from '../assets/data-science/hero.jpg';
import notebook from '../assets/data-science/ipynb.jpg';
import projectabbreviated from '../assets/data-science/projectabbreviated.pdf';
import printingHero from '../assets/3d-printing/hero.png';
import headphonesstand from '../assets/3d-printing/headphonesstand.jpg';
import makerworld from '../assets/3d-printing/makerworld.jpg';
import bambu from '../assets/3d-printing/bambu.jpg';
import phonestand1 from '../assets/3d-printing/phonestand1.jpg';
import phonestand2 from '../assets/3d-printing/phonestand2.jpg';
import printing from '../assets/3d-printing/printing.mp4';
import minecraftHero from '../assets/minecraft/hero.jpg';
import back from '../assets/minecraft/back.jpg';
import greathall from '../assets/minecraft/greathall.jpg';
import newquad from '../assets/minecraft/newquad.jpg';
import paquad from '../assets/minecraft/paquad.jpg';
import room6 from '../assets/minecraft/room6.jpg';
import science from '../assets/minecraft/science.jpg';
import tabletennis from '../assets/minecraft/tabletennis.jpg';
import splatoonHero from '../assets/splatoon/hero.jpg';
import teamphoto from '../assets/splatoon/teamphoto.png';

export const projects = [
    {
        id: 'pythonic-cfd',
        title: 'Building CFD in Python',
        category: 'Computational Engineering',
        year: '2026',
        type: 'Personal Project',
        featured: true,
        heroImage: {
            src: cfdHero,
            alt: 'CFD simulation'
        },
        shortDescription:
            'With the power of Python, I built a computational fluid dynamics solver, exploring numerical solutions to the Navier-Stokes equations.',
        description:
            'This project stemmed from Dr Sam Cooper\'s inspiring lectures on finite difference methods for PDEs. Having a bit of experience with Python and some relevant libraries like numpy, I sought out to answer: how might we build CFD simulations mathematically grounded in the finite difference method?\n\nA few weeks of working through the Navier-Stokes equations, including Prof. Lorena A. Barba\'s excellent "12 steps to Navier-Stokes" guide, and I was knees-deep in Pythonic CFD. Numerical discretisation, boundary conditions, pressure-velocity coupling and optimisation - all accounted for in my code. My most interesting observation was how insanely computationally expensive it was to apply the divergence-free flow constraint, a cost I overcame with some clever use of jit compiling with numba.\n\nEventually, I landed on some of the simulations you can see above, including one that I benchmarked against a famous CFD benchmark case. The results were promising, and I was able to visualise the flow field and pressure distribution in a way that was both informative and visually appealing. Overall, an excellent deep dive into the rabbit hole of CFD and simulation engineering.',
        technologies: [
            'Python',
            'NumPy',
            'Numba'
        ],
        skills: [
            'Numerical Modelling',
            'Scientific Computing',
            'Computational Fluid Dynamics',
            'Numerical Methods',
            'Performance Optimisation',
            'Problem Solving'
        ],
        images: [
            {
                src: cfdHero,
                alt: 'CFD simulation',
                caption: 'Final CFD simulation'
            },
            {
                src: cfdFlow,
                alt: 'Flow field visualisation',
                caption: 'Visualisation of the flow field'
            },
            {
                src: cfdPressure,
                alt: 'Pressure distribution',
                caption: 'Pressure distribution across the domain'
            }
        ],
        links: {
            github: 'https://github.com/Jawad12256/Learning-CFD-with-Python'
        }
    },

    {
        id: 'morsemaster',
        title: 'MorseMaster',
        category: 'Software Development',
        year: '2025',
        type: 'A-Level Project',
        featured: true,
        heroImage: {
            src: guidesign,
            alt: 'MorseMaster GUI design'
        },
        shortDescription:
            'A Python-based tool for encoding/decoding Morse Code in text/sound forms, and under the hood: DSP, GUI design with tkinter, and multithreading concurrency.',
        description:
            'MorseMaster is a Python-based tool I developed over the course of 1 year for my A-Level Computer Science NEA. Research into existing Morse Code tools online revealed a lack of user-friendly interfaces and too many separate tools to deal with all the different forms of Morse Code. So I sought to make a single, unified build that handled not only text-based encoding, but also offered other forms like sound.\n\nSound decoding of Morse Code from a WAV file in particular presented interesting challenges that led me down a deep digital signal processing rabbit hole. I came out well-immersed in Fourier Transforms (DFT and FFT), Nyquist-Shannon sampling theorem, filtering, and windowing techniques. I also implemented a Morse Code keyer to let you tap in Morse Code with your keyboard, offering multiple modes to emulate different formats in real-life keying systems. Managing multiple threads here with Python\'s multithreading was also crucial to ensuring a smooth user experience here.\n\nI accompanied this with a "Challenge Mode", a game to let users test their skills, and a Networking interface to let users share their messages over LAN. I can\'t neglect the GUI design aspect either: this really took on a Design - Prototype - Test - Rebuild structure to really get it right! Overall, MorseMaster was a fantastic opportunity to apply my programming skills to a real-world problem, and I learned a lot about DSP, GUI design, and multithreading concurrency along the way.',
        technologies: [
            'Python',
            'Tkinter',
            'NumPy',
            'SciPy',
            'FFT',
            'Threading',
            'Networking'
        ],
        skills: [
            'Software Engineering',
            'Digital Signal Processing',
            'Algorithm Design',
            'Concurrency',
            'GUI Design',
            'Requirements Analysis',
            'Software Testing',
            'Problem Solving'
        ],
        images: [
            {
                src: code,
                alt: 'Annotated code screenshot',
                caption: 'Writing and justifying my input validation code for Morse Code text inputs.'
            },
            {
                src: debug,
                alt: 'Annotated code and debug screenshot',
                caption: 'Identifying and debugging an Index Error in my Morse Code text-parsing algorithms, coming up with an example fail case.'
            },
            {
                src: FFT,
                alt: 'Documentation of FFT mathematics and implementation',
                caption: 'Exploiting symmetries in the DFT enables faster computation via FFT, which I\'ve implemented in Python here.'
            },
            {
                src: guidesign,
                alt: 'Annotated GUI screenshots',
                caption: 'Designing my GUI with tkinter, I always had to consider user experience and follow common design standards to meet a user\'s expectations.'
            },
            {
                src: guiplanning,
                alt: 'Documentation of GUI planning',
                caption: 'Planning the grid layout and structure of my GUI before implementation.'
            },
            {
                src: improvement,
                alt: 'Table of possible improvements to MorseMaster',
                caption: 'Identifying possible improvements to MorseMaster, reflecting on the initial success criteria and limitations.'
            },
            {
                src: oop,
                alt: 'Annotated code screenshot of OOP implementation',
                caption: 'Using OOP principles was key to ensuring proper communication between my "backend" processing and "frontend" tkinter code, and to ensure my code was modular and maintainable.'
            },
            {
                src: problemdecomposition,
                alt: 'Flowchart of problem decomposition',
                caption: 'Decomposing the Morse Code parsing problem into smaller, manageable subproblems.'
            },
            {
                src: problemdecomposition2,
                alt: 'Flowchart of problem decomposition',
                caption: 'Decomposing the Morse Code parsing problem into smaller, manageable subproblems.'
            },
            {
                src: testingplan,
                alt: 'Screenshot of testing plan table',
                caption: 'Planning and documenting my unit testing strategy for MorseMaster, ensuring robustness in design.'
            },
            {
                src: uml,
                alt: 'UML diagram of MorseMaster OOP classes',
                caption: 'UML diagram showing the relationships between some of my OOP classes in MorseMaster.'
            },
        ],
        links: {
            github: 'https://github.com/Jawad12256/MorseMaster',
        }
    },

    {
        id: 'megabite',
        title: 'MegaBite',
        category: 'Human-Centred Design Engineering',
        year: '2026',
        type: 'University Project',
        featured: true,
        heroImage: {
            src: megabiteHero,
            alt: 'MegaBite'
        },
        shortDescription:
            'A gesture-controlled, hands-free robotic cooking assistant, developed in response to months of research into student challenges with food on campus.',
        description:
            'In my first year at Dyson School of Design Engineering, Imperial College London, I was part of a team of 6 students tasked with researching a problem area for students on campus, and designing, from scratch, a human-centred solution. We collected hundreds of insights and observations from our months-long discovery and research phase, leading us to eventually focus in on one thing.\n\nHow do students perceive learning to cook for the first time? Observations, interviews, co-design sessions - they all revealed one pattern. Chaos: scrolling through cluttered recipe websites, unlocking sticky phone screens, and constantly stopping to find the next step.\n\nWe designed MegaBite, a gesture-controlled, hands-free robotic cooking assistant. It uses a camera to detect hand gestures, uses LEDs for feedback lighting, and plays sound to give users the next cooking instruction. The Human-Computer Interface elements had to be considered carefully too: which gestures would do which navigation command, and was it intuitive?\n\nOur final prototype came as a result of a long process: iterative design, cobbled-together prototypes for testing, and a lot of user feedback. Overall, it was an incredibly challenging and rewarding project spanning nearly 6 months, and I learned a lot about human-centred design, prototyping, and user testing.',
        technologies: [
            'Python',
            'C++',
            'Google AI for Developers',
            'Arduino',
            'LEDs',
            'Figma'
        ],
        skills: [
            'Human-Centred Design',
            'Product Design',
            'User Research',
            'Interaction Design',
            'Prototyping',
            'User Testing',
            'Systems Design',
            'Teamwork'
        ],
        images: [
            {
                src: megabiteHero,
                alt: 'MegaBite',
                caption: 'Megabite, The gesture controlled assistant that keeps your mind on the recipe, your hands off the phone, and your eyes on what matters.'
            },
            {
                src: diagram, 
                alt: 'MegaBite Diagram',
                caption: 'Anootated diagram of Megabite, showing the key features of our hardware and integrated mobile application.'
            },
            {
                src: dataanalysis,
                alt: 'Data Analysis',
                caption: 'Data analysis pipeline, which we conducted during the research phase of our project.'
            },
            {
                src: CVandelectronics,
                alt: 'Computer Vision and Electronics',
                caption: 'Summary of our Computer Vision and Electronics integration in our prototypes.'
            },
            {
                src: iterativedesign,
                alt: 'Iterative Design',
                caption: 'Iterating our physical prototype design based on user feedback and physical testing of the mechanisms.'
            },
            {
                src: research,
                alt: 'Research',
                caption: 'Overview of our research timeline, and how each part contributed to our design decisions.'
            },
            {
                src: usertesting,
                alt: 'User Testing',
                caption: 'User testing sessions and gleaned insights, validating the functionality of MegaBite.'
            }
        ],
        links: {}
    },

    {
        id: 'electronics-1-rc-car',
        title: 'Electronics 1 RC Car',
        category: 'Electronics',
        year: '2026',
        type: 'University Project',
        featured: true,
        heroImage: {
            src: electronicsHero,
            alt: 'Electronics 1 RC Car'
        },
        shortDescription:
            'RC Car built with an ESP32 microcontroller, 3D printed chassis, and standard electronics components available in the lab.',
        description:
            'For my Electronics 1 module at Imperial College London, I was part of a team tasked with building an RC car from scratch. We used a Heltec ESP32 microcontroller connected to 2 standard TT motors, an MG996R servo, and a battery power supply, all mounted on a custom-modelled 3D printed chassis.\n\nWe fiddled with drivers to establish Bluetooth communication between the ESP32 and a Nintendo Switch Pro Controller, allowing us to control the RC car remotely. For extra style points, we mounted LEDs to the back of our car, acting as brake and indicator lights.\n\nOverall, it was a fun and challenging project that allowed us to apply our electronics and programming knowledge in a practical setting. PS. I\'d just had elbow surgery at the time, so I guess you could say I pulled it off single-handedly!',
        technologies: [
            'Python',
            'Fusion 360',
            '3D Printing',
            'Electronics',
            'ESP32',
            'Bluetooth'
        ],
        skills: [
            'Embedded Systems',
            'Electronics',
            'Circuit Design',
            'Mechanical Design',
            'Fusion 360',
            '3D Printing',
            'Bluetooth Communication',
            'Systems Integration'
        ],
        images: [
            {
                src: electronicsHero,
                alt: 'Electronics 1 RC Car',
                caption: 'Electronics 1 RC Car, built with an ESP32 microcontroller, 3D printed chassis, and standard electronics components available in the lab.'
            },

            {
                src: wiringdiagram,
                alt: 'Wiring Diagram',
                caption: 'Wiring diagram for the RC Car.'
            },

            {
                src: demo,
                alt: 'Demo Video',
                caption: 'Demo video of the RC Car in action.'
            }
        ],
        links: {}
    },

    {
        id: 'data-science',
        title: 'Data Science',
        category: 'Data Science',
        year: '2026',
        type: 'University Project',
        featured: true,
        heroImage: {
            src: dataHero,
            alt: 'Data Science Project'
        },
        shortDescription:
            'Data Science group project investigating what factors best predict university success in the QS World University Rankings 2025.',
        description:
            'In my Data Science module at Imperial College London, my team of 4 set out to investigate the QS World University Rankings 2025 dataset. We formulated an overarching question investigating how different factors might predict university success, and we used a variety of data science techniques to explore this.\n\nWe performed data cleaning and preprocessing, exploratory data analysis, and built predictive models using supervised machine learning algorithms. This included a multiple linear regression, logistic regression, decision trees, and random forests. We evaluated the performance of our models using metrics such as accuracy, precision, recall, and F1 score.\n\nWe also visualized our findings using various plots and charts to communicate our results effectively. Overall, this project allowed us to apply our data science skills to a real-world dataset.',
        technologies: [
            'Python',
            'Pandas',
            'NumPy',
            'Matplotlib',
            'Scikit-learn',
            'Jupyter Notebook'
        ],
        skills: [
            'Data Cleaning',
            'Exploratory Data Analysis',
            'Statistical Analysis',
            'Machine Learning',
            'Predictive Modelling',
            'Model Evaluation',
            'Data Visualisation',
            'Report Writing'
        ],
        images: [
            {
                src: dataHero,
                alt: 'Data Science Project',
                caption: 'Snippet of Data Science project report'
            },

            {
                src: notebook,
                alt: 'Jupyter Notebook',
                caption: 'Screenshot of the Jupyter Notebook code and results'
            },

            {
                src: projectabbreviated,
                alt: 'Project Report',
                caption: 'Abbreviated version of the project report'
            }
        ],
        links: {
            github: 'https://github.com/Jawad12256/QS-World-University-Rankings-2025-Analysis',
        }
    },

    {
        id: '3d-printing',
        title: '3D Printing',
        category: 'Engineering',
        year: '2026',
        type: 'Personal Project',
        featured: true,
        heroImage: {
            src: printingHero,
            alt: '3D-Printed phone stand'
        },
        shortDescription:
            'A series of models and products I\'ve CAD-modelled, sliced, and 3D-printed in my learning process.',
        description:
            'My journey with 3D Printing started in November 2024, when I got my hands on a Bambu Lab A1. While I\'d long known Fusion 360 and how to make CAD models to 3D print at my secondary school, this personal printer gave me a much closer look at the technical depth of FDM 3D-printing.\n\nOver the course of many months of projects, I learned on the fly: layer height, nozzles, materials and temperature considerations, slicers, overhangs, support structures, infill geometry, and tolerances. As I progress, I\'m also looking to expand to more advanced concepts, such as 4D-printing or designing flexibility into geometry based on materials.\n\nThroughout it all, I\'ve been uploading my models to MakerWorld, sharing my learning and engaging with the wonderful community there. I can\'t get over just how cool it is to see someone else print your model and try it out for themselves - that\'s honestly the best part of this all!',
        technologies: [
            'Fusion 360',
            '3D Printing',
            'Slicing Software',
            'Bambu Studio'
        ],
        skills: [
            'CAD Modelling',
            'Design for Additive Manufacturing',
            'Rapid Prototyping',
            'Iterative Design',
            'Manufacturing',
            'Problem Solving'
        ],
        images: [
            {
                src: printingHero,
                alt: '3D-Printed phone stand',
                caption: '3D-Printed phone stand, designed and printed by me.'
            },

            {
                src: bambu,
                alt: 'Screenshot of Bambu Studio slicer software',
                caption: '3D printing forced me to learn and experiment with slicing software and intricacies like layer height, infill types, seams, and support structures.'
            },

            {
                src: makerworld,
                alt: 'Screenshot of MakerWorld profile',
                caption: 'I\'ve been uploading my models to MakerWorld, sharing my learning and engaging with the wonderful community there.'
            },

            {
                src: phonestand1,
                alt: 'Annotated render of phone stand design in Fusion 360',
                caption: 'My phone stand features a slanted design for easier viewing and secure placement of the phone. I also show off the G-clamp mechanism and friction fit assembly, promoting flexibility and ease of use.'
            },

            {
                src: phonestand2,
                alt: 'Backside of phone stand',
                caption: 'A closer look at the G-clamp mechanism enabling my stand to stay secure regardless of the desk\'s thickness.'
            },

            {
                src: printing,
                alt: 'Video of 3D printing in progress',
                caption: 'A video of 3D printing in progress on my Bambu Lab A1.'
            },

            {
                // PLACEHOLDER caption — please review
                src: headphonesstand,
                alt: '3D-printed headphone stand',
                caption: 'A headphone stand I designed and 3D-printed.'
            }
        ],
        links: {
            makerworld: 'https://makerworld.com/en/@Jawad12256/upload'
        }
    },

    {
        id: 'minecraft',
        title: 'Minecraft recreation of St Olave\'s Grammar School',
        category: 'Gaming',
        year: '2025',
        type: 'Personal Project',
        featured: false,
        heroImage: {
            src: minecraftHero,
            alt: 'Minecraft recreation of St Olave\'s Grammar School'
        },
        shortDescription:
            'Recreating my school in Minecraft, block by block, using reference images and measurements to ensure accuracy.',
        description:
            'Me and my team of Year 13 leavers sought to digitise our favourite memories of St Olave\'s on our Survival Minecraft realm. A combination of analysing satellite images, looking through old photos and pulling from our memories guided us in accurately reconstructing the school.\n\nThis project demanded a variety of skills: using ratios to ensure reasonable dimensions, compromising when the available building supplies were limited, splitting workloads effectively to optimise the use of our time, etc.',
        technologies: [
            'Minecraft',
            'Google Earth',
        ],
        skills: [
            'Spatial Reasoning',
            'Visualisation',
            'Collaborative Planning',
            'Teamwork',
            'Problem Solving'
        ],
        images: [
            {
                src: minecraftHero,
                alt: 'Minecraft recreation of St Olave\'s Grammar School',
                caption: 'Minecraft recreation of St Olave\'s Grammar School, block by block, using reference images and measurements to ensure accuracy.'
            },

            {
                src: back,
                alt: 'Back view of Minecraft recreation',
                caption: 'A closer view at the back of our St Olave\'s Minecraft recreation, showing the Gym and Great Hall exteriors.'
            },

            {
                src: greathall,
                alt: 'Great Hall view',
                caption: 'A look inside the Great Hall. We used hanging signs to make the balcony railings!'
            },

            {
                src: newquad,
                alt: 'New Quad view',
                caption: 'Our recreated New Quad area, standing just outside the Music Block.'
            },

            {
                src: paquad,
                alt: 'PA Quad view',
                caption: 'The PA Quad and Holyoak Room, my favourite lunchtime hangout spot.'
            },

            {
                src: room6,
                alt: 'Room 6 view',
                caption: 'Inside Room 6, my form room during my GCSE studies.'
            },

            {
                src: science,
                alt: 'Science Block view',
                caption: 'An overhead look at the Science Block and ADT Block, showing the roof and skylights.'
            },

            {
                src: tabletennis,
                alt: 'Table Tennis view',
                caption: 'A table tennis table in our Minecraft recreation. Just missing the usual gaggle of Year 7s playing here during breaktime!'
            }
        ],
        links: {}
    },

    {
        id: 'splatoon',
        title: 'Competitive Splatoon 3',
        category: 'Gaming',
        year: '2026',
        type: 'Personal Project',
        featured: false,
        heroImage: {
            src: splatoonHero,
            alt: 'Splatoon 3 Hero Image'
        },
        shortDescription:
            'Competitive Splatoon 3 player, participating in tournaments, with a focus on teamwork, strategy, and communication.',
        description:
            'I\'ve been playing Splatoon 3 competitively for over a year now, participating in loads of tournaments and scrims. It might seem strange to talk about gaming as a portfolio project, but the transferable skills it\'s given me have made me both a better team player and a better community leader.\n\nI\'ve learned how to communicate effectively with my team, how to strategise and adapt to different situations, and how to stay calm under pressure. Recruiting freshers into our team this year, I\'ve also learned how to lead a team, how to motivate and support my teammates, and how to foster a positive team culture.\n\nFrom humble origins as a stray discord message in an Imperial Gaming server, I\'m proud of the skills I\'ve developed and the community I\'ve built together with others around competitive Splatoon 3.',
        technologies: [
            'Splatoon 3'
        ],
        skills: [
            'Teamwork',
            'Communication',
            'Strategic Thinking',
            'Leadership',
            'Adaptability'
        ],
        images: [
            {
                src: splatoonHero,
                alt: 'Splatoon 3 Hero Image',
                caption: 'Splatoon 3, a team-based third-person shooter game developed by Nintendo, where players control Inklings and Octolings to compete in turf wars and ranked battles.'
            },

            {
                src: teamphoto,
                alt: 'Team Photo',
                caption: 'Team photo of my competitive Splatoon 3 team, taken after winning the World 9 #29 tournament in 2026.'
            }
        ],
        links: {}
    }


]