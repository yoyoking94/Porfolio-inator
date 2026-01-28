const ProjetsSection = () => {
    const projects = [
        {
            id: 1,
            title: 'Portfolio Interactif',
            description: 'Site avec fenêtres draggables',
            tech: ['React', 'Next.js', 'TypeScript'],
            link: 'https://github.com/...',
        },
        {
            id: 2,
            title: 'App E-commerce',
            description: 'Boutique en ligne moderne',
            tech: ['React', 'Node.js', 'MongoDB'],
            link: 'https://github.com/...',
        },
    ];

    return (
        <section className="space-y-4">
            <h2 className="text-pixel-lg">Mes Projets</h2>
            <div className="grid gap-4">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="border-2 border-black p-4 hover:bg-gray-100 transition-colors"
                    >
                        <h3 className="text-pixel-sm font-bold mb-2">{project.title}</h3>
                        <p className="text-pixel-xs mb-2">{project.description}</p>
                        <div className="flex gap-2 mb-2">
                            {project.tech.map((tech, i) => (
                                <span
                                    key={i}
                                    className="bg-black text-white px-2 py-1 text-pixel-xs"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pixel-xs underline cursor-none hoverable"
                        >
                            Voir sur GitHub →
                        </a>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProjetsSection;
