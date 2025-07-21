import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../query/queryClient";
import { toast } from "react-toastify";

import { createEditSystem } from "../../services/apiSystem";

import { SystemProvider } from "../../provider/SystemProvider";
import { useSystem } from "../../hooks/useProvider";

import Input from "../../components/Input/Input";
import Form from "../../components/forms/Form";
import IconD20 from "../../components/icons/IconD20";
import TextEditor from "../../components/forms/TextEditor";
import Card from "../../components/Card/Card";
import Button from "../../components/Button";

type Inputs = {
  name: string;
  introduction?: string;
  version?: string;
  backgroundImage?: string;
};

const AdminSystem = () => {
  const { systemSlug } = useParams();

  return (
    <SystemProvider systemSlug={systemSlug as string}>
      <AdminSystemContent />
    </SystemProvider>
  );
};

const AdminSystemContent: React.FC = () => {
  const { data: system, isPending, isError, error } = useSystem();
  const { register, handleSubmit, control, reset } = useForm<Inputs>();
  const [optimisticData, setOptimisticData] = useState<{
    name: string;
    version?: string;
    introduction?: string;
    backgroundImage?: string;
  } | null>(null);
  // const [showMenu, setShowmenu] = useState(false);
  const { mutate, isPending: isUpdating } = useMutation({
    mutationFn: ({
      newSystem,
      systemSlug,
    }: {
      newSystem: { name: string; version?: string; introduction?: string };
      systemSlug: string;
    }) => createEditSystem(newSystem, systemSlug),
    onSuccess: (_data, variables) => {
      const { newSystem } = variables;
      toast("System Updated");
      setOptimisticData(newSystem);
      reset(newSystem);
      queryClient.invalidateQueries({
        queryKey: ["system", variables.systemSlug],
      });
    },
    onError: (err) => toast(err.message),
  });

  useEffect(() => {
    if (system && !optimisticData) {
      reset({
        name: system.name,
        version: system.version,
        introduction: system.introduction,
      });
    }
  }, [system, optimisticData, reset]);

  if (isPending) return <h1>Loading...</h1>;
  if (isError && error !== null)
    return <h1>Error: {error.message || "Something went wrong"}</h1>;

  if (!system) {
    console.error("System Context is null");
    return <div>Error: System data is missing.</div>;
  }

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log("data: ", data);
    mutate({ newSystem: data, systemSlug: system.slug });
  };

  return (
    <div className="content-wrap">
      <Form className="content" onSubmit={handleSubmit(onSubmit)}>
        <div className="content__main">
          <Input
            type="text"
            defaultValue={system.name}
            placeholder="Enter Name..."
            label="System Name"
            variant="large"
            {...register("name")}
          />
          <Input
            type="text"
            defaultValue={system.version}
            placeholder="Enter Version..."
            label="Version Number"
            {...register("version")}
          />
          <input type="file" {...register("backgroundImage")} />
          <TextEditor
            control={control}
            name="introduction"
            label="Introduction"
            placeholder="Enter System Introduction"
          />
        </div>
        <aside className="content__sidebar">
          <Card>
            <Button disabled={isUpdating} variant="full" type="submit">
              Save Changes
              <IconD20 />
            </Button>
          </Card>
        </aside>
      </Form>
    </div>
  );
};

export default AdminSystem;
