function ProjectCard({ project, onClick }) {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick();
        }
    };

    return (
        <article
            className="project-card"
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={handleKeyDown}
        >

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
                {project.shortDescription}
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