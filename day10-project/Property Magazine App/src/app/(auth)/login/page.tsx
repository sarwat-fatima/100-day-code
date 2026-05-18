import SignInForm from "@/components/auth/SignInForm";

export default function LoginPage() {
  return (
    <div className="container-edge py-14">
      <div className="mx-auto max-w-md">
        <h1 className="font-serif text-3xl tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-ink/70">Enter your email and password to continue.</p>
        <div className="mt-8">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}

