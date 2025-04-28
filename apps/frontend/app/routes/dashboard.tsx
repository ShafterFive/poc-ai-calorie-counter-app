import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { DashboardShell } from "~/components/dashboard-shell";
import { DashboardHeader } from "~/components/dashbord-header";
import { useAuthStore } from "~/lib/store";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/user-interface/components/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/user-interface/components/card";
import { CalorieStats } from "~/components/calorie-stat";
import { MealList } from "~/components/meal-list";
import { Button } from "@workspace/user-interface/components/button";
import { PlusIcon } from "lucide-react";
import { DailyCalorieChart } from "~/components/daily-calorie-chart";
import { NutritionBreakdown } from "~/components/nutrition-breakdown";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        checkAuth();
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, []);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Track your meals and monitor your calorie intake."
        user={user}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CalorieStats />
      </div>
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Today's Meals</CardTitle>
                <CardDescription>
                  A list of meals you've logged today.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MealList />
                <div className="mt-4 flex justify-center">
                  <Link to="/add-meal">
                    <Button className="gap-1">
                      <PlusIcon className="h-4 w-4" />
                      Add Meal
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Nutrition Breakdown</CardTitle>
                <CardDescription>
                  Your macronutrient distribution for today.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NutritionBreakdown />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meal History</CardTitle>
              <CardDescription>
                A record of your past meals and calorie intake.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DailyCalorieChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Insights</CardTitle>
              <CardDescription>
                Patterns and trends in your eating habits.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Insights will be generated as you log more meals.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
