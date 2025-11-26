// components/LandingHome.jsx - ENHANCED USER-FRIENDLY VERSION
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { Menu, X, GraduationCap, UserCog, BookOpen, Sparkles, TrendingUp, Users } from "lucide-react";
import { motion, useInView } from "framer-motion";

// Swiper (Carousel)
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const defaultStats = [
  { id: "students", value: 10000, label: "Active Students", icon: Users, isPercent: false },
  { id: "courses", value: 500, label: "Courses", icon: BookOpen, isPercent: false },
  { id: "teachers", value: 200, label: "Teachers", icon: UserCog, isPercent: false },
  { id: "success", value: 95, label: "Success Rate", icon: TrendingUp, isPercent: true },
];

const formatStatValue = (value, isPercent = false) => {
  if (isPercent) return `${Math.round(value)}%`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K+`;
  return `${Math.round(value)}+`;
};

export default function LandingHome({ setShowSignIn }) {
  const [showMobileOpen, setShowMobileOpen] = useState(false);
  const [statsData, setStatsData] = useState(defaultStats);
  const [animatedStats, setAnimatedStats] = useState(defaultStats.map(() => 0));
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const handleRoleSelection = (role) => {
    try {
      localStorage.setItem('pendingRole', role);
      console.log(`🎯 Role selected: ${role}`);
    } catch (e) {
      console.error("Failed to set role in localStorage:", e);
    }
  };

  const handleSignInClick = useCallback(() => {
    try {
      localStorage.removeItem('pendingRole');
    } catch (e) {
      console.error("Failed to clear pendingRole:", e);
    }
    setShowSignIn("sign-in");
  }, [setShowSignIn]);

  // Fetch live stats for students/teachers
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (!response.ok) return;
        const data = await response.json();

        setStatsData((prev) =>
          prev.map((stat) => {
            if (stat.id === "students" && typeof data.students === "number") {
              return { ...stat, value: data.students };
            }
            if (stat.id === "teachers" && typeof data.teachers === "number") {
              return { ...stat, value: data.teachers };
            }
            if (stat.id === "courses" && typeof data.courses === "number") {
              return { ...stat, value: data.courses };
            }
            return stat;
          })
        );
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  // Animate stats when section is in view
  useEffect(() => {
    if (!statsInView) return;

    const duration = 1200;
    const startTimestamp = performance.now();
    const startValues = statsData.map(() => 0);
    const endValues = statsData.map((stat) => stat.value);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats(
        endValues.map((end, index) =>
          startValues[index] + (end - startValues[index]) * eased
        )
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [statsInView, statsData]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMobileOpen && !event.target.closest('.mobile-menu-container')) {
        setShowMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileOpen]);

  return (
    <div className="w-full bg-gradient-to-b from-[#0d1117] via-[#0d1117] to-[#161b22] text-white min-h-screen">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-[#0d1117]/95 backdrop-blur-sm border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <Image
                src="/plmunlogo (2).png"
                alt="PLMun Logo"
                width={100}
                height={100}
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
              <h1 className="text-green-400 font-bold text-lg sm:text-xl md:text-2xl">
                PLMun AI Tutor
              </h1>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Button
                onClick={handleSignInClick}
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Sign In
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileOpen(!showMobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {showMobileOpen ? (
                <X size={24} className="text-green-400" />
              ) : (
                <Menu size={24} className="text-green-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setShowMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="mobile-menu-container fixed right-0 top-16 h-[calc(100vh-4rem)] w-64 bg-[#161b22] border-l border-gray-800 z-50 p-6 md:hidden overflow-y-auto"
            >
              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => {
                    handleSignInClick();
                    setShowMobileOpen(false);
                  }}
                  variant="outline"
                  className="w-full border-gray-700 text-black hover:bg-gray-800"
                >
                  Sign In
                </Button>
                <div className="pt-4 border-t border-gray-800">
                  <p className="text-sm text-gray-400 mb-3">Quick Access</p>
                  <Button
                    onClick={() => {
                      handleRoleSelection('student');
                      setShowSignIn("sign-up");
                      setShowMobileOpen(false);
                    }}
                    variant="ghost"
                    className="w-full justify-start text-left text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    <GraduationCap className="mr-2 w-5 h-5" />
                    Join as Student
                  </Button>
                  <Button
                    onClick={() => {
                      handleRoleSelection('teacher');
                      setShowSignIn("sign-up");
                      setShowMobileOpen(false);
                    }}
                    variant="ghost"
                    className="w-full justify-start text-left text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    <UserCog className="mr-2 w-5 h-5" />
                    Become a Teacher
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 text-center lg:text-left space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>PLMun AI Tutor Learning Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Learn Faster with
              <span className="block text-green-400 mt-2">AI-Powered Courses</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0">
              Join thousands of students learning with adaptive lessons, AI guidance, and expert teachers. Learn at your own pace with our AI-powered courses.
            </p>
            
            {/* Role Selection Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8 max-w-2xl mx-auto lg:mx-0">
              {/* Student Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  handleRoleSelection('student');
                  setShowSignIn("sign-up");
                }}
                className="group relative bg-gradient-to-br from-green-600/20 to-green-700/10 border-2 border-green-500/30 rounded-xl p-6 cursor-pointer hover:border-green-500 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                    <GraduationCap className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Join as Student</h3>
                    <p className="text-sm text-gray-400 mb-4">Start learning with AI-powered courses</p>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      Get Started Free
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Teacher Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  handleRoleSelection('teacher');
                  setShowSignIn("sign-up");
                }}
                className="group relative bg-gradient-to-br from-blue-600/20 to-blue-700/10 border-2 border-blue-500/30 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <UserCog className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Apply as a Teacher</h3>
                    <p className="text-sm text-gray-400 mb-4">Create and share your courses</p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Start Teaching
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Already have account */}
            <div className="flex items-center justify-center lg:justify-start gap-2 mt-6">
              <p className="text-gray-400 text-sm">Already have an account?</p>
              <button
                onClick={handleSignInClick}
                className="text-green-400 hover:text-green-300 font-medium text-sm underline"
              >
                Sign in here
              </button>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
              <Image
                src="/plmun.png"
                alt="Study Illustration"
                width={600}
                height={600}
                className="relative w-[280px] sm:w-[380px] md:w-[480px] lg:w-[520px]"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section
        ref={statsRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {statsData.map((stat, index) => {
            const StatIcon = stat.icon;
            const displayValue = formatStatValue(
              animatedStats[index] || 0,
              stat.isPercent
            );

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 bg-[#161b22]/50 rounded-xl border border-gray-800/50 hover:border-green-500/30 transition-colors"
              >
                <StatIcon className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {displayValue}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FEATURED COURSES — CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Featured Courses
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our most popular courses designed by expert teachers
          </p>
        </div>

        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
          className="w-full pb-12"
        >
          {[
            {
              title: "Introduction to Python",
              img: "/java.png",
              level: "Beginner",
            },
            {
              title: "Web Development",
              img: "/web.png",
              level: "Intermediate",
            },
            {
              title: "Java OOP",
              img: "/one.png",
              level: "Intermediate",
            },
            {
              title: "Data Structures",
              img: "/oop.png",
              level: "Advanced",
            },
          ].map((course, i) => (
            <SwiperSlide key={i}>
              <motion.div
                whileHover={{ scale: 1.03, y: -8 }}
                transition={{ duration: 0.3 }}
                className="bg-[#161b22] rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:border-green-500/50 transition-all duration-300 h-full flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={course.img}
                    alt={course.title}
                    width={400}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {course.level}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="text-xl font-semibold mb-2">{course.title}</h4>
                  <p className="text-gray-400 text-sm mb-4 flex-1">{course.level} Level Course</p>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      handleRoleSelection('student');
                      setShowSignIn("sign-up");
                    }}
                  >
                    Enroll Now
                  </Button>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: BookOpen,
              title: "Enroll in Courses",
              text: "Browse and choose from hundreds of courses created by expert teachers.",
              color: "green",
            },
            {
              icon: Sparkles,
              title: "Learn With AI",
              text: "Get instant help and personalized study guidance from our AI tutor.",
              color: "blue",
            },
            {
              icon: TrendingUp,
              title: "Track Progress",
              text: "Monitor your learning journey with detailed analytics and achievements.",
              color: "purple",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="bg-[#161b22] p-8 rounded-xl border border-gray-700 shadow-lg hover:border-green-500/50 transition-all duration-300 text-center"
            >
              <div className={`inline-flex p-4 rounded-full bg-${item.color}-500/20 mb-6`}>
                <item.icon className={`w-8 h-8 text-${item.color}-400`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-2 border-green-500/30 rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students and teachers on our AI-powered learning platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                handleRoleSelection('student');
                setShowSignIn("sign-up");
              }}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
            >
              <GraduationCap className="mr-2 w-5 h-5" />
              Join as Student
            </Button>
            <Button
              onClick={() => {
                handleRoleSelection('teacher');
                setShowSignIn("sign-up");
              }}
              size="lg"
              variant="outline"
              className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 px-8 py-6 text-lg"
            >
              <UserCog className="mr-2 w-5 h-5" />
              Become a Teacher
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}