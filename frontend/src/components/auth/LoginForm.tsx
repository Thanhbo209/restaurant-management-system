import { EyeIcon } from "@/components/auth/EyeIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router";

const API_BASE_URL = import.meta.env.VITE_API_URL;
// ================= SCHEMA =================
const userSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof userSchema>;

// ================= COMPONENT =================
const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // ================= SUBMIT =================
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true },
      );

      const token = res.data?.token;
      const user = res.data?.user;
      if (!token || !user) return;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin/dashboard");
        return;
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    } catch (error: unknown) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div>
      <div className="bg-card border border-gray-800 rounded-2xl p-8 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <Label>Email</Label>
            <div className="relative">
              <Input
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="w-full pl-4 pr-4 py-2.5 rounded-xl"
              />
            </div>
            {errors.email && (
              <p className="text-destructive text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="w-full pl-4 pr-10 py-2.5 rounded-xl"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                aria-pressed={showPassword}
              >
                <EyeIcon show={showPassword} />
              </button>
            </div>

            {errors.password && (
              <p className="text-destructive text-xs">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember */}
          <div className="flex items-center justify-start text-sm">
            <a
              href="/forgot-password"
              className="text-primary hover:text-foreground transition"
            >
              Quên mật khẩu?
            </a>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
