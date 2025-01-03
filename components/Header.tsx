import { UserCircleIcon } from "@heroicons/react/24/outline";
import { BellIcon } from "@heroicons/react/24/outline";

type HeaderProps = {
  title?: string;
};

export default function Header({ title = "Dashboard" }: HeaderProps) {
  return (
    <header className="ml-6 h-16">
      <div className="h-full px-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
        <div className="flex items-center space-x-4">
          {/* Add your header content here */}
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <BellIcon className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <UserCircleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
