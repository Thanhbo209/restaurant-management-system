import LoginForm from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

const Login = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  const username = useMemo(() => {
    if (!userStr) return "";

    try {
      const user = JSON.parse(userStr);
      return user.email?.split("@")[0] || "";
    } catch {
      return "";
    }
  }, [userStr]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  if (token && username) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="bg-card border border-gray-800 rounded-2xl p-8 shadow-xl">
            <h1 className="text-2xl font-bold">
              Xin chào, <span className="text-primary">{username}</span> 👋
            </h1>

            <p className="text-sm text-muted-foreground mt-2">
              Bạn đã đăng nhập hệ thống
            </p>
            <a href="/admin"></a>

            <Button
              onClick={handleLogout}
              className="w-full mt-6 rounded-xl"
              variant="destructive"
            >
              Đăng xuất
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">Đăng nhập</h1>

          <p className="text-sm text-muted-foreground mt-1">
            Hệ thống nhà hàng
          </p>
        </div>

        <LoginForm />
      </div>
    </section>
  );
};

export default Login;
