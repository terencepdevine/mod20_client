import "./Hero.scss";

interface HeroProps {
  name: string;
  backgroundImage?: string;
}

const Hero: React.FC<HeroProps> = ({ name, backgroundImage }) => {
  const heroStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : {};

  return (
    <div className="hero">
      <div className="hero__title-wrap">
        <h1 className="hero__title">{name}</h1>
      </div>
      <div className="hero__background-image" style={heroStyle}></div>
    </div>
  );
};

export default Hero;
