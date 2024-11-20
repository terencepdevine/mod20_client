type HeadlineProps = {
  text: string;
  size?: string;
};

const Headline: React.FC<HeadlineProps> = ({ text, size = "text-lg" }) => {
  return (
    <div className="flex items-center gap-4">
      <h1 className={`font-bold text-gray-100 ${size}`}>{text}</h1>
      <div className="h-[1px] flex-1 bg-gray-800"></div>
    </div>
  );
};

export default Headline;
