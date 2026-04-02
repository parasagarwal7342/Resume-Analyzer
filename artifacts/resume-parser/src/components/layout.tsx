import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  FileText,
  LayoutDashboard,
  Upload,
  Menu,
  PieChart,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Parse Resume", href: "/", icon: Upload },
    { name: "Library", href: "/resumes", icon: FileText },
    { name: "Analytics", href: "/stats", icon: PieChart },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 flex items-center justify-between border-b bg-card px-4 h-14 shrink-0">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span>Resuminator</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
      </header>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-card transition-transform duration-200 ease-in-out md:relative md:translate-x-0
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex h-full flex-col">
          <div className="hidden md:flex h-16 shrink-0 items-center gap-2 px-6 font-bold text-xl tracking-tight border-b">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <span>Resuminator</span>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="grid gap-1 px-3">
              <div className="px-3 py-2 mb-2">
                <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Navigation</h2>
              </div>
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                        isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-muted-foreground"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Search Bar */}
        <header className="hidden md:flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
          <div className="flex flex-1 items-center gap-4 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search across all resumes..."
                className="w-full bg-muted/50 pl-9 border-none focus-visible:ring-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-medium text-sm">
              HR
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}