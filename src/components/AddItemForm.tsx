import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "./Badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectWithError,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/data/categories";
import { shoppingItemSchema } from "@/lib/validations/shopping-item";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import React from "react";

type FormData = z.infer<typeof shoppingItemSchema>;

interface AddItemFormProps {
  onAdd: (item: FormData) => void;
}

export function AddItemForm({ onAdd }: AddItemFormProps) {
  const { toast } = useToast();
  const [selectError, setSelectError] = React.useState<Error | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(shoppingItemSchema),
    defaultValues: {
      name: "",
      quantity: undefined,
      category: "",
    },
  });

  const onSubmit = (data: FormData) => {
    try {
      onAdd(data);
      form.reset();
      toast({
        title: "Item adicionado",
        description: `${data.name} foi adicionado à sua lista.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar o item. Tente novamente.",
      });
    }
  };

  const selectedCategory = categories.find(
    (cat) => cat.name === form.watch("category")
  );

  React.useEffect(() => {
    if (selectError) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Houve um problema ao selecionar a categoria. Tente novamente.",
      });
    }
  }, [selectError, toast]);

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Nome do item"
                    {...field}
                    className="bg-white/50 md:bg-white border-red-100 focus:border-red-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Quantidade..."
                      className="bg-white/50 md:bg-white border-red-100 focus:border-red-500"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        onChange(value === "" ? undefined : Number(value));
                      }}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <SelectWithError
                    value={field.value}
                    onValueChange={field.onChange}
                    onError={(error) => setSelectError(error)}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/50 md:bg-white border-red-100 focus:border-red-500">
                        <SelectValue placeholder="Categoria">
                          {selectedCategory && (
                            <Badge
                              category={selectedCategory.name}
                              color={cn(
                                "bg-opacity-10 text-opacity-90",
                                selectedCategory.bgColor,
                                selectedCategory.textColor
                              )}
                            />
                          )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent container={formRef.current || undefined}>
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat.name}
                          value={cat.name}
                          onTouchStart={(e) => {
                            // Previne comportamento padrão que pode causar problemas em alguns dispositivos Android
                            e.preventDefault();
                          }}
                        >
                          <Badge
                            category={cat.name}
                            color={cn(
                              "bg-opacity-10 text-opacity-90",
                              cat.bgColor,
                              cat.textColor
                            )}
                          />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectWithError>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Item
        </Button>
      </form>
    </Form>
  );
}
