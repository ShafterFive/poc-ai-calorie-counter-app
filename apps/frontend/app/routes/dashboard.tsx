import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "~/lib/store";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await checkAuth();
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
    <div>
      <h1>Welcome, {user.name}</h1>
      {/* Add your dashboard content here */}
    </div>
  );
}
