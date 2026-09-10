import { Outlet } from 'react-router-dom';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import UserNavbar from '../components/Navbar';
import UserFooter from '../components/UserFooter';
import WhatsAppButton from '../components/WhatsAppButton';

gsap.registerPlugin(ScrollTrigger);

export default function UserLayout() {
  useEffect(() => {
    // Basic GSAP fade-in for the main content
    gsap.fromTo(".page-transition", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans transition-colors duration-300">
      <UserNavbar />
      <main className="min-h-screen page-transition">
        <Outlet />
      </main>
      <UserFooter />
      {/* <WhatsAppButton /> */}
    </div>
  );
}