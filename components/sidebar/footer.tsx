import React from "react";


export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 text-center text-sm">
      <p>&copy; {new Date().getFullYear()} AIvestor. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <a className="hover:underline">
          About
        </a>
        <a className="hover:underline">
          Terms
        </a>
        <a className="hover:underline">
          Privacy
        </a>
      </div>
    </footer>
  );
}
