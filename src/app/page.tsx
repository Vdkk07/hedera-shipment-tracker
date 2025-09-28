"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Package,
  CreditCard,
  Leaf,
  ArrowRight,
  Menu,
  X,
  Zap,
  Globe,
  TrendingUp,
  Star,
  Sparkles,
  Rocket,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Index = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Immutable Tracking",
      description:
        "End-to-end shipment visibility with tamper-proof blockchain records on Hedera network.",
      gradient: "from-blue-500 to-purple-600",
    },
    {
      icon: Package,
      title: "Shipment NFTs",
      description:
        "Unique digital certificates for each package, providing provenance and ownership verification.",
      gradient: "from-green-500 to-teal-600",
    },
    {
      icon: CreditCard,
      title: "Smart Payments & Escrow",
      description:
        "Automated payment release based on delivery confirmation with built-in dispute protection.",
      gradient: "from-orange-500 to-red-600",
    },
    {
      icon: Leaf,
      title: "Sustainability Tracking",
      description:
        "Monitor carbon footprint and environmental impact throughout the supply chain.",
      gradient: "from-emerald-500 to-green-600",
    },
  ];

  const stats = [
    { icon: Globe, value: "50M+", label: "Packages Tracked" },
    { icon: TrendingUp, value: "99.9%", label: "Uptime" },
    { icon: Star, value: "4.9/5", label: "User Rating" },
    { icon: Zap, value: "<1s", label: "Response Time" },
  ];

  const navigation = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-gray-100 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x * 0.05,
            top: mousePosition.y * 0.05,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gray-200 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            right: mousePosition.x * 0.03,
            bottom: mousePosition.y * 0.03,
            transition: 'all 0.3s ease-out'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-50/50 to-transparent animate-pulse" />
      </div>

      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
                LogiChain
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-black transition-all duration-300 font-medium hover:scale-105 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="ml-4 border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                onClick={() => router.push("/dashboard")}
              >
                <Rocket className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto relative z-10">
            <div className="animate-fade-in-up">
              <Badge
                variant="secondary"
                className="mb-6 text-sm font-medium px-6 py-3 bg-gray-100 border-gray-300 text-gray-700 hover:scale-105 transition-transform duration-300"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Powered by Hedera Blockchain
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Decentralized Logistics Tracking with{" "}
                <span className="bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent">
                  Hedera
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Transform your supply chain with blockchain transparency,
                automated payments, and immutable tracking records. Built for
                the future of logistics.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  className="text-lg px-10 py-6 rounded-2xl bg-black hover:bg-gray-800 border-0 shadow-2xl hover:shadow-black/25 hover:scale-105 transition-all duration-300 group text-white"
                  onClick={() => router.push("/dashboard")}
                >
                  <Rocket className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                  Start Tracking
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-10 py-6 rounded-2xl border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:scale-105 transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
            <div className="absolute top-20 left-10 animate-bounce delay-1000">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-200/50 to-gray-300/50 rounded-full blur-xl"></div>
            </div>
            <div className="absolute bottom-20 right-10 animate-bounce delay-2000">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-300/50 to-gray-400/50 rounded-full blur-xl"></div>
            </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center group hover:scale-110 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-gray-500/25 transition-all duration-300">
                  <stat.icon className="h-8 w-8 text-gray-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-black transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Revolutionizing Logistics
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cutting-edge blockchain technology meets real-world logistics
              challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className={`p-8 rounded-2xl bg-white border-gray-200 hover:border-gray-300 transition-all duration-500 animate-fade-in-up hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/10 group`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section id="about" className="py-20 relative">
        <div className="absolute inset-0 bg-gray-50"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
              Ready to Transform Your{" "}
              <span className="bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent">
                Supply Chain?
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join hundreds of logistics companies already using LogiChain to
              build trust, reduce costs, and ensure transparency in their
              operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="text-lg px-12 py-6 rounded-2xl bg-black hover:bg-gray-800 border-0 shadow-2xl hover:shadow-black/25 hover:scale-105 transition-all duration-300 group text-white"
                onClick={() => router.push("/dashboard")}
              >
                <Rocket className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                Get Started Today
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-12 py-6 rounded-2xl border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 hover:scale-105 transition-all duration-300"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-gray-200" />

      {/* Footer */}
      <footer id="contact" className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-gray-900">
                LogiChain
              </h3>
              <p className="text-gray-600 mt-1">
                Decentralized logistics for the future
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
              <nav className="flex space-x-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 hover:text-black transition-colors duration-200 hover:scale-105"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 md:mt-0 border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                onClick={() => router.push("/dashboard")}
              >
                <Rocket className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
          </div>
          <Separator className="my-8 bg-gray-200" />
          <div className="text-center">
            <p className="text-gray-600">
              © {new Date().getFullYear()} LogiChain. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;