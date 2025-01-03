import NavbarItem from "@/components/Sidebar/NavItem";
import SectionHeading from "@/components/Sidebar/SectionHeading";
import SidebarContainer from "@/components/Sidebar/SidebarContainer";
import SidebarHero from "@/components/Sidebar/SidebarHero";
import { SidebarProvider } from "@/components/Sidebar/SidebarContext";
import { ModalProvider } from "@/components/Generic/ModalContext";
import {
  CurrencyDollarIcon,
  HomeIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import MainContent from "@/components/Layout/MainContent";

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = [
    { icon: HomeIcon, label: "Dashboard", href: "/dashboard" },
    {
      icon: CurrencyDollarIcon,
      label: "Transactions",
      href: "/transactions",
      count: 5,
    },
    { icon: ChartBarIcon, label: "Analytics", href: "/analytics" },
    { icon: UserGroupIcon, label: "Users", href: "/users" },
    { icon: Cog6ToothIcon, label: "Settings", href: "/settings" },
  ];

  return (
    <ModalProvider>
      <SidebarProvider>
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
          <SidebarContainer>
            <SidebarHero />
            <nav className="mt-6 flex-1 space-y-1 px-2">
              {navigation.map((item) => (
                <NavbarItem
                  key={item.href}
                  icon={<item.icon className="w-6 h-6" />}
                  label={item.label}
                  href={item.href}
                  count={item.count}
                />
              ))}
            </nav>
          </SidebarContainer>
          <MainContent>{children}</MainContent>
        </div>
      </SidebarProvider>
    </ModalProvider>
  );
}
