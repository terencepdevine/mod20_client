type BurstProps = {
  height?: string;
  align?: string;
};

const Burst: React.FC<BurstProps> = ({
  height = "h-full",
  align = "ellipse_at_top_center",
}) => {
  return (
    <div
      className={`absolute left-0 top-0 z-0 ${height} w-full bg-[radial-gradient(${align},theme(colors.sky.900)_0%,theme(colors.gray.950)_70%)] opacity-20`}
    ></div>
  );
};

export default Burst;
