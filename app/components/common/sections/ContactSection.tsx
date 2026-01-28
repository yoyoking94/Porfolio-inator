import { useState } from 'react';

const ContactSection = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Ajouter logique d'envoi (EmailJS, API, etc.)
    };

    return (
        <section className="space-y-4">
            <h2 className="text-pixel-lg">Contact</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="text-pixel-sm block mb-1">Nom</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border-2 border-black px-2 py-1 text-pixel-sm"
                        required
                    />
                </div>
                <div>
                    <label className="text-pixel-sm block mb-1">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full border-2 border-black px-2 py-1 text-pixel-sm"
                        required
                    />
                </div>
                <div>
                    <label className="text-pixel-sm block mb-1">Message</label>
                    <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full border-2 border-black px-2 py-1 text-pixel-sm h-24"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 text-pixel-sm hover:bg-gray-800 transition-colors"
                >
                    Envoyer
                </button>
            </form>
        </section>
    );
};

export default ContactSection;
