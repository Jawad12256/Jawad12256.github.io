import Section from '../components/Section';
import ProjectCard from '../components/ProjectCard';
import Card from '../components/Card';
import IdentityMarquee from '../components/IdentityMarquee';
import Paragraphs from '../components/Paragraphs';
import LinkButton from '../components/LinkButton';
import { ImagesIcon } from '../components/icons/BrandIcons';
import { useModal } from '../context/ModalContext';

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
    const { openItem } = useModal();

    return (
        <div id="top">

            {/* Hero */}
            <section className="hero" id="top">

                <IdentityMarquee
                    items={profile.marqueeItems}
                />

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

                        <Paragraphs
                            text={profile.introduction}
                            className="hero__description"
                        />

                        <div className="hero__actions">
                            <LinkButton
                                to="/gallery"
                                icon={ImagesIcon}
                                label="See my Gallery"
                            />
                        </div>

                    </div>

                </div>

            </section>

            {/* Projects */}
            <Section
                id="projects"
                eyebrow="01 // PROJECTS"
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
                eyebrow="02 // EXPERIENCE"
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


            {/* Certifications, competitions, and awards */}
            <Section
                id="achievements"
                eyebrow="03 // CERTIFICATIONS, COMPETITIONS & AWARDS"
                title="Certifications, competitions, and awards."
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
                eyebrow="04 // EVENTS"
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
                eyebrow="05 // CONTACT"
                title="Let's build something."
            >
                <Paragraphs text={profile.contact} />

                <div className="contact-links">
                    {profile.links.github && (
                        <LinkButton
                            linkKey="github"
                            href={profile.links.github}
                        />
                    )}

                    {profile.links.linkedin && (
                        <LinkButton
                            linkKey="linkedin"
                            href={profile.links.linkedin}
                        />
                    )}

                    {profile.links.email && (
                        <LinkButton
                            linkKey="email"
                            href={profile.links.email}
                        />
                    )}
                </div>
            </Section>

        </div>
    );
}

export default Home;
