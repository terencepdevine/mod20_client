import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../query/queryClient";
import { toast } from "react-toastify";

import { createEditSystem } from "../../services/apiSystem";

import { SystemProvider } from "../../provider/SystemProvider";
import { useSystem } from "../../hooks/useProvider";

import Input from "../../components/forms/Input";
import Form from "../../components/forms/Form";
import TextEditor from "../../components/forms/TextEditor";
import Label from "../../components/forms/Label";
import IconD20 from "../../components/icons/IconD20";
import { ArrowPathIcon, CalendarIcon } from "@heroicons/react/16/solid";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";

const AdminSystem = () => {
  const { systemId } = useParams();

  return (
    <SystemProvider systemId={systemId as string}>
      <AdminSystemContent />
    </SystemProvider>
  );
};

const AdminSystemContent: React.FC = () => {
  const { data: system, isPending, isError, error } = useSystem();
  const { register, handleSubmit, control, reset } = useForm();
  const [optimisticData, setOptimisticData] = useState<{
    name: string;
    version?: string;
    introduction?: string;
  } | null>(null);
  const [showMenu, setShowmenu] = useState(false);
  const { mutate, isPending: isUpdating } = useMutation({
    mutationFn: ({
      newSystem,
      id,
    }: {
      newSystem: { name: string; version?: string; introduction?: string };
      id: string;
    }) => createEditSystem(newSystem, id),
    onSuccess: (_data, variables) => {
      const { newSystem } = variables;
      toast("System Updated");
      setOptimisticData(newSystem);
      reset(newSystem);
      queryClient.invalidateQueries({ queryKey: ["system", variables.id] });
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

  function onSubmit(data) {
    mutate({ newSystem: data, id: system.id });
  }

  return (
    <div className="flex">
      <aside className="w-[280px] bg-gray-925">
        <h1>Sidebar</h1>
      </aside>
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
        <div className="flex flex-1 items-center gap-2 p-6">
          <h1 className="text-4xl">Introduction</h1>
          <div className="relative cursor-pointer">
            <EllipsisVerticalIcon
              className="h-6 w-6 text-sky-500"
              onClick={() => setShowmenu((show) => !show)}
            />
            {showMenu && (
              <div className="card absolute right-0 top-full min-w-max p-4 shadow-lg">
                <ul>
                  <li>Menu Item</li>
                  <li>Menu Item</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 gap-6 px-6">
          <div className="flex w-2/3 flex-col gap-6">
            <div className="flex flex-1 gap-2">
              <div className="flex-1">
                <Input
                  label="System Name"
                  type="text"
                  id="name"
                  variant="large"
                  {...register("name", { required: "System name is required" })}
                />
              </div>
              <div className="w-[120px]">
                <Input
                  label="Version"
                  type="text"
                  id="version"
                  variant="large"
                  {...register("version")}
                />
              </div>
            </div>
            <TextEditor
              label="Introduction"
              name="introduction"
              control={control}
            />
          </div>
          <div className="flex w-1/3 flex-col">
            <Label>System Updates</Label>
            <div className="card flex flex-col gap-2 p-2">
              <div className="text-gray-3 00 flex flex-col gap-2 p-2 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <p>
                    Created on{" "}
                    <span className="text-gray-100">March 1, 2024</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowPathIcon className="h-4 w-4 text-gray-500" />
                  <p>
                    Last Updated on{" "}
                    <span className="text-gray-100">August 26, 2024</span>
                  </p>
                </div>
              </div>
              <button disabled={isUpdating} className="btn btn-full">
                Save Changes
                <IconD20 />
              </button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AdminSystem;
