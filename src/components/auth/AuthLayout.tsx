
import { Logo } from "../Logo";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container max-w-md py-10">
      <div className="flex justify-center mb-6">
        <Logo className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-bold text-center mb-8">Splitr</h1>
      {children}
    </div>
  );
};
