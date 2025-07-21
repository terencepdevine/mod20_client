import "./Hero.css";

interface HeroProps {
  name: string;
  version?: string;
}

const Hero: React.FC<HeroProps> = ({ name, version }) => {
  return (
    <div className="hero">
      <div className="hero__title-wrap">
        <h1 className="hero__title">{name}</h1>
      </div>
      {version && <h4>v.{version}</h4>}
    </div>
  );
};

export default Hero;
