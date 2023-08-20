import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Dashboard } from "@/components/user/dashboard/dashboard";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/examples/forms",
  },
  {
    title: "Account",
    href: "/examples/forms/account",
  },
  {
    title: "Appearance",
    href: "/examples/forms/appearance",
  },
  {
    title: "Notifications",
    href: "/examples/forms/notifications",
  },
  {
    title: "Display",
    href: "/examples/forms/display",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function UserDashboardLayout({ children }: SettingsLayoutProps) {
  return (
    <section className="space-y-6 p-10 pb-16 md:block">
      <Header
        title="Product Collection"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. dolor sit amet, consectetur adipiscing elit dolor sit amet, consectetur adipiscing elit"
      />
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <Dashboard items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </section>
  );
}
