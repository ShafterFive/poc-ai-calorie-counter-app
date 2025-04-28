"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@workspace/user-interface/components/button";
import { Card, CardContent } from "@workspace/user-interface/components/card";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "~/lib/axios";

interface Meal {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
  createdAt: string;
}

export function MealList() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      const meals = await api.get("meal/today");
      if (meals.status !== 200) {
        throw new Error("Failed to fetch meals");
      }
      const mealsData = meals.data.meals as Meal[];
      setMeals(mealsData);
      setLoading(false);
    };

    fetchMeals();
  }, []);

  const deleteMeal = (id: number) => {
    setLoading(true);

    const deleteMeal = async () => {
      const response = await api.delete(`meal/${id}`);
      if (response.status !== 200) {
        throw new Error("Failed to delete meal");
      }
      toast.success("Meal deleted successfully");
      setMeals((prevMeals) => prevMeals.filter((meal) => meal.id !== id));
    };

    deleteMeal()
      .catch((error) => {
        toast.error("Failed to delete meal");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No meals logged today.</p>
        <p className="text-sm mt-2">Add your first meal to start tracking!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meals.map((meal) => (
        <Card key={meal.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{meal.name}</h3>
                <div className="flex gap-3 mt-2 text-sm">
                  <span className="font-medium">{meal.calories} kcal</span>
                  <span>P: {meal.protein}g</span>
                  <span>C: {meal.carbohydrates}g</span>
                  <span>F: {meal.fats}g</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => deleteMeal(meal.id)}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
