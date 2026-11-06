import iosdcHero from '../assets/iosdc/hero.jpg';
import iosdcAssembly from '../assets/iosdc/assembly.jpg';
import iosdcDetails from '../assets/iosdc/details.jpg';
import iosdcRfp from '../assets/iosdc/rfp.jpg';

import iftarTitle from '../assets/interfaith-iftar/title.jpg';
import iftarDonutSale from '../assets/interfaith-iftar/donutsale.jpg';
import iftarHall1 from '../assets/interfaith-iftar/hall1.jpeg';
import iftarHall2 from '../assets/interfaith-iftar/hall2.jpeg';
import iftarHighlights from '../assets/interfaith-iftar/highlights.mp4';

export const events = [

    {
        id: 'iosdc',
        title: 'Interhouse Olaves Space Design Competition',
        shortTitle: 'IOSDC',
        year: '2024',
        role: 'Organiser',

        shortDescription:
            'Organised an inter-house space design competition, giving students the opportunity to collaborate on an engineering design challenge.',

        description:
            'Having been heavily inspired by the awesome UKSDC, I decided I wanted to bring it back to my school, St Olave\'s Grammar School. Hence, I led the organisation of the very first Interhouse Olaves Space Design Competition (IOSDC), an engineering-focused event designed to encourage students to collaborate and engage with space settlement design. We held an assembly where we not only showed off what UKSDC is all about, but also got students ot start thinking about what space technology might look like decades from now.\n\nThe competition itself was a huge success, with students from many year groups working together on excellent-quality proposals. Me and my judging panel were blown away! It was an amazing experience to see students so engaged and excited about engineering, and I hope its legacy will continue to inspire our future forward-thinking students.',

        skills: [
            'Event Organisation',
            'Leadership',
            'Teamwork',
            'Communication',
            'Engineering Outreach'
        ],

        heroImage: {
            src: iosdcHero,
            alt: 'Interhouse Olaves Space Design Competition'
        },

        images: [
            {
                // PLACEHOLDER caption — please review
                src: iosdcHero,
                alt: 'Interhouse Olaves Space Design Competition',
                caption: 'The first Interhouse Olaves Space Design Competition.'
            },
            {
                // PLACEHOLDER caption — please review
                src: iosdcAssembly,
                alt: 'Launch assembly for the competition',
                caption: 'The launch assembly introducing the competition to students.'
            },
            {
                // PLACEHOLDER caption — please review
                src: iosdcDetails,
                alt: 'Competition details',
                caption: 'The competition details and brief shared with participants.'
            },
            {
                // PLACEHOLDER caption — please review
                src: iosdcRfp,
                alt: 'Request for proposal brief',
                caption: 'The request-for-proposal brief students worked from.'
            }
        ],

        links: {}
    },

    {
        id: 'interfaith-iftar',
        title: 'Annual Interfaith Iftar',
        shortTitle: 'Interfaith Iftar',
        year: '2025',
        role: 'Student Team Lead',

        shortDescription:
            'Led the organisation of the Annual Interfaith Iftar at St Olave\'s Grammar School, welcoming over 200 guests and raising £2,600 for a refugee charity.',

        description:
            'I led a student team in organising our school\'s Annual Interfaith Iftar, bringing together over 200 guests for an evening centred on community, dialogue and charitable giving. Operationally speaking, this required well over a hundred hours in a huge variety of tasks leading up to the event. For example, we raised a starting sum of money for the event through doughnut sales to students: one of many necessities among many others like coordinating catering, decorations, auction items, speakers and entertainment, volunteers, publicity, and ticket sales. By maintaining strong communication between students, parents, and staff, while ensuring all logistical aspects fell into place timely, we sucessfully raised £2,600 for a refugee charity. The Interfaith Iftar at St Olave\'s has also previously been recognised by the Mayor of London, making it a particularly rewarding opportunity to bring people together around a shared charitable purpose.',

        skills: [
            'Leadership',
            'Event Management',
            'Team Coordination',
            'Communication',
            'Fundraising',
            'Community Engagement'
        ],

        heroImage: {
            src: iftarTitle,
            alt: 'Annual Interfaith Iftar'
        },

        images: [
            {
                // PLACEHOLDER caption — please review
                src: iftarTitle,
                alt: 'Annual Interfaith Iftar',
                caption: 'The Annual Interfaith Iftar at St Olave\'s Grammar School.'
            },
            {
                // PLACEHOLDER caption — please review
                src: iftarDonutSale,
                alt: 'Doughnut fundraising sale',
                caption: 'A doughnut sale that helped raise starting funds for the event.'
            },
            {
                // PLACEHOLDER caption — please review
                src: iftarHall1,
                alt: 'The event hall during the Iftar',
                caption: 'The hall during the Interfaith Iftar.'
            },
            {
                // PLACEHOLDER caption — please review
                src: iftarHall2,
                alt: 'The event hall during the Iftar',
                caption: 'Over 200 guests gathered for the evening.'
            },
            {
                // PLACEHOLDER caption — please review
                src: iftarHighlights,
                alt: 'Highlights from the Interfaith Iftar',
                caption: 'Highlights from the evening.'
            }
        ],

        links: {}
    }

];