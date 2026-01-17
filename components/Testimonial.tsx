"use client";
import React from "react";
import Image from "next/image";

// Dummy testimonial data
const testimonials = [
  {
    name: "Alice Johnson",
    role: "Product Manager",
    text: "This service exceeded my expectations! The team was super responsive and the results were amazing.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
  },
  {
    name: "David Lee",
    role: "Frontend Developer",
    text: "A seamless experience from start to finish. I highly recommend them!",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    rating: 4,
  },
  {
    name: "Emma Watson",
    role: "Designer",
    text: "Absolutely loved the designs and attention to detail. Will collaborate again.",
    avatar: "https://randomuser.me/api/portraits/women/43.jpg",
    rating: 5,
  },
  {
    name: "Michael Smith",
    role: "Business Analyst",
    text: "Professional, quick, and reliable. The best in the business.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4,
  },
];

// Testimonial Card Component
const TestimonialCard: React.FC<{
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating: number;
}> = ({ name, role, text, avatar, rating }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col transition-transform hover:-translate-y-1 hover:shadow-2xl duration-300">
    <div className="flex items-center space-x-4">
      <Image
        src={avatar}
        alt={name}
        width={56}
        height={56}
        className="rounded-full object-cover border-2 border-yellow-400"
      />
      <div>
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
    <blockquote className="mt-4 text-gray-700 italic flex-1">
      “{text}”
    </blockquote>
    <div className="flex mt-4">
      {[...Array(5)].map((_, idx) => (
        <svg
          key={idx}
          className={`w-5 h-5 ${idx < rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.098 9.384c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
    </div>
  </div>
);

// Main Testimonials Component (grid of cards)
const Testimonials: React.FC = () => (
  <section className="bg-gradient-to-tr from-yellow-50 via-blue-50 to-white py-16 px-4">
    <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-10">
      What Our Clients Say
    </h2>
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((t, i) => (
        <TestimonialCard key={i} {...t} />
      ))}
    </div>
  </section>
);

export default Testimonials;