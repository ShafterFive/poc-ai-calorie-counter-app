import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/user-interface/components/card";

export function AIAssistanceCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Assistance</CardTitle>
        <CardDescription>How our AI helps you track calories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm">
          <p>
            Our AI analyzes your meal description to estimate calories and
            macronutrients.
          </p>
          <ol className="list-decimal pl-4 space-y-2">
            <li>Enter a detailed description of your meal</li>
            <li>Click "Analyze with AI" to get nutritional estimates</li>
            <li>Review and adjust the values if needed</li>
            <li>Save your meal to your food diary</li>
          </ol>
          <p className="text-muted-foreground italic">
            For best results, be as specific as possible in your meal
            description. Include cooking methods, portion sizes, and
            ingredients.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
