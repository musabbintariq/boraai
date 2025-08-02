import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const Auth = () => {
  useAuthRedirect();

  return (
    <AuthLayout>
      <AuthForm />
    </AuthLayout>
  );
};

export default Auth;