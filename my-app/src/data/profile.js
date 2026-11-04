import profilePhoto from '../assets/profile/profile.png';

const getAge = (birthDate) => {
  const today = new Date();
  return today.getFullYear() - birthDate.getFullYear() - (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()));
};
const age = getAge(new Date(2006, 9, 21));

export const profile = {
    name: 'Jawad Uddin',

    greeting: "Hi there, I'm Jawad.",

    title: 'Design Engineer',

    profilePhoto,

    introduction: [
        `I'm a ${age}-year-old design engineer who loves to build cool stuff, learn cool stuff, and teach cool stuff.`,
        'I have experience in CAD, programming, systems design, and visual communication, and I enjoy collaborating with teams to bring ideas to life.',
        'I love to wear many hats, apply my skills to new contexts, and grow while lifting others around me the best I can!'
    ],

    about: [
        'I\'m a Design Engineering student at Imperial College London with an interest in building things that sit between engineering, software and design.'
    ],

    contact: [
        'I\'m always interested in interesting projects, collaborations and opportunities.'
    ],

    marqueeItems: [
        'Design Engineer',
        '3D-Printing Enthusiast',
        'Software Developer',
        'Tutor',
        'Academic Representative',
        'Muslim',
        'Competitive Splatoon Player',
        'Video Editor',
        'UK Space Design National Champion'
    ],

    links: {
        github: 'https://github.com/Jawad12256',
        linkedin: 'https://www.linkedin.com/in/jawad-uddin-44332328b/',
        email: 'jawad.olavian@gmail.com'
    }
};