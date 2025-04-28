"use client";

import { useState, useTransition } from "react";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@workspace/user-interface/components/button";
import { Input } from "@workspace/user-interface/components/input";
import { Textarea } from "@workspace/user-interface/components/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/user-interface/components/card";
import {
  Alert,
  AlertDescription,
} from "@workspace/user-interface/components/alert";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/user-interface/components/form";
import { toast } from "sonner";
import api from "~/lib/axios";

const mealSchema = z.object({
  mealName: z
    .string()
    .min(2, { message: "Meal name must be at least 2 characters" }),
  mealDescription: z
    .string()
    .min(5, { message: "Please provide a more detailed description" }),
});

type MealFormValues = z.infer<typeof mealSchema>;

interface AddMealFormProps {
  user: { name?: string; email: string } | null;
}

export function AddMealForm({ user }: AddMealFormProps) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const form = useForm<MealFormValues>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      mealName: "",
      mealDescription: "",
    },
  });

  const analyzeWithAI = async () => {
    const description = form.getValues("mealDescription");
    const name = form.getValues("mealName");

    if (!description) {
      setError("Please enter a meal description first");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    const response = await api.post("ai/analyze", {
      name,
      description,
    });

    if (response.status === 201) {
      toast("AI analysis complete", {
        description: "Your meal has been analyzed successfully.",
      });
      setIsAnalyzing(false);
    } else {
      setIsAnalyzing(false);
      throw new Error("Failed to analyze meal");
    }
  };

  const onSubmit = (values: MealFormValues) => {
    if (isAnalyzing) {
      toast.error("Please wait for the AI analysis to complete.");
      return;
    }

    startTransition(() => {
      setError("");
      analyzeWithAI()
        .then(() => {
          navigate("/dashboard");
        })
        .catch((error) => {
          setError(error.message);
          toast.error("Failed to analyze meal");
        });
    });
  };

  return (
    <Card className="col-span-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardHeader>
            <CardTitle>Meal Details</CardTitle>
            <CardDescription>
              Enter your meal information and our AI will automatically
              calculate nutrition facts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="mealName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meal Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Breakfast, Lunch, Dinner, etc."
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mealDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meal Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you ate in detail (e.g., 'Grilled chicken breast with brown rice and steamed broccoli, about 1 cup of rice and 6oz of chicken')"
                      rows={4}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground mt-1">
                    For best results, include portion sizes and cooking methods.
                  </p>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing and saving...
                </>
              ) : (
                "Save Meal"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
