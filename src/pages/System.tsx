import { useParams } from "react-router-dom";
import Main from "../components/Main";
import { SystemProvider } from "../provider/SystemProvider";

const System: React.FC = () => {
  const { systemId } = useParams();

  if (!systemId) {
    return <h1>Error: Missing system ID</h1>;
  }

  return (
    <SystemProvider systemId={systemId as string}>
      <Main />
    </SystemProvider>
  );
};

export default System;
