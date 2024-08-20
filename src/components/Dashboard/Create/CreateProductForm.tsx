"use client";

import { createProduct } from "@/app/dashboard/actions";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AddProduct, addProductSchema, Category } from "@/db/schema";
import { useServerAction } from "zsa-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../../ui/use-toast";
import CategoryModal from "../Categories/CategoryModal";

type CreateProductFormProps = {
  categories: Category[];
};
const CreateProductForm = ({ categories }: CreateProductFormProps) => {
  const { toast } = useToast();
  const { execute, isPending } = useServerAction(createProduct, {
    onSuccess: () => {
      console.log("success");
      toast({
        title: "Product created",
        description: "Product has been created successfully",
      });
      form.reset();
      form.setValue("title", "");
    },
    onError: (error) => {
      console.log("error", error);
      toast({
        title: "Error",
        description: error.err.message,
      });
    },
  });

  const form = useForm<AddProduct>({
    resolver: zodResolver(addProductSchema),
  });

  function onSubmit(values: AddProduct) {
    console.log("submitting");
    execute(values);
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => {
            // console.log(field, "field");
            return (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="description"
          render={() => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...form.register("description")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={() => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  {...form.register("price", { valueAsNumber: true })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <CategoryModal type="add" />
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  defaultValue={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" isLoading={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
};
export default CreateProductForm;
