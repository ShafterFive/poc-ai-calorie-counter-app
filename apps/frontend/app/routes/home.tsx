import { Button } from "@workspace/user-interface/components/button";
import { ArrowRight, Link } from "lucide-react";

export function meta() {
  return [{ title: "Calorie AI App" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <a className="flex items-center justify-center" href="/">
          <span className="font-bold text-lg">CalorieAI</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="/register">
            Register
          </a>
        </nav>
      </header>
      <main className="flex-1 mx-auto">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Track Your Calories with AI Precision
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Simply describe your meal and our AI will calculate the calories for you. Stay on track with your
                    nutrition goals effortlessly.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <a href="/register">
                    <Button size="lg" className="gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </a>
                  <a href="/login">
                    <Button size="lg" variant="outline">
                      Login
                    </Button>
                  </a>
                </div>
              </div>
              <img
                alt="Calorie tracking app dashboard"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                src="/placeholder.svg?height=550&width=800"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered calorie tracking makes nutrition management simple and accurate.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="font-bold text-xl">1</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Describe Your Meal</h3>
                  <p className="text-muted-foreground">Simply type what you ate in natural language.</p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="font-bold text-xl">2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">AI Analysis</h3>
                  <p className="text-muted-foreground">Our AI identifies ingredients and calculates calories.</p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="font-bold text-xl">3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Track Progress</h3>
                  <p className="text-muted-foreground">View your history and nutrition insights over time.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CalorieAI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
