import { NavigationMenuDemo } from "@/components/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="relative z-50">
        <NavigationMenuDemo />
      </div>
      {children}
    </main>
  );
}
