import React from 'react';
import { FaHeart, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import WebScrapping from './WebScrapping';

const Heropage = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 text-white min-h-screen flex flex-col overflow-x-hidden">

      {/* Navbar */}
      <nav className="w-full bg-indigo-950 px-8 py-5 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-2">
          <FaHeart className="text-red-500 text-2xl" />
          <span className="text-xl font-bold">HealthChain</span>
        </div>
        <div className="space-x-6">
          <Link to="/about" className="hover:text-gray-300 transition">About</Link>
          <Link to="/login" className="hover:text-gray-300 transition">Login</Link>
          <Link to="/register" className="bg-white text-indigo-900 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-8 py-36 w-full">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Redefining Trust in <br /> Healthcare Finance
            </h1>
            <p className="text-lg sm:text-xl text-gray-300">
              HealthChain brings decentralized trust to healthcare transactions using blockchain. 
              Secure records, trusted payments, and a smarter ecosystem for all.
            </p>
            <div className="flex gap-4">
              <Link to="/register" className="bg-white text-indigo-800 font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-indigo-100 transition">
                Get Started
              </Link>
              <Link to="/learnmore" className="bg-transparent border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-indigo-800 transition">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right: Visual Content */}
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/20 w-full max-w-md text-center">
              <h2 className="text-xl font-semibold mb-4">HealthChain</h2>
              <div className="h-64 bg-gradient-to-tr from-indigo-800 to-purple-700 rounded-xl flex items-center justify-center text-3xl font-bold text-white shadow-inner">
                🩺 + 🔗
              </div>
            </div>
          </div>
        </div>
      </main>

      <WebScrapping />

      {/* Footer */}
      <footer className="bg-indigo-950 text-gray-300 px-8 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
            <p>Email: contact@healthchain.io</p>
            <p>Phone: +91 9876543210</p>
            <p>Address: 123 Blockchain Avenue, Tech City, IN</p>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Useful Links</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:underline">Terms of Service</Link></li>
              <li><Link to="/support" className="hover:underline">Support</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
            <div className="flex gap-4 text-2xl">
              <a href="https://instagram.com/dummyhandle" target="_blank" rel="noreferrer">
                <FaInstagram className="hover:text-white transition" />
              </a>
              <a href="https://twitter.com/dummyhandle" target="_blank" rel="noreferrer">
                <FaTwitter className="hover:text-white transition" />
              </a>
              <a href="https://facebook.com/dummyhandle" target="_blank" rel="noreferrer">
                <FaFacebook className="hover:text-white transition" />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-sm mt-10 text-gray-400">
          © {new Date().getFullYear()} HealthChain. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Heropage;
