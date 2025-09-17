import "./Hero.scss";

interface HeroProps {
  name: string;
  backgroundImage?: string;
}

const Hero: React.FC<HeroProps> = ({ name, backgroundImage }) => {
  return (
    <div className="hero">
      {backgroundImage && (
        <img 
          src={backgroundImage}
          alt=""
          className="hero__background-image"
        />
      )}
      <div className="hero__content">
        <h1 className="hero__title">{name}</h1>
      </div>
    </div>
  );
};

export default Hero;
