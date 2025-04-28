"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@workspace/user-interface/components/card";
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

interface DailyTotal {
  date: string;
  calories: number;
  meals: number;
}

export function DailyCalorieChart() {
  const [dailyData, setDailyData] = useState<DailyTotal[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const meals = await api.get("/meal/history");
      if (meals.status !== 200) {
        setError("Failed to fetch meal data");
        setLoading(false);
        return;
      }

      const mealData = meals.data.meals as Meal[];
      setMeals(mealData);

      const dailyTotals: { [key: string]: DailyTotal } = {};
      mealData.forEach((meal) => {
        const date = new Date(meal.createdAt).toLocaleDateString("en-US");
        if (!dailyTotals[date]) {
          dailyTotals[date] = { date, calories: 0, meals: 0 };
        }
        dailyTotals[date].calories += meal.calories;
        dailyTotals[date].meals += 1;
      });

      const sortedDailyTotals = Object.values(dailyTotals).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      setDailyData(sortedDailyTotals);
    };

    fetchData()
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching daily data:", err);
        setError("Failed to fetch daily data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading chart data...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (dailyData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No meal history available.</p>
        <p className="text-sm mt-2">Start logging meals to see your history!</p>
      </div>
    );
  }

  const maxCalories = Math.max(...dailyData.map((d) => d.calories));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {dailyData.slice(-7).map((day) => {
          const height =
            maxCalories > 0 ? (day.calories / maxCalories) * 100 : 0;
          const formattedDate = new Date(day.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });

          return (
            <div key={day.date} className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground mb-1">
                {formattedDate}
              </div>
              <div className="w-full bg-muted rounded-sm h-32 relative">
                <div
                  className="absolute bottom-0 w-full bg-primary rounded-sm transition-all duration-500"
                  style={{ height: `${height}%` }}
                ></div>
              </div>
              <div className="text-xs font-medium mt-1">
                {day.calories} kcal
              </div>
              <div className="text-xs text-muted-foreground">
                {day.meals} meals
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 mt-6">
        <h3 className="font-medium">Recent Meals</h3>
        {meals.slice(0, 5).map((meal) => (
          <Card key={meal.id} className="p-4">
            <CardContent>
              <h4 className="font-medium">{meal.name}</h4>
              <p className="text-sm text-muted-foreground">
                {meal.calories} kcal
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
