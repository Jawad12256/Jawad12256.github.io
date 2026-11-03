import { useState } from 'react';

import Section from '../components/Section';
import ProjectCard from '../components/ProjectCard';
import Card from '../components/Card';
import IdentityMarquee from '../components/IdentityMarquee';
import ContentModal from '../components/ContentModal';

import {
    profile,
    projects,
    experience,
    credentials,
    achievements,
    events
} from '../data';

import {
    normaliseProject,
    normaliseExperience,
    normaliseCredential,
    normaliseAchievement,
    normaliseEvent
} from '../utils/normaliseContent';

function Home() {
    const [activeItem, setActiveItem] = useState(null);

    const openItem = (item) => setActiveItem(item);
    const closeModal = () => setActiveItem(null);

    return (
        <div id="top">

            {/* Hero */}
            <section className="hero" id="top">

                <div className="container hero__inner">

                    <div className="hero__photo">
                        <img
                            src={profile.profilePhoto}
                            alt={`${profile.name} professional portrait`}
                        />
                    </div>

                    <div className="hero__content">

                        <p className="hero__eyebrow">
                            {profile.title}
                        </p>

                        <h1>
                            {profile.greeting}
                        </h1>

                        <p className="hero__description">
                            {profile.introduction}
                        </p>

                    </div>

                </div>

                <IdentityMarquee
                    items={profile.marqueeItems}
                />

            </section>

            {/* About */}
            <Section
                id="about"
                eyebrow="01 // ABOUT"
                title="A multidisciplinary engineer."
            >
                <p>
                    I'm a Design Engineering student at Imperial College
                    London with an interest in building things that sit
                    between engineering, software and design.
                </p>
            </Section>


            {/* Projects */}
            <Section
                id="projects"
                eyebrow="02 // PROJECTS"
                title="Things I've built."
            >
                <div className="project-grid">

                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onClick={() =>
                                openItem(normaliseProject(project))
                            }
                        />
                    ))}

                </div>
            </Section>


            {/* Experience */}
            <Section
                id="experience"
                eyebrow="03 // EXPERIENCE"
                title="Where I've worked."
            >
                <div className="card-grid">
                    {experience.map((item) => (
                        <Card
                            key={item.id}
                            item={normaliseExperience(item)}
                            onClick={() =>
                                openItem(normaliseExperience(item))
                            }
                        />
                    ))}
                </div>
            </Section>


            {/* Credentials */}
            <Section
                id="credentials"
                eyebrow="04 // CREDENTIALS"
                title="Certifications and qualifications."
            >
                <div className="card-grid">
                    {credentials.map((item) => (
                        <Card
                            key={item.id}
                            item={normaliseCredential(item)}
                            onClick={() =>
                                openItem(normaliseCredential(item))
                            }
                        />
                    ))}
                </div>
            </Section>


            {/* Achievements */}
            <Section
                id="achievements"
                eyebrow="05 // ACHIEVEMENTS"
                title="Competitions and awards."
            >
                <div className="card-grid">
                    {achievements.map((item) => (
                        <Card
                            key={item.id}
                            item={normaliseAchievement(item)}
                            onClick={() =>
                                openItem(normaliseAchievement(item))
                            }
                        />
                    ))}
                </div>
            </Section>


            {/* Events */}
            <Section
                id="events"
                eyebrow="06 // EVENTS"
                title="Things I've organised."
            >
                <div className="card-grid">
                    {events.map((item) => (
                        <Card
                            key={item.id}
                            item={normaliseEvent(item)}
                            onClick={() =>
                                openItem(normaliseEvent(item))
                            }
                        />
                    ))}
                </div>
            </Section>


            {/* Contact */}
            <Section
                id="contact"
                eyebrow="07 // CONTACT"
                title="Let's build something."
            >
                <p>
                    I'm always interested in interesting projects,
                    collaborations and opportunities.
                </p>
            </Section>

            <ContentModal item={activeItem} onClose={closeModal} />

        </div>
    );
}

export default Home;
