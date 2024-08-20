import { createCategory } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useServerAction } from "zsa-react";

type CategoryModalProps = {
  type: "add" | "edit";
};
const CategoryModal = ({ type }: CategoryModalProps) => {
  const { toast } = useToast();
  const { execute, isPending } = useServerAction(createCategory, {
    onSuccess: () => {
      toast({
        title: "Category created",
        description: "Category has been created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.err.message,
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="underline"
        >
          Create category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
          <DialogDescription>
            {type === "add"
              ? "Create a new category"
              : "Update the category name"}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();

            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const name = formData.get("name") as string;
            execute({ name });

            // Reset the form
            form.reset();
          }}
        >
          <Label htmlFor="name">Category name</Label>
          <Input id="name" name="name" />

          <Button isLoading={isPending}>
            {type === "add" ? "Create" : "Update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CategoryModal;
