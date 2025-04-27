import { LoginForm } from "../components/forms/login-form";
import { AuthLayout } from "../components/layouts/auth-layout";

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
