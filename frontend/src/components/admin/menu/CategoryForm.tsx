type Props = {
  name: string;
  setName: (v: string) => void;
  imageUrl: string;
  setImageUrl: (v: string) => void;
};

export default function CategoryForm({
  name,
  setName,
  imageUrl,
  setImageUrl,
}: Props) {
  return (
    <div className="px-6 py-5 space-y-4">
      <label className="block text-xs text-muted-foreground font-medium mb-1.5">
        Tên danh mục
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm"
        placeholder="VD: Món Khai Vị"
      />
      <label className="block text-xs text-muted-foreground font-medium mb-1.5">
        URL ảnh (tùy chọn)
      </label>
      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full bg-input border border-border rounded-xl px-4 py-2.5 text-sm"
        placeholder="https://..."
      />
    </div>
  );
}
