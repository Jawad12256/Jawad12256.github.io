import f1isHero from '../assets/f1is/hero.jpg';
import f1isBandsaw from '../assets/f1is/bandsaw.jpg';
import f1isCfd from '../assets/f1is/cfd.png';
import f1isFea from '../assets/f1is/fea.jpg';
import f1isTechnicalDrawing from '../assets/f1is/technicaldrawing.jpg';
import f1isStand from '../assets/f1is/stand.jpg';
import f1isTrack from '../assets/f1is/track.jpg';

import uksdcHero from '../assets/uksdc/hero.jpg';
import uksdcCertificates from '../assets/uksdc/certificates.jpg';
import uksdcElevatorRobots from '../assets/uksdc/elevatorrobots.jpeg';
import uksdcHighlights from '../assets/uksdc/highlights.jpeg';

import sroboHero from '../assets/srobo/hero.jpg';
import sroboGiraffery from '../assets/srobo/giraffery1.jpeg';
import sroboBuilding from '../assets/srobo/buildingrobot.jpeg';
import sroboOldRobot from '../assets/srobo/oldrobot.jpeg';
import sroboCommunity from '../assets/srobo/community.jpeg';
import sroboInAction from '../assets/srobo/robotinaction.mp4';

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
            'The UKSDC National Finals 2024 challenged me to work with a team of around 50 students I had never met before to design Arial, a lunar settlement. I proposed the design of autonomous construction and maintenance robots, including an innovative modular approach that enabled old, decommissioned hardware to be reused within a circular economy. For example, rather than allowing surplus ultrasonic stir welding robots to become redundant, their components could be repurposed for other construction requirements.\n\nI also explored the commercial potential for Arial to manufacture magnetoplasmadynamic (MPD) thrusters using lunar titanium reserves, reducing reliance on transporting materials from Earth. Our design secured National 1st Place, and I personally received the Quality of Visual Communication Award for my CAD and visualisation work.',

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
                src: uksdcElevatorRobots,
                alt: 'Autonomous construction robots concept',
                caption: 'Annotated renders of the autonomous construction and maintenance robots I proposed.'
            },
            {
                src: uksdcHighlights,
                alt: 'UK Space Design Competition National Finals highlights',
                caption: 'Highlights images from the UKSDC National Finals.'
            },
            {
                src: uksdcCertificates,
                alt: 'Team photo with National Finals certificates',
                caption: 'Our National Finals certificates.'
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
            'As Manufacturing Manager for my team, I was primarily responsible for CNC routing, high-quality finishing and component assembly. I also contributed to the iterative aerodynamic design process, using CFD analysis in Ansys Fluent to evaluate the car and its aerofoil. Our team developed a deep-learning algorithm interfacing with Ansys to optimise the aerofoil geometry, aiming to reduce drag while increasing downforce.\n\nAlongside the technical work, we produced marketing material and secured sponsorships to support our competition entry. Our efforts culminated in a Regional 1st Place finish.',

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
                src: f1isStand,
                alt: 'F1 in Schools car on its display stand',
                caption: 'Our original car prototype on its display stand.'
            },
            {
                src: f1isTrack,
                alt: 'F1 in Schools car on the race track',
                caption: 'Our latest car design on the competition race track.'
            },
            {
                src: f1isBandsaw,
                alt: 'Manufacturing process',
                caption: 'Workshop manufacturing and finishing.'
            },
            {
                src: f1isCfd,
                alt: 'CFD analysis',
                caption: 'Aerodynamic analysis using computational fluid dynamics.'
            },
            {
                src: f1isFea,
                alt: 'Finite element analysis',
                caption: 'Structural analysis of wheel spokes using finite element methods.'
            },
            {
                src: f1isTechnicalDrawing,
                alt: 'Technical engineering drawing',
                caption: 'Technical drawings for our car design.'
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

        heroImage: {
            src: sroboHero,
            alt: 'Our Student Robotics robot, Girafferey'
        },

        shortDescription:
            'Autonomous robotics competition involving the design, programming and manufacture of a two-wheel-drive robot.',

        description:
            'Working alongside my school robotics team, we designed, programmed and manufactured an autonomous two-wheel-drive robot to compete in the arena. The robot was tasked with identifying and stacking AprilTag-labelled boxes in designated zones. A months-long iterative design process led us to use two servo-controlled lifting and clamping arms. One challenge was preventing boxes from slipping out of the gripper, which we addressed by adding kitchen sponges to the arms to increase friction.\n\nOn the software side, I introduced an agile development approach to help the team develop control, sensing, navigation and strategy code in parallel. Our robot, Girafferey, competed in a series of 1v1v1v1 matches and reached the quarter-finals.',

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

        images: [
            {
                src: sroboHero,
                alt: 'Our Student Robotics robot, Girafferey',
                caption: 'Girafferey, our competition robot.'
            },
            {
                src: sroboGiraffery,
                alt: 'Girafferey, our two-wheel-drive robot',
                caption: 'A closer look at Girafferey and its lifting and clamping arms.'
            },
            {
                src: sroboBuilding,
                alt: 'Building the robot',
                caption: 'Building and assembling the robot in early iterations.'
            },
            {
                src: sroboOldRobot,
                alt: 'UFO-inspired competition robot design',
                caption: 'Our 2024 competition robot, inspired by UFOs.'
            },
            {
                src: sroboCommunity,
                alt: 'The Student Robotics community',
                caption: 'The wider Student Robotics community at the competition.'
            },
            {
                src: sroboInAction,
                alt: 'The robot competing in the arena',
                caption: 'Girafferey competing in the arena.'
            }
        ],

        links: {
            article:
                'https://www.saintolaves.net/81/latest-news/post/1115/student-robotics-over-easter'
        }
    }

];
