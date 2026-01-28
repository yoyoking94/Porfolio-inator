const ParcoursSection = () => {
    const timeline = [
        { year: '2024-2026', title: 'Alternance Dev Web', company: 'Entreprise X' },
        { year: '2023-2024', title: 'Support Applicatif', company: 'Entreprise Y' },
    ];

    return (
        <section className="space-y-4">
            <h2 className="text-pixel-lg">Mon Parcours</h2>
            <div className="border-l-2 border-black pl-4">
                {timeline.map((item, index) => (
                    <div key={index} className="mb-4">
                        <p className="text-pixel-xs font-bold">{item.year}</p>
                        <p className="text-pixel-sm">{item.title}</p>
                        <p className="text-pixel-xs text-gray-600">{item.company}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ParcoursSection;
