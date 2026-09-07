import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiFacebook, FiYoutube } from 'react-icons/fi';

export default function UserFooter() {
  return (
    <footer className="bg-bosco-gray dark:bg-[#0a0a0a] text-gray-300 pt-16 pb-8 border-t-[4px] border-bosco-red transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">
              Bosco <span className="text-bosco-red">International Trade</span>
            </h3>
            <p className="text-sm text-gray-400">
              Leading provider of industrial packaging, filling machines, and raw materials across Egypt and the Middle East.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-bosco-red transition-colors"><FiLinkedin size={20} /></a>
              <a href="#" className="hover:text-bosco-red transition-colors"><FiFacebook size={20} /></a>
              <a href="#" className="hover:text-bosco-red transition-colors"><FiYoutube size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Industrial Solutions</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/packaging" className="hover:text-bosco-red transition-colors">Packaging Machines</Link></li>
              <li><Link to="/filling" className="hover:text-bosco-red transition-colors">Filling Machines</Link></li>
              <li><Link to="/production-lines" className="hover:text-bosco-red transition-colors">Complete Production Lines</Link></li>
              <li><Link to="/spare-parts" className="hover:text-bosco-red transition-colors">Spare Parts & Maintenance</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-bosco-red transition-colors">About Bosco</Link></li>
              <li><Link to="/certifications" className="hover:text-bosco-red transition-colors">Certifications</Link></li>
              <li><Link to="/careers" className="hover:text-bosco-red transition-colors">Careers</Link></li>
              <li><Link to="/news" className="hover:text-bosco-red transition-colors">Industry News</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3"><FiMapPin className="text-bosco-red" /> Alexandria, Egypt</li>
              <li className="flex items-center gap-3"><FiPhone className="text-bosco-red" /> +20 100 000 0000</li>
              <li className="flex items-center gap-3"><FiMail className="text-bosco-red" /> sales@bosco-trade.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Bosco International Trade. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}