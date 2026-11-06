import awsHero from '../assets/aws-certification/hero.jpg';
import awsCertification from '../assets/aws-certification/certification.jpg';

export const credentials = [

    {
        id: 'aws-cloud-practitioner',

        title: 'AWS Certified Cloud Practitioner',

        issuer: 'Amazon Web Services',

        year: '2026',

        category: 'Certification',

        heroImage: {
            src: awsHero,
            alt: 'AWS Certified Cloud Practitioner'
        },

        description:
            'This certification validates foundational knowledge of cloud computing and AWS services, demonstrating the ability to effectively navigate and utilise AWS cloud solutions.',

        skills: [
            'Cloud Computing',
            'Cloud Architecture',
            'Cloud Security',
            'AWS Services',
            'Cloud Infrastructure'
        ],

        images: [
            {
                // PLACEHOLDER caption — please review
                src: awsHero,
                alt: 'AWS Certified Cloud Practitioner',
                caption: 'My AWS Certified Cloud Practitioner certification.'
            },
            {
                // PLACEHOLDER caption — please review
                src: awsCertification,
                alt: 'AWS Certified Cloud Practitioner certificate',
                caption: 'The AWS Certified Cloud Practitioner certificate.'
            }
        ],

        credentialUrl:
            'https://www.credly.com/badges/e24b1c11-8dde-4b10-a0e6-113dacc57923/linked_in?t=tiobn2'
    }

];
