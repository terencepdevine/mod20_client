import { useForm } from "react-hook-form";
import Form from "../../components/forms/Form";
import Input from "../../components/forms/Input";
import TextEditor from "../../components/forms/TextEditor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditSystem } from "../../services/apiSystem";
import { toast } from "react-toastify";

const AdminSystemNew: React.FC = () => {
  const { register, handleSubmit, control, reset } = useForm();
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

  function onSubmit(data) {
    mutate(data);
  }

  const handleCancel = () => {
    toast("Message", {
      autoClose: 5000,
      position: "top-right",
    });
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
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
      </Form>
    </>
  );
};

export default AdminSystemNew;
