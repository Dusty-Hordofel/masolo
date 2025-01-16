"use client";

import DynamicFormField from "../forms/dynamic-form-field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Heading } from "../ui/heading";
import {
  storeSchema,
  StoreSchemaFormData,
} from "@/schemas/stores/stores.schema";
import { createStore } from "@/server-actions/store";
import { useToast } from "@/hooks/use-toast.hook";
import { cn } from "@/lib/utils";

export const CreateNewStore = () => {
  const router = useRouter();
  const { toast } = useToast();

  const defaultValues: StoreSchemaFormData = {
    name: "",
    description: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StoreSchemaFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues,
  });

  const handleStoreSubmit = async (data: StoreSchemaFormData) => {
    const res = await createStore(data);
    if (!res.error) {
      reset();
      router.refresh();
    }
    toast({
      title: res.title,
      description: res.description,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-12">
      <form
        className="flex flex-col  col-span-1 gap-y-4"
        onSubmit={handleSubmit(handleStoreSubmit)}
      >
        <div>
          <Heading size="h3">Create your store</Heading>
          <p className="mt-2">
            Enter the name of your store below and press create.
          </p>
        </div>
        <div className="space-y-4">
          <DynamicFormField
            showLabel
            inputType="input"
            label="Store Name"
            name="name"
            register={register}
            errors={errors}
            type="text"
            // className="mt-2"
            fieldProps={{
              placeholder: "e.g. Tim's Toys",
              disabled: false,
            }}
          />
          {/* <DynamicFormField
            inputType="textarea"
            label="Description"
            name="description"
            register={register}
            errors={errors}
            lines={8}
            fieldProps={{
              placeholder: "Enter a store description*",
            }}
          /> */}
        </div>
        <div className="w-fit">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="font-semibold relative"
          >
            {isSubmitting && (
              <Loader2
                size={18}
                className="animate-spin absolute inset-0 m-auto "
              />
            )}

            <span className={cn(isSubmitting ? "invisible" : "")}>Create</span>
          </Button>
        </div>
      </form>
      <div className="col-span-1">
        <Heading size="h3">Why sell on One Stop Shop?</Heading>
        <p className="mt-2">
          Thousands of visitors visit this site every day, searching for a whole
          range of products. Get the exposure your products deserve by creating
          a store.
        </p>
        <ul className="list-disc ml-6 mt-8 flex flex-col gap-2">
          <li>Thousands of visitors every day</li>
          <li>No monthly fees</li>
          <li>24/7 customer support</li>
        </ul>
      </div>
    </div>
  );
};
