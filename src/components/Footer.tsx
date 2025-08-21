import React from "react";
import { Facebook, Linkedin, Instagram, Twitter, Youtube } from "lucide-react";

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
              Safe Rides, Transparent Fares, And Trusted Drivers Across India.
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
                    href="/driver/register"
                    className="text-blue-100 hover:text-white transition-colors duration-300 text-sm lg:text-lg"
                  >
                    List Member
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
            <div className="space-y-3">
              <h3 className="text-lg lg:text-2xl font-bold text-white">
                Socials
              </h3>
              <div className="flex flex-col space-y-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-100 hover:text-white transition-colors duration-300 w-fit"
                >
                  <Facebook className="h-5 w-5 lg:h-7 lg:w-7" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-100 hover:text-white transition-colors duration-300 w-fit"
                >
                  <Linkedin className="h-5 w-5 lg:h-7 lg:w-7" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-100 hover:text-white transition-colors duration-300 w-fit"
                >
                  <Instagram className="h-5 w-5 lg:h-7 lg:w-7" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-100 hover:text-white transition-colors duration-300 w-fit"
                >
                  <Twitter className="h-5 w-5 lg:h-7 lg:w-7" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-100 hover:text-white transition-colors duration-300 w-fit"
                >
                  <Youtube className="h-5 w-5 lg:h-7 lg:w-7" />
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
