import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../query/queryClient";
import { toast } from "react-toastify";

import { updateRole } from "../../services/apiSystem";

import { RoleProvider } from "../../provider/RoleProvider";
import { useRole } from "../../hooks/useProvider";
import Input from "../../components/Input/Input";
import Textarea from "../../components/Textarea/Textarea";
import Select, { SelectOption } from "../../components/Select/Select";
import Form from "../../components/forms/Form";
import IconD20 from "../../components/icons/IconD20";
import Card from "../../components/Card/Card";
import Button from "../../components/Button";
import {
  MediaLibraryProvider,
  MediaLibraryImageField,
} from "../../components/MediaLibrary";
import "./AdminRole.css";

type RoleFormInputs = {
  name: string;
  introduction?: string;
  hp_dice: string;
  // Add future form fields here as needed
};

// Hit dice options for role selection
const HIT_DICE_OPTIONS: SelectOption[] = [
  { value: "6", label: "D6" },
  { value: "8", label: "D8" },
  { value: "10", label: "D10" },
  { value: "12", label: "D12" },
];

const AdminRole = () => {
  const { systemSlug, sectionSlug } = useParams<{
    systemSlug: string;
    sectionSlug: string;
  }>();

  if (!systemSlug || !sectionSlug) {
    return (
      <div className="error-message">
        Error: Missing required parameters (system or role slug)
      </div>
    );
  }

  return (
    <RoleProvider systemSlug={systemSlug} sectionSlug={sectionSlug}>
      <AdminRoleContent />
    </RoleProvider>
  );
};

const AdminRoleContent: React.FC = () => {
  const { data, isPending, isError, error } = useRole();
  const { systemSlug, sectionSlug } = useParams();
  const { register, handleSubmit, reset } = useForm<RoleFormInputs>();
  const [optimisticData, setOptimisticData] = useState<{ name: string } | null>(
    null,
  );
  // Local state for image changes (not saved until form submit)
  const [localImageChanges, setLocalImageChanges] = useState<{
    backgroundImageId?: string | null;
    images?: Array<{ imageId: string; orderby: number }>;
  }>({});
  const role = data?.role;

  // Mutation for updating role name
  const { mutate: updateRoleMutation, isPending: isUpdatingRole } = useMutation(
    {
      mutationFn: (roleData: { 
        name: string; 
        introduction?: string; 
        hp_dice?: string;
        backgroundImageId?: string | null; 
        images?: Array<{ imageId: string; orderby: number }> 
      }) => updateRole(systemSlug!, sectionSlug!, roleData),
      onMutate: async (variables) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({ queryKey: ["role", systemSlug, sectionSlug] });
        
        // Snapshot the previous value
        const previousRole = queryClient.getQueryData(["role", systemSlug, sectionSlug]);
        
        // Optimistically update the cache
        queryClient.setQueryData(["role", systemSlug, sectionSlug], (old: any) => {
          if (!old) return old;
          
          const updatedRole = {
            ...old.role,
            ...variables
          };
          
          return { ...old, role: updatedRole };
        });
        
        return { previousRole };
      },
      onSuccess: (_data, variables) => {
        toast("Role updated successfully");
        setOptimisticData(variables);
        // Don't clear local image changes immediately - wait for refetch to confirm server has correct data
        reset({ 
          name: variables.name,
          introduction: variables.introduction || "",
          hp_dice: variables.hp_dice?.toString() || "",
        }); // Only reset form fields, not image data
      },
      onError: (err: Error, _variables, context) => {
        // Roll back the optimistic update
        if (context?.previousRole) {
          queryClient.setQueryData(["role", systemSlug, sectionSlug], context.previousRole);
        }
        console.error("Role update error:", err);
        toast.error(err.message);
      },
      onSettled: () => {
        // Refetch to make sure we have the latest data
        queryClient.invalidateQueries({ queryKey: ["role", systemSlug, sectionSlug] });
        // Clear local changes after refetch - the server should now have the correct data
        setTimeout(() => {
          setLocalImageChanges({});
        }, 100);
      },
    },
  );

  useEffect(() => {
    if (role && !optimisticData) {
      reset({ 
        name: role.name,
        introduction: role.introduction || "",
        hp_dice: role.hp_dice?.toString() || "",
      });
    }
  }, [role, optimisticData, reset]);

  // Loading and error states
  if (isPending) return <div className="loading-state">Loading role...</div>;
  if (isError && error !== null) {
    return <div className="error-message">Error: {error.message || "Something went wrong"}</div>;
  }
  if (!role) {
    console.error("Role data is null");
    return <div className="error-message">Error: Role data is missing.</div>;
  }

  const onSubmit: SubmitHandler<RoleFormInputs> = (data) => {
    // Combine form data with image changes
    const updateData = {
      ...data,
      ...localImageChanges,
    };
    updateRoleMutation(updateData);
  };

  /**
   * Local-only update function for image operations (no database save)
   * Changes are stored in local state and only saved when form is submitted
   */
  const updateRoleField = async (fieldKey: string, value: any) => {
    setLocalImageChanges(prev => ({
      ...prev,
      [fieldKey]: value
    }));
    
    // Return resolved promise to satisfy MediaLibrary interface
    return Promise.resolve({ [fieldKey]: value });
  };

  // Create merged role data with local changes for display
  const roleWithLocalChanges = role ? {
    ...role,
    ...localImageChanges
  } : null;

  if (!systemSlug || !sectionSlug) {
    return <div>Error: Missing system or role slug</div>;
  }

  return (
    <MediaLibraryProvider
      entityType="role"
      entityData={roleWithLocalChanges}
      queryKey={["role", systemSlug, sectionSlug]}
      updateEntity={updateRoleField}
      isUpdating={isUpdatingRole}
    >
      <div className="content-wrap">
        <Form className="content" onSubmit={handleSubmit(onSubmit)}>
          <div className="content__main">
            <h1>Edit Role: {role.name}</h1>

            <Input
              type="text"
              defaultValue={role.name}
              placeholder="Enter role name..."
              label="Role Name"
              variant="large"
              {...register("name", { required: "Role name is required" })}
            />

            <Textarea
              defaultValue={role.introduction || ""}
              placeholder="Enter role introduction..."
              label="Introduction"
              rows={6}
              {...register("introduction")}
            />

            <Select
              defaultValue={role.hp_dice?.toString() || ""}
              placeholder="Select hit dice"
              label="Hit Dice"
              options={HIT_DICE_OPTIONS}
              {...register("hp_dice", { required: "Hit dice is required" })}
            />
          </div>

          <aside className="content__sidebar">
            <Card>
              <Button disabled={isUpdatingRole} variant="full" type="submit">
                {isUpdatingRole ? "Saving..." : "Save Role"}
                <IconD20 />
              </Button>
            </Card>

            <MediaLibraryImageField
              type="gallery"
              label="Featured Images"
              description="Multiple images that represent this role"
              isMultiple={true}
              maxCount={9}
              fieldKey="images"
            />
            <MediaLibraryImageField
              type="background"
              label="Background Image"
              description="Single background image for this role"
              isMultiple={false}
              maxCount={1}
              fieldKey="backgroundImageId"
            />
          </aside>
        </Form>
      </div>
    </MediaLibraryProvider>
  );
};

export default AdminRole;
