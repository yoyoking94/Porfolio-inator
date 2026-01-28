const CompetencesSection = () => {
    const skills = [
        { name: 'React/Next.js', level: 80 },
        { name: 'TypeScript', level: 70 },
        { name: 'Tailwind CSS', level: 85 },
    ];

    return (
        <section className="space-y-4">
            <h2 className="text-pixel-lg">Compétences</h2>
            {skills.map((skill, index) => (
                <div key={index} className="mb-3">
                    <p className="text-pixel-sm mb-1">{skill.name}</p>
                    <div className="w-full bg-gray-300 h-4 border-2 border-black">
                        <div
                            className="bg-black h-full"
                            style={{ width: `${skill.level}%` }}
                        />
                    </div>
                </div>
            ))}
        </section>
    );
};

export default CompetencesSection;
