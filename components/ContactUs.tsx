// import React, { useState } from "react";

// const SERVICES = [
//   { value: "career", label: "Career Support" },
//   { value: "skill", label: "Skill Development" },
//   { value: "consulting", label: "Business Consulting" },
//   { value: "design", label: "Creative Design" },
// ];

// export default function ContactUs() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     service: "",
//     message: "",
//   });
//   const [sent, setSent] = useState(false);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // You can replace this with your email logic (e.g. using API, EmailJS, etc.)
//     setSent(true);
//   };

//   return (
//     <section className="bg-white py-16 px-4 flex items-center justify-center min-h-[480px]">
//       <div className="max-w-lg w-full mx-auto bg-white shadow-2xl rounded-3xl p-8">
//         <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
//         <p className="mb-6 text-gray-600 text-lg">
//           Choose a service and tell us a bit about what you need. We'll reach out soon!
//         </p>
//         {sent ? (
//           <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center font-semibold">
//             Thank you for contacting us! We'll get back to you soon.
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="block text-gray-700 mb-1 font-medium">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 placeholder="Your name"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-1 font-medium">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 required
//                 className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 placeholder="Your email"
//               />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-1 font-medium">Service</label>
//               <select
//                 name="service"
//                 value={form.service}
//                 onChange={handleChange}
//                 required
//                 className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               >
//                 <option value="">Select a service</option>
//                 {SERVICES.map((s) => (
//                   <option key={s.value} value={s.value}>{s.label}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-1 font-medium">Message</label>
//               <textarea
//                 name="message"
//                 value={form.message}
//                 onChange={handleChange}
//                 required
//                 rows={3}
//                 className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 placeholder="Describe your requirements..."
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
//             >
//               Send
//             </button>
//           </form>
//         )}
//       </div>
//     </section>
//   );
// }

import React, { useState } from "react";

const SERVICES = [
  { value: "Career Support", label: "Career Support" },
  { value: "Skill Development", label: "Skill Development" },
  { value: "Business Consulting", label: "Business Consulting" },
  { value: "Creative Design", label: "Creative Design" },
];

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Frontend validation
    if (!form.name || !form.email || !form.service || !form.message) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSent(true);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to send. Try again.");
    }
    setLoading(false);
  };

  return (
    <section className="bg-white py-16 px-4 flex items-center justify-center min-h-[480px]">
      <div className="max-w-lg w-full mx-auto bg-white shadow-2xl rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
        <p className="mb-6 text-gray-600 text-lg">
          Choose a service and tell us a bit about what you need. We'll reach out soon!
        </p>
        {sent ? (
          <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center font-semibold">
            Thank you for contacting us! We'll get back to you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-100 text-red-700 p-2 rounded text-sm mb-2">{error}</div>
            )}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Your email"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Service</label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select a service</option>
                {SERVICES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Describe your requirements..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}