import Image from 'next/image';
import profile from '../../../../public/images/profile.jpeg';

const AboutSection = () => {
    return (
        <section className="space-y-4">
            <h2 className="text-pixel-lg">À propos de moi</h2>
            <p className="text-pixel-sm">
                Je suis un alternant passionné par le développement web...
            </p>
            <Image
                src={profile}
                alt="Photo de profil"
                width={128}
                height={128}
                className="border-2 border-black"
            />
        </section>
    );
};

export default AboutSection;
