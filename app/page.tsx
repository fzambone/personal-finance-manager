import Image from "next/image";
import {
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  WalletIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-900/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center">
              <Image
                src="/fintrack.svg"
                alt="FinTrack Logo"
                width={120}
                height={32}
                className="dark:invert"
              />
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <a
                href="#features"
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                Contact
              </a>
              <a
                href="/login"
                className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 transition-colors"
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="h-[calc(100vh-4rem)] pt-16 flex flex-col">
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col pt-2">
          {/* Hero Section */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div className="text-center lg:text-left order-2 lg:order-1">
                <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl">
                  <span className="block">Take Control of Your</span>
                  <span className="block text-primary">Financial Future</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:text-lg">
                  Track expenses, manage budgets, and achieve your financial
                  goals with our intuitive personal finance manager.
                </p>

                {/* CTA Buttons */}
                <div className="mt-6 flex gap-4 items-center justify-center lg:justify-start flex-col sm:flex-row">
                  <a
                    className="w-full sm:w-auto rounded-full transition-all duration-200 flex items-center justify-center bg-primary hover:bg-primary/90 text-white gap-2 text-base font-medium py-2.5 px-6 shadow-lg hover:shadow-xl"
                    href="/login"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Get Started
                  </a>
                  <a
                    className="w-full sm:w-auto rounded-full transition-all duration-200 flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-base font-medium py-2.5 px-6 shadow-lg hover:shadow-xl"
                    href="/register"
                  >
                    Create Account
                  </a>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <Image
                  src="/hero-illustration.png"
                  alt="Financial management illustration"
                  width={500}
                  height={500}
                  priority
                  className="w-full h-auto max-w-md mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-4 mb-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="rounded-full bg-primary/10 p-2 shrink-0">
                  <ChartBarIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1">
                    Expense Tracking
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Easily track and categorize your expenses in real-time
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="rounded-full bg-primary/10 p-2 shrink-0">
                  <WalletIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1">
                    Budget Management
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Set and monitor budgets to reach your financial goals
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="rounded-full bg-primary/10 p-2 shrink-0">
                  <PresentationChartLineIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1">
                    Smart Insights
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Get detailed analytics and insights about your spending
                    habits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
