import Section from '../components/Section';
import ProjectCard from '../components/ProjectCard';

import { projects } from '../data/portfolio';

function Home() {
    return (
        <div id="top">

            {/* Hero */}
            <section className="hero">
                <div className="container">

                    <p className="hero__eyebrow">
                        DESIGN ENGINEER // BUILDER // PROBLEM SOLVER
                    </p>

                    <h1>
                        Hi, I'm Jawad.
                    </h1>

                    <p className="hero__description">
                        I design, build and experiment across engineering,
                        software, robotics and everything in between.
                    </p>

                    <div className="hero__actions">
                        <a href="#projects">
                            View my work
                        </a>

                        <a href="#contact">
                            Get in touch
                        </a>
                    </div>

                </div>
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