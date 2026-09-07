import HeroSection from './HeroSection';
import CategoriesSection from './CategoriesSection';
  import FeaturedProducts from './FeaturedProducts';
import WhyChooseUs from './WhyChooseUs';
import Testimonials from './Testimonials';
import SolutionsSection from './FeaturedProducts';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] overflow-hidden">
      <HeroSection />
      <CategoriesSection />
      <SolutionsSection />
      <WhyChooseUs />
      <Testimonials />
    </div>
  );
}

