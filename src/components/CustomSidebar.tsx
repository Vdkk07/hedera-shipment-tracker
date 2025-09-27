"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Package, Home, Menu, X } from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  href?: string;
}

const SidebarItem = ({ icon, label, isActive, onClick, href }: SidebarItemProps) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  const content = (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
        isActive
          ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
      onClick={handleClick}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  );

  if (href) {
    return <a href={href}>{content}</a>;
  }

  return content;
};

export function CustomSidebar({ children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigationItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
      href: "/dashboard",
      isActive: true,
    },
    {
      icon: <Plus className="h-5 w-5" />,
      label: "Create Shipment",
      href: "/dashboard?tab=create",
      isActive: false,
    },
    {
      icon: <Search className="h-5 w-5" />,
      label: "Check Status",
      href: "/dashboard?tab=status",
      isActive: false,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">Hedera Tracker</span>
            </div>
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-md hover:bg-gray-100 md:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={item.isActive}
              />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Hedera Shipment Tracker v1.0
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-gray-100 md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Shipment Dashboard</h1>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
