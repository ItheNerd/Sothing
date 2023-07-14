import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "./profile/profile-form";
import { AccountForm } from "./account/account-form";
import { NotificationsForm } from "./notification/notofication-form";
import { DisplayForm } from "./display/display-form";
import SettingsProfilePage from "./profile/settingsProfile";

interface DashboardProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    title: string;
  }[];
}

export function Dashboard({ className, items, ...props }: DashboardProps) {
  return (
    <Tabs
      defaultValue="Profile"
      className="flex flex-col gap-8 space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <TabsList
        className={cn(
          "from-base-300 flex h-auto justify-start gap-3 bg-gradient-to-b to-white lg:flex-col",
          className
        )}
        {...props}>
        {items.map((item) => (
          <TabsTrigger
            key={item.title}
            className={cn(
              buttonVariants({ variant: "ghost", size: "wide" }),
              "p-4"
            )}
            value={item.title}>
            {item.title}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="">
        <TabsContent value="Profile">
          <SettingsProfilePage />
        </TabsContent>
        <TabsContent value="Account">
          <AccountForm />
        </TabsContent>
        <TabsContent value="Notifications">
          <NotificationsForm />
        </TabsContent>
        <TabsContent value="Display">
          <DisplayForm />
        </TabsContent>
      </div>
    </Tabs>
  );
}
