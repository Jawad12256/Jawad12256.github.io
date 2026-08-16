function ProjectCard({ project }) {
    return (
        <article className="project-card">

            <div className="project-card__top">

                <span className="project-card__category">
                    {project.category}
                </span>

                <span className="project-card__year">
                    {project.year}
                </span>

            </div>

            <h3>
                {project.title}
            </h3>

            <p>
                {project.description}
            </p>

            <div className="project-card__tags">

                {project.technologies.map((technology) => (
                    <span key={technology}>
                        {technology}
                    </span>
                ))}

            </div>

        </article>
    );
}

export default ProjectCard;