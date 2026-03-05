import { Button } from "@/components/ui/button";

type Props = {
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  onDeleted?: (id: string) => void;
};

const DeleteModal = ({ deleteId, setDeleteId, onDeleted }: Props) => {
  return (
    <div>
      <div className="fixed inset-0  backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl w-full max-w-sm p-7 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-destructive/15 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h3 className="text-base font-bold  mb-1">Xóa món ăn này?</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Hành động này không thể hoàn tác.
          </p>
          <div className="flex gap-5 justify-center">
            <Button onClick={() => setDeleteId(null)} variant={"outline"}>
              Hủy
            </Button>
            <Button
              onClick={async () => {
                if (!deleteId) return;
                try {
                  const API_BASE_URL = import.meta.env.VITE_API_URL as
                    | string
                    | undefined;
                  const base = API_BASE_URL
                    ? API_BASE_URL.replace(/\/$/, "")
                    : "";
                  const token = localStorage.getItem("token");
                  const headers: Record<string, string> = {};
                  if (token) headers["Authorization"] = `Bearer ${token}`;
                  const url = base
                    ? `${base}/api/foods/${deleteId}`
                    : `/api/foods/${deleteId}`;
                  const res = await fetch(url, { method: "DELETE", headers });
                  if (!res.ok) {
                    const text = await res.text().catch(() => "<no body>");
                    throw new Error(
                      `Failed to delete food: ${res.status} ${url} ${text}`,
                    );
                  }
                  if (typeof onDeleted === "function") onDeleted(deleteId);
                  setDeleteId(null);
                } catch (err) {
                  console.error("Error deleting food in DeleteModal:", err);
                }
              }}
              variant={"destructive"}
            >
              Xóa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
