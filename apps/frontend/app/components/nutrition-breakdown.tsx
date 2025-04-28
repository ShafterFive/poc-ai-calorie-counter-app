import { useState, useEffect } from "react";
import api from "~/lib/axios";

interface Meal {
  id: number;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
  createdAt: string;
}

export function NutritionBreakdown() {
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNutritionData = async () => {
      const meals = await api.get("meal/today");
      if (meals.status !== 200) {
        setLoading(false);
        setError("Failed to fetch meals");
        return;
      }
      const mealData: Meal[] = meals.data.meals;

      const totalProtein = mealData.reduce(
        (acc, meal) => acc + meal.protein,
        0,
      );
      const totalCarbs = mealData.reduce(
        (acc, meal) => acc + meal.carbohydrates,
        0,
      );
      const totalFat = mealData.reduce((acc, meal) => acc + meal.fats, 0);
      setProtein(totalProtein);
      setCarbs(totalCarbs);
      setFat(totalFat);
      setLoading(false);
    };

    fetchNutritionData().catch((err) => {
      console.error("Error fetching nutrition data:", err);
      setLoading(false);
      setError("Failed to fetch nutrition data");
    });
  }, []);

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-4">Loading nutrition data...</div>;
  }

  const total = protein + carbs + fat;

  if (total === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No nutrition data available.</p>
        <p className="text-sm mt-2">
          Add meals to see your macronutrient breakdown!
        </p>
      </div>
    );
  }

  const proteinPercent = Math.round((protein / total) * 100) || 0;
  const carbsPercent = Math.round((carbs / total) * 100) || 0;
  const fatPercent = Math.round((fat / total) * 100) || 0;

  return (
    <div className="space-y-6">
      <div className="h-40 w-40 mx-auto relative">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="10"
          />

          {total > 0 && (
            <>
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#22c55e"
                strokeWidth="10"
                strokeDasharray={`${proteinPercent * 2.51} 251`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />

              {/* Carbs segment (blue) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="10"
                strokeDasharray={`${carbsPercent * 2.51} 251`}
                strokeDashoffset={`${-proteinPercent * 2.51}`}
                transform="rotate(-90 50 50)"
              />

              {/* Fat segment (orange) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#f97316"
                strokeWidth="10"
                strokeDasharray={`${fatPercent * 2.51} 251`}
                strokeDashoffset={`${-(proteinPercent + carbsPercent) * 2.51}`}
                transform="rotate(-90 50 50)"
              />
            </>
          )}

          {/* Center text */}
          <text
            x="50"
            y="45"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
          >
            {total}g
          </text>
          <text x="50" y="55" textAnchor="middle" fontSize="8">
            Total
          </text>
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#22c55e]"></div>
            <span className="text-sm font-medium">Protein</span>
          </div>
          <p className="text-lg font-bold">{protein}g</p>
          <p className="text-xs text-muted-foreground">{proteinPercent}%</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
            <span className="text-sm font-medium">Carbs</span>
          </div>
          <p className="text-lg font-bold">{carbs}g</p>
          <p className="text-xs text-muted-foreground">{carbsPercent}%</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#f97316]"></div>
            <span className="text-sm font-medium">Fat</span>
          </div>
          <p className="text-lg font-bold">{fat}g</p>
          <p className="text-xs text-muted-foreground">{fatPercent}%</p>
        </div>
      </div>
    </div>
  );
}
