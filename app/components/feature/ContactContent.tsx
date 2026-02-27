'use client';
import { sendContactEmail } from '@/app/lib/sendEmail';
import { useState } from 'react';

const ContactSection = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ success?: boolean; error?: string } | null>(null);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        setStatus(null);
        const result = await sendContactEmail(formData);
        setIsLoading(false);
        setStatus(result);
    };

    return (
        <div className="p-4">
            <h2 className="text-pixel-xl mb-4">Contact</h2>
            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-pixel-sm mb-1 cursor-none">Nom</label>
                    <input name="name" className="w-full border-2 border-black px-2 py-1 text-pixel-sm cursor-none hoverable" required />
                </div>
                <div>
                    <label className="block text-pixel-sm mb-1 cursor-none">Email</label>
                    <input name="email" type="email" className="w-full border-2 border-black px-2 py-1 text-pixel-sm cursor-none hoverable" required />
                </div>
                <div>  {/* ← Nouveau champ Sujet */}
                    <label className="block text-pixel-sm mb-1 cursor-none">Sujet</label>
                    <input
                        name="subject"
                        placeholder="Ex: Candidature React, Question projet..."
                        className="w-full border-2 border-black px-2 py-1 text-pixel-sm cursor-none hoverable"
                        required
                        maxLength={100}
                    />
                </div>
                <div>
                    <label className="block text-pixel-sm mb-1 cursor-none">Message</label>
                    <textarea name="message" className="w-full border-2 border-black px-2 py-1 text-pixel-sm h-24 hoverable" required />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white py-2 px-4 text-pixel-sm hover:bg-gray-800 transition-all cursor-none hoverable"
                >
                    {isLoading ? 'Envoi...' : 'Envoyer'}
                </button>
            </form>
            {status?.success && (
                <p className="mt-4 p-4 border-2 border-green-500 bg-green-100 text-pixel-sm text-green-800">
                    Merci ! Ton message m&apos;est bien parvenu. Je te réponds sous 48h.
                </p>
            )}
            {status?.error && (
                <p className="mt-4 p-4 border-2 border-red-500 bg-red-100 text-pixel-sm text-red-800">
                    {status.error} (Essaie de rafraîchir la page)
                </p>
            )}

        </div>
    );
};

export default ContactSection;
