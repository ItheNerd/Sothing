import Header from "@/components/header";
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
      <Header
        title="Settings"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
      <Dashboard items={TabItems} />
    </MainLayout>
  );
};

export default settings;
