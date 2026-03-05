import { Breadcrumb } from "@/pages/admin/AdminLayout";
import { Bell, Menu, Search, X } from "lucide-react";

interface NavbarProps {
  setMobileOpen: (mobileOpen: boolean) => void;
  mobileOpen: boolean;
}

const Navbar = ({ setMobileOpen, mobileOpen }: NavbarProps) => {
  return (
    <div>
      {/* Topbar */}
      <header className="shrink-0 bg-sidebar flex items-center rounded-t-3xl gap-4 px-6 py-4  backdrop-blur border-b border-border">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg  hover:bg-primary transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <Breadcrumb />

        <div className="flex-1" />

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 w-52 focus-within:border-primary transition-colors">
          <Search size={15} className=" shrink-0" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="bg-transparent outline-none text-sm  w-full"
          />
        </div>

        {/* Bell */}
        <button className="relative p-2 rounded-xl  hover:bg-secondary  transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-ring" />
        </button>

        {/* Avatar */}
        <img
          src="https://i.pravatar.cc/32?img=11"
          alt="avatar"
          className="w-8 h-8 rounded-full ring-2 ring-ring cursor-pointer"
        />
      </header>
    </div>
  );
};

export default Navbar;
