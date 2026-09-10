import HeroSection from './HeroSection';
import IndustriesSection from './IndustriesSection';
import CategoriesSection from './CategoriesSection';
import FeaturedCatalog from './FeaturedCatalog';
import WhyChooseUs from './WhyChooseUs';
import Testimonials from './Testimonials';
import SolutionsSection from './FeaturedProducts';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      <HeroSection />
      <IndustriesSection />
      <CategoriesSection />
      <FeaturedCatalog />
      <SolutionsSection />
      <WhyChooseUs />
      <Testimonials />
    </div>
  );
}
