import NavbarItem from "@/components/Sidebar/NavItem";
import SectionHeading from "@/components/Sidebar/SectionHeading";
import SidebarContainer from "@/components/Sidebar/SidebarContainer";
import SidebarHero from "@/components/Sidebar/SidebarHero";
import { SidebarProvider } from "@/components/Sidebar/SidebarContext";
import {
  CurrencyDollarIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import MainContent from "@/components/Layout/MainContent";

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        <SidebarContainer>
          <SidebarHero />
          <div className="flex flex-col space-y-1">
            <NavbarItem
              icon={<HomeIcon className="w-6 h-6" />}
              label="Dashboard"
            />
            <NavbarItem
              icon={<CurrencyDollarIcon className="w-6 h-6" />}
              label="Transactions"
              count={5}
            />
            <NavbarItem
              icon={<UserGroupIcon className="w-6 h-6" />}
              label="Users"
            />
          </div>
          <SectionHeading title="Your Teams" hasDivider={true} />
        </SidebarContainer>
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
