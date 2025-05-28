import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, ClipboardList, Menu, X, Share2 } from "lucide-react";
import { cn } from "../lib/utils";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPageName, setCurrentPageName] = useState("dashboard");
  const location = useLocation(); 
  const navItems = [
    {
      name: "dashboard",
      title: "Dashboard",
      icon: <ClipboardList className="w-5 h-5" />,
      href: "/dashboard"
    },
    {
      name: "interviewForm",
      title: "New Interview",
      icon: <CalendarClock className="w-5 h-5" />,
      href: "/interviewForm"
    },
    {
      name: "publicInterviews",
      title: "Community",
      icon: <Share2 className="w-5 h-5" />,
      href: "/publicInterviews"
    }
  ];

  useEffect(() => {
    setCurrentPageName(location.pathname.split("/").pop() || "dashboard");
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <header className="sticky top-0 z-30 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <button
                type="button"
                className="md:hidden -ml-2 mr-2 text-gray-500 hover:text-gray-600"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link to={"/"} className="flex items-center space-x-2">
                <CalendarClock className="h-8 w-8 text-indigo-600" />
                <span className="font-bold text-xl tracking-tight text-gray-900">InterviewTrack</span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors",
                    currentPageName === item.name
                      ? "text-indigo-700"
                      : "text-gray-700 hover:text-indigo-600"
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white shadow-lg transition duration-200 ease-in-out transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link to={"/"} className="flex items-center space-x-2">
            <CalendarClock className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-lg text-gray-900">InterviewTrack</span>
          </Link>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col p-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-2 py-3 px-3 rounded-md text-sm font-medium transition-colors",
                currentPageName === item.name
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            InterviewTrack - Track your job search journey
          </p>
        </div>
      </footer>
    </div>
  );
}
