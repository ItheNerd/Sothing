import { Separator } from "@/components/ui/separator";
import { Dashboard } from "@/components/user/dashboard/dashboard";
import MainLayout from "@/layouts/MainLayout";

const TabItems = [
  {
    title: "Profile",
  },
  {
    title: "Account",
  },
  {
    title: "Notifications",
  },
  {
    title: "Display",
  },
];

const settings = () => {
  return (
    <MainLayout>
      <div className="space-y-0.5">
        <h2 className="text-2xl tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <Dashboard items={TabItems} />
    </MainLayout>
  );
};

export default settings;
