import Section from '../components/Section';
import ProjectCard from '../components/ProjectCard';
import IdentityMarquee from '../components/IdentityMarquee';
import { profile, projects } from '../data';

function Home() {
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
                {/* We'll build this next */}
            </Section>


            {/* Contact */}
            <Section
                id="contact"
                eyebrow="04 // CONTACT"
                title="Let's build something."
            >
                <p>
                    I'm always interested in interesting projects,
                    collaborations and opportunities.
                </p>
            </Section>

        </div>
    );
}

export default Home;