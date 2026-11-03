import f1isHero from '../assets/f1is/hero.png';
import bandsaw from '../assets/f1is/bandsaw.png';
import cfd from '../assets/f1is/cfd.png';
import fea from '../assets/f1is/fea.png';
import technicaldrawing from '../assets/f1is/technicaldrawing.png';
import winner from '../assets/f1is/winner.png';

import uksdcHero from '../assets/uksdc/hero.png';
import mpdthruster from '../assets/uksdc/mpdthruster.png';
import photobioreactor from '../assets/uksdc/photobioreactor.png';
import technicaldrawing2 from '../assets/uksdc/technicaldrawing.png';

export const achievements = [

    {
        id: 'uk-space-design',
        title: 'UK Space Design Competition',
        category: 'Competition',
        year: '2024',

        award: 'National 1st Place',
        recognition: 'Quality of Visual Communication Award',

        heroImage: {
            src: uksdcHero,
            alt: 'UK Space Design Competition project'
        },

        shortDescription:
            'National-winning space settlement design competition, involving the design of a sustainable lunar settlement and its supporting infrastructure.',

        description:
            'The UKSDC National Finals 2024 challenged me to work with a team of around 50 students I had never met before to design Arial, a lunar settlement. I proposed the design of autonomous construction and maintenance robots, including an innovative modular approach that enabled old, decommissioned hardware to be reused within a circular economy. For example, rather than allowing surplus ultrasonic stir welding robots to become redundant, their components could be repurposed for other construction requirements. I also explored the commercial potential for Arial to manufacture magnetoplasmadynamic (MPD) thrusters using lunar titanium reserves, reducing reliance on transporting materials from Earth. Our design secured National 1st Place, and I personally received the Quality of Visual Communication Award for my CAD and visualisation work.',

        skills: [
            'Systems Design',
            'CAD',
            'Engineering Design',
            'Sustainability',
            'Visual Communication',
            'Problem Solving',
            'Teamwork',
            'Technical Presentation'
        ],

        images: [
            {
                src: uksdcHero,
                alt: 'UK Space Design Competition project',
                caption: 'Our National Finals space settlement design.'
            },
            {
                src: mpdthruster,
                alt: 'Magnetoplasmadynamic thruster design',
                caption: 'Proposed MPD thruster manufacturing using lunar resources.'
            },
            {
                src: photobioreactor,
                alt: 'Photobioreactor design',
                caption: 'A photobioreactor concept developed for the settlement.'
            },
            {
                src: technicaldrawing2,
                alt: 'Technical engineering drawing',
                caption: 'Technical drawings contributing to our visual design submission.'
            }
        ],

        links: {}
    },

    {
        id: 'f1-in-schools',
        title: 'F1 in Schools',
        category: 'Competition',
        year: '2024',

        award: 'Regional 1st Place',

        heroImage: {
            src: f1isHero,
            alt: 'F1 in Schools miniature race car'
        },

        shortDescription:
            'Competitive engineering project involving the design, analysis and manufacture of an F1-inspired miniature race car.',

        description:
            'As Manufacturing Manager for my team, I was primarily responsible for CNC routing, high-quality finishing and component assembly. I also contributed to the iterative aerodynamic design process, using CFD analysis in Ansys Fluent to evaluate the car and its aerofoil. Our team developed a deep-learning algorithm interfacing with Ansys to optimise the aerofoil geometry, aiming to reduce drag while increasing downforce. Alongside the technical work, we produced marketing material and secured sponsorships to support our competition entry. Our efforts culminated in a Regional 1st Place finish.',

        skills: [
            'CAD',
            'Computational Fluid Dynamics',
            'Finite Element Analysis',
            'Manufacturing',
            'CNC Machining',
            'Engineering Design',
            'Teamwork',
            'Sponsorship and Marketing'
        ],

        images: [
            {
                src: f1isHero,
                alt: 'F1 in Schools miniature race car',
                caption: 'Our F1 in Schools competition entry.'
            },
            {
                src: bandsaw,
                alt: 'Manufacturing process',
                caption: 'Workshop manufacturing and finishing.'
            },
            {
                src: cfd,
                alt: 'CFD analysis',
                caption: 'Aerodynamic analysis using computational fluid dynamics.'
            },
            {
                src: fea,
                alt: 'Finite element analysis',
                caption: 'Structural analysis using finite element methods.'
            },
            {
                src: technicaldrawing,
                alt: 'Technical engineering drawing',
                caption: 'Technical drawings for our car design.'
            },
            {
                src: winner,
                alt: 'F1 in Schools competition result',
                caption: 'Celebrating our Regional 1st Place result.'
            }
        ],

        links: {}
    },

    {
        id: 'student-robotics',
        title: 'Student Robotics',
        category: 'Competition',
        year: '2025',

        award: 'Quarter-Finalists',

        shortDescription:
            'Autonomous robotics competition involving the design, programming and manufacture of a two-wheel-drive robot.',

        description:
            'Working alongside my school robotics team, we designed, programmed and manufactured an autonomous two-wheel-drive robot to compete in the arena. The robot was tasked with identifying and stacking AprilTag-labelled boxes in designated zones. A months-long iterative design process led us to use two servo-controlled lifting and clamping arms. One challenge was preventing boxes from slipping out of the gripper, which we addressed by adding kitchen sponges to the arms to increase friction. On the software side, I introduced an agile development approach to help the team develop control, sensing, navigation and strategy code in parallel. Our robot, Girafferey, competed in a series of 1v1v1v1 matches and reached the quarter-finals.',

        skills: [
            'Robotics',
            'Autonomous Systems',
            'CAD',
            'Mechanical Design',
            'Embedded Programming',
            'Control Systems',
            'Teamwork',
            'Agile Development',
            'Problem Solving'
        ],

        images: [],

        links: {
            article:
                'https://www.saintolaves.net/81/latest-news/post/1115/student-robotics-over-easter'
        }
    }

];