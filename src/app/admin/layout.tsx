export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory text-plum" style={{ fontFamily: "Outfit, system-ui, sans-serif" }}>
      {children}
    </div>
  );
}
