import React from "react";

const aboutUsImg = "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80";

export default function AboutUs() {
  return (
    <section
      className="bg-white min-h-[480px] flex items-center justify-center px-4 py-16"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-4xl w-full mx-auto shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row bg-white">
        <div className="md:w-2/5 w-full bg-gray-50 flex items-center justify-center p-8">
          <img
            src={aboutUsImg}
            alt="Empowering individuals and small businesses"
            className="rounded-2xl shadow-md object-cover w-full h-72 md:h-full"
          />
        </div>
        <div className="md:w-3/5 w-full p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">About Us</h2>
          <p className="text-gray-700 text-lg mb-6">
            We are a platform dedicated to helping individuals and small businesses reach their full potential, overcome challenges, and achieve lasting success. Our personalized services include career support, skill development, business consulting, and creative design.
          </p>
          <div className="space-y-4 text-gray-600">
            <p>
              <span className="font-semibold text-gray-800">Our Journey:</span> Starting in 2021 as an Instagram project, we set out to support job seekers navigating a competitive environment. Our community grew rapidly, helping over 10,000 individuals with job updates, interview coaching, skill development, and profile optimization.
            </p>
            <p>
              <span className="font-semibold text-gray-800">What Makes Us Unique:</span> We focus on identifying individual needs and providing tailored guidance—from crafting standout resumes to optimizing LinkedIn profiles and interview preparation. Our mission: to give job seekers the tools, knowledge, and confidence to pursue their dream roles.
            </p>
            <p>
              <span className="font-semibold text-gray-800">Empowering Businesses:</span> We expanded our vision to empower small businesses and local industries by offering consulting in marketing, operations, product and package design, and more. Our collaborations span schools, gyms, cosmetic brands, and craft industries—driving growth through practical strategies and community involvement.
            </p>
            <p>
              <span className="font-semibold text-gray-800">Our Mission:</span> Delivering sustainable, effective, accessible, and customized solutions so individuals and businesses thrive in their careers and ventures.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}