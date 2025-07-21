import { useForm, SubmitHandler } from "react-hook-form";
import Form from "../../components/forms/Form";
// import Input from "../../components/forms/Input";
// import TextEditor from "../../components/forms/TextEditor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditSystem } from "../../services/apiSystem";
import { toast } from "react-toastify";

type Inputs = {
  name: string;
  introduction?: string;
};

const AdminSystemNew: React.FC = () => {
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
    // control,
    reset,
  } = useForm<Inputs>();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createEditSystem,
    onSuccess: () => {
      toast("New System Created.");
      queryClient.invalidateQueries({
        queryKey: ["systems"],
      });
      reset();
    },
    onError: (err) => alert(err.message),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    mutate(data);
  };

  const handleCancel = () => {
    toast("Message", {
      autoClose: 5000,
      position: "top-right",
    });
  };

  if (isPending) return <h1>Loading...</h1>;

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <input defaultValue="Name" {...register("name")} />
        {errors.name && <span>This field is required</span>}
        <input defaultValue="Introduction" {...register("introduction")} />
        <div>
          <button type="reset" onClick={() => handleCancel}>
            Cancel
          </button>
          <button type="submit">Submit</button>
        </div>
      </Form>
      {/* <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="System Name"
          type="text"
          id="name"
          placeholder="Enter System Name..."
          {...register("name")}
        />

        <TextEditor
          label="Introduction"
          name="introduction"
          control={control}
          placeholder="Enter System Introduction"
        />

        <button type="reset" onClick={() => handleCancel()}>
          Cancel
        </button>
        <button disabled={isPending}>Submit</button>
      </Form> */}
    </>
  );
};

export default AdminSystemNew;
