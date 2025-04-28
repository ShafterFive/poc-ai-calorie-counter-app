import { Button } from "@workspace/user-interface/components/button";
import { ArrowLeft } from "lucide-react";
import { DashboardHeader } from "@/app/components/dashbord-header";
import { DashboardShell } from "@/app/components/dashboard-shell";
import { AddMealForm } from "@/app/components/forms/add-meal-form";
import { AIAssistanceCard } from "@/app/components/ai-assistance-card";
import { Link } from "react-router";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/lib/store";

export default function AddMealPage() {
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
        heading="Add Meal"
        text="Log a new meal with AI-assisted calorie calculation."
        user={user}
      >
        <Link to="/dashboard">
          <Button variant="outline" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AddMealForm user={user} />
        <AIAssistanceCard />
      </div>
    </DashboardShell>
  );
}
