interface LabelProps {
  children: string;
  name?: string;
}

const Label: React.FC<LabelProps> = ({ children, name }) => {
  return (
    <label htmlFor={name} className="pb-2 text-sm italic text-gray-500">
      {children}
    </label>
  );
};

export default Label;
