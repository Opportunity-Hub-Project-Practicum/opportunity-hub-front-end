import { Briefcase, ArrowRight, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 text-white  page-container ">
      <div className="mx-auto max-w-7xl">
        {/* Upper Section */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
          {/* Logo & Contact Section */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <Briefcase size={24} className="text-blue-600" />
              <h3 className="text-xl font-bold text-white">OpportunityHub</h3>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex gap-1.5">
                <span className="text-slate-400 text-xs">Call now:</span>
                <span className="text-white font-medium text-xs">(319) 555-0115</span>
              </div>
              <div className="flex gap-1.5 text-xs text-slate-400">
                <MapPin size={14} className="shrink-0 mt-0.5" />
                <span>6391 Elgin St. Celina, Delaware 10299, New York, United States of America</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-base font-semibold text-white mb-3">Quick Link</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition text-xs">
                  About us
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-blue-400 transition text-xs flex items-center gap-1">
                  <ArrowRight size={12} />
                  Contact us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition text-xs">
                  Our Partners
                </a>
              </li>
            </ul>
          </div>

          {/* Seeker */}
          <div className="lg:col-span-1">
            <h4 className="text-base font-semibold text-white mb-3">Seeker</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition text-xs">
                  Browse Jobs for free
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition text-xs">
                  Browse Employers
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition text-xs">
                  Candidate Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition text-xs">
                  Saved Jobs
                </a>
              </li>
            </ul>
          </div>

          {/* Employers */}
          <div className="lg:col-span-1">
            <h4 className="text-base font-semibold text-white mb-3">Employers</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition text-xs">
                  Post a Job for free
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition text-xs">
                  Browse Candidates
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition text-xs">
                  Employers Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition text-xs">
                  Applications
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-1">
            <h4 className="text-base font-semibold text-white mb-3">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition text-xs">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition text-xs">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition text-xs">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-700 mb-4"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <p>&copy; {currentYear} OpportunityHub. All rights reserved.</p>
          <div className="flex gap-4 mt-3 md:mt-0">
            <a href="#" className="hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
