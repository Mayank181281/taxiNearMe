import React from "react";
import { Facebook, Linkedin, Instagram, Twitter, Youtube } from "lucide-react";

// Reddit icon component (since it's not in lucide-react)
const Reddit: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
  </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
          {/* Brand Section */}
          <div className="space-y-3 md:col-span-1">
            <h2
              className="text-xl lg:text-3xl font-bold tracking-wide"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              TAXI NEAR ME
            </h2>
            <p className="text-blue-100 leading-relaxed text-sm lg:text-lg">
              Book Your Taxi In Seconds With Our Easy-To-Use Platform. Enjoy
              Safe Rides, Transparent Fares, And Trusted Taxi and tour & travels services Across India.
              Available 24×7 — Because Your Journey Matters Anytime, Anywhere.
            </p>
          </div>

          {/* Links and Socials - Side by side on mobile */}
          <div className="grid grid-cols-2 gap-6 md:col-span-2 md:grid-cols-2">
            {/* Useful Links */}
            <div className="space-y-3">
              <h3 className="text-lg lg:text-2xl font-bold text-white">
                Useful links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-blue-100 hover:text-white transition-colors duration-300 text-sm lg:text-lg"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="text-blue-100 hover:text-white transition-colors duration-300 text-sm lg:text-lg"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="/profile/plans"
                    className="text-blue-100 hover:text-white transition-colors duration-300 text-sm lg:text-lg"
                  >
                    Plan Page
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-blue-100 hover:text-white transition-colors duration-300 text-sm lg:text-lg"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/blogs"
                    className="text-blue-100 hover:text-white transition-colors duration-300 text-sm lg:text-lg"
                  >
                    Blogs
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="space-y-5 flex flex-col items-center">
              <h3 className="text-lg lg:text-2xl font-bold text-white">
                Socials
              </h3>
              <div className="grid grid-cols-3 gap-8 max-w-xs ">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex justify-center"
                >
                  <Facebook className="h-5 w-5 lg:h-8 lg:w-8" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex justify-center"
                >
                  <Linkedin className="h-5 w-5 lg:h-8 lg:w-8" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex justify-center"
                >
                  <Instagram className="h-5 w-5 lg:h-8 lg:w-8" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex justify-center"
                >
                  <Twitter className="h-5 w-5 lg:h-8 lg:w-8" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex justify-center"
                >
                  <Youtube className="h-5 w-5 lg:h-8 lg:w-8" />
                </a>
                <a
                  href="https://reddit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-100 hover:text-white transition-colors duration-300 flex justify-center"
                >
                  <Reddit className="h-5 w-5 lg:h-8 lg:w-8" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-300 border-opacity-40 mt-8 pt-6 text-center">
          <p className="text-blue-100 text-sm lg:text-lg">
            &copy; 2025 Taxi Near Me. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
