import { SpeakerWaveIcon } from "@heroicons/react/24/solid";
import Breadcrumbs from "./Breadcrumbs";

interface HeroProps {
  name: string;
}

const Hero: React.FC<HeroProps> = ({ name }) => {
  const speakTitle = () => {
    const utterance = new SpeechSynthesisUtterance(name);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="relative flex flex-col gap-2 bg-hero-dark-future bg-cover bg-center px-4 py-4 lg:gap-4 lg:px-6 lg:py-8">
      <div className="absolute left-0 top-0 z-10 h-full w-full bg-gradient-to-r from-gray-950/80 from-50% to-gray-950/50 lg:from-20%"></div>
      <Breadcrumbs />
      <div className="relative z-10 flex items-center gap-4">
        <h1 className="text-3xl font-bold lg:text-5xl">{name}</h1>
        <SpeakerWaveIcon
          className="h-4 w-4 cursor-pointer fill-sky-500 lg:h-5 lg:w-5"
          onClick={speakTitle}
        />
      </div>
    </div>
  );
};

export default Hero;
