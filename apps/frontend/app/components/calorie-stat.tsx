"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/user-interface/components/card";
import { Progress } from "@workspace/user-interface/components/progress";
import { Utensils, Flame, Target, TrendingUp } from "lucide-react";
import api from "~/lib/axios";

interface Meal {
  id: number;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}

export function CalorieStats() {
  const [todayCalories, setTodayCalories] = useState(0);
  const [calorieGoal] = useState(2000);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [todayMealCount, setTodayMealCount] = useState(0);

  useEffect(() => {
    const getTodayCalories = async () => {
      const calories = await api.get("/meal/today/calories");
      if (calories.status === 200) {
        setTodayCalories(calories.data.calories);
      } else {
        console.error("Error fetching today's calories");
      }
    };

    const getWeeklyAverage = async () => {
      const calories = await api.get("/meal/weekly/average");
      if (calories.status === 200) {
        setWeeklyAverage(calories.data.average);
      } else {
        console.error("Error fetching weekly average calories");
      }
    };

    async function getTodayMealCount() {
      const meals = await api.get("/meal/today");
      if (meals.status === 200) {
        setTodayMealCount(meals.data.meals.length);
      } else {
        console.error("Error fetching today's meals");
      }
    }

    getTodayMealCount();
    getTodayCalories();
    getWeeklyAverage();
  }, [calorieGoal]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Today's Calories
          </CardTitle>
          <Flame className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayCalories}</div>
          <p className="text-xs text-muted-foreground">
            of {calorieGoal} kcal goal
          </p>
          <Progress
            value={(todayCalories / calorieGoal) * 100}
            className="mt-2"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weeklyAverage}</div>
          <p className="text-xs text-muted-foreground">kcal per day</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Meals Today</CardTitle>
          <Utensils className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayMealCount}</div>
          <p className="text-xs text-muted-foreground">logged meals</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Calorie Goal</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{calorieGoal}</div>
          <p className="text-xs text-muted-foreground">kcal per day</p>
        </CardContent>
      </Card>
    </>
  );
}
