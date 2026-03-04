import { Button } from "@/components/ui/button";

interface Props {
  username: string;
  handleLogout: () => void;
}

const AuthUserGreet = ({ username, handleLogout }: Props) => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="bg-card-fore border border-gray-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold">
            Xin chào, <span className="text-primary">{username}</span> 👋
          </h1>

          <p className="text-sm text-muted-foreground mt-2">
            Bạn đã đăng nhập hệ thống
          </p>
          <div className="flex flex-col justify-center pt-5 gap-5">
            <Button variant={"outline"}>
              <a href="/admin/dashboard">Quay về Dashboard</a>
            </Button>

            <Button onClick={handleLogout} variant="destructive">
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthUserGreet;
