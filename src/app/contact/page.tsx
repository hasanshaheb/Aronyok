"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Sprout,
  Send,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { trackEvent } from "@/lib/analytics/events";

export default function ContactPage() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Plant Care Inquiry",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Also register this as a CRM lead in background
      await fetch("/api/admin/data?entity=leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          source: "website",
          interested_in: formData.subject,
          notes: formData.message,
          status: "new",
        }),
      });

      // Dispatch marketing analytics Lead event (Pixel, GA4, CAPI)
      trackEvent(
        "Lead",
        {
          content_name: formData.subject || "Contact Inquiry",
        },
        {
          email: formData.email,
          phone: formData.phone,
          firstName: formData.name,
        }
      );
    } catch {}

    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-cream-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5 text-forest-700" />
            <span>{language === "bn" ? "উদ্ভিদ পরামর্শ কেন্দ্র" : "Botanical Care & Nursery"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950 tracking-tight">
            {language === "bn"
              ? "আরণ্যক-এর সাথে যোগাযোগ করুন"
              : "Connect with Aronyok"}
          </h1>
          <p className="text-forest-800/80 text-sm sm:text-base leading-relaxed">
            {language === "bn"
              ? "গাছের পরিচর্যা, ছাদবাগানের ডিজাইন, কিংবা লাইভ চারা ক্রয়ের যে কোনো প্রয়োজনে আমাদের অভিজ্ঞ কৃষিবিদ দল প্রস্তুত রয়েছে।"
              : "Have questions about plant species, care guides, or custom rooftop greening? Our horticulturists and customer support team are here for you."}
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Location */}
          <div className="bg-white p-6 rounded-2xl border border-forest-100 shadow-soft-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-forest-700" />
            </div>
            <h3 className="font-bold text-base text-forest-950">
              {language === "bn" ? "কেন্দ্রীয় নার্সারি ও কার্যালয়" : "Main Nursery & Headquarters"}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === "bn"
                ? "হেমায়েতপুর, সাভার, ঢাকা-১৩৪০, বাংলাদেশ। (সরাসরি পরিদর্শন ও চারা সংগ্রহের সুবিধা রয়েছে)"
                : "Hemayetpur, Savar, Dhaka-1340, Bangladesh. Open for onsite visits and verified mother plant inspection."}
            </p>
          </div>

          {/* Card 2: Phone & WhatsApp */}
          <div className="bg-white p-6 rounded-2xl border border-forest-100 shadow-soft-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Phone className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="font-bold text-base text-forest-950">
              {language === "bn" ? "সরাসরি ফোন ও হোয়াটসঅ্যাপ" : "Hotline & WhatsApp"}
            </h3>
            <p className="text-xs text-stone-600">
              {language === "bn"
                ? "সকাল ৯টা – রাত ৮টা পর্যন্ত গ্রাহক সেবা চালু।"
                : "Live support available from 9:00 AM – 8:00 PM."}
            </p>
            <div className="pt-1 flex flex-col gap-1.5">
              <a
                href="tel:+8801712345678"
                className="font-bold text-sm text-forest-900 hover:text-forest-700 transition"
              >
                +880 1712-345678
              </a>
              <a
                href="https://wa.me/8801712345678"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{language === "bn" ? "হোয়াটসঅ্যাপে চ্যাট করুন" : "Chat on WhatsApp"}</span>
              </a>
            </div>
          </div>

          {/* Card 3: Support Schedule */}
          <div className="bg-white p-6 rounded-2xl border border-forest-100 shadow-soft-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="font-bold text-base text-forest-950">
              {language === "bn" ? "লাইভ প্ল্যান্ট ডেলিভারি শিডিউল" : "Live Plant Dispatch Times"}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === "bn"
                ? "চারা গাছের সতেজতা নিশ্চিত করতে রবিবার থেকে বৃহস্পতিবার বিশেষ ভেন্টিলেটেড প্যাকেটে কুরিয়ারে বুকিং দেওয়া হয়।"
                : "Dispatched Sunday through Thursday in root-moisture locked ventilated crates to eliminate weekend transit stops."}
            </p>
          </div>
        </div>

        {/* Contact Form & Nursery Guarantee */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-3 bg-white p-8 rounded-3xl border border-forest-100 shadow-soft-sm">
            <h2 className="text-xl font-bold text-forest-950 mb-2">
              {language === "bn" ? "আমাদের একটি বার্তা পাঠান" : "Send Us a Message"}
            </h2>
            <p className="text-xs text-stone-500 mb-6">
              {language === "bn"
                ? "আপনার জিজ্ঞাসা পূরণ করতে আমরা ২৪ ঘণ্টার মধ্যে প্রতিক্রিয়া জানাব।"
                : "Fill out the form below and our botanical specialists will get back to you within 24 hours."}
            </p>

            {isSubmitted ? (
              <div className="p-8 text-center space-y-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-lg text-emerald-950">
                  {language === "bn" ? "বার্তাটি সফলভাবে পাঠানো হয়েছে!" : "Message Sent Successfully!"}
                </h3>
                <p className="text-xs text-emerald-800/80 max-w-sm mx-auto">
                  {language === "bn"
                    ? "আপনার আগ্রহ ও বার্তার জন্য ধন্যবাদ। আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।"
                    : "Thank you for reaching out. An Aronyok plant care specialist will review your inquiry and follow up shortly."}
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: "",
                      phone: "",
                      email: "",
                      subject: "Plant Care Inquiry",
                      message: "",
                    });
                  }}
                  className="px-5 py-2.5 bg-forest-800 text-white rounded-xl text-xs font-bold hover:bg-forest-900 transition"
                >
                  {language === "bn" ? "আরেকটি বার্তা পাঠান" : "Send Another Message"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === "bn" ? "আপনার পুরো নাম *" : "Full Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={language === "bn" ? "যেমন: তানভীর আহমেদ" : "e.g. Tanvir Ahmed"}
                      className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === "bn" ? "মোবাইল নম্বর *" : "Phone Number *"}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="017xxxxxxxx"
                      className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === "bn" ? "ইমেইল ঠিকানা" : "Email Address"}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === "bn" ? "আলোচনার বিষয়" : "Subject"}
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                    >
                      <option value="Plant Care Inquiry">
                        {language === "bn" ? "গাছের যত্ন ও পরিচর্যা" : "Plant Care & Disease Inquiry"}
                      </option>
                      <option value="Order Tracking">
                        {language === "bn" ? "অর্ডারের ডেলিভারি তথ্য" : "Order Status & Delivery"}
                      </option>
                      <option value="Rooftop Garden Planning">
                        {language === "bn" ? "ছাদবাগান বা ব্যালকনি ডিজাইন" : "Rooftop Garden Consultation"}
                      </option>
                      <option value="Bulk Nursery Order">
                        {language === "bn" ? "পাইকারি চারা ক্রয়" : "Wholesale / Commercial Planting"}
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === "bn" ? "আপনার বিস্তারিত বার্তা *" : "Your Message *"}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={
                      language === "bn"
                        ? "আপনার প্রশ্ন বা প্রয়োজনীয় চারাগাছের তালিকা লিখুন..."
                        : "Describe the species you are looking for, or any plant health symptoms..."
                    }
                    className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs tracking-wide transition shadow-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isLoading
                      ? language === "bn"
                        ? "পাঠানো হচ্ছে..."
                        : "Sending..."
                      : language === "bn"
                      ? "বার্তা পাঠান"
                      : "Send Message"}
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Plant Care Guarantee Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-forest-900 text-cream-100 p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2.5 text-mint-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm tracking-wide text-white uppercase">
                  {language === "bn" ? "আরণ্যক ৪৮-ঘণ্টা ট্রানজিট গ্যারান্টি" : "48-Hour Live Plant Guarantee"}
                </h3>
              </div>
              <p className="text-xs text-forest-200/80 leading-relaxed">
                {language === "bn"
                  ? "পরিবহণকালে কোনো চারার ডালপালা ভেঙে গেলে বা ক্ষতিগ্রস্থ হলে ডেলিভারির ৪৮ ঘণ্টার মধ্যে ছবি সহ জানালে সম্পূর্ণ বিনামূল্যে রিপ্লেসমেন্ট প্রদান করা হয়।"
                  : "If any sapling suffers transit shock or stem damage, notify us within 48 hours of delivery with a photo for an immediate, hassle-free replacement."}
              </p>
              <div className="pt-2 border-t border-forest-800/80">
                <a
                  href="/shipping-and-returns"
                  className="text-xs text-emerald-400 font-bold hover:underline"
                >
                  {language === "bn" ? "সম্পূর্ণ রিটার্ন পলিসি পড়ুন →" : "Read Full Policy →"}
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-soft-sm space-y-3">
              <div className="flex items-center gap-2 text-forest-900 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>{language === "bn" ? "দ্রুত অর্ডার ট্র্যাকিং" : "Quick Order Tracking"}</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                {language === "bn"
                  ? "আপনার সাম্প্রতিক অর্ডারের কুরিয়ার অবস্থান এবং পার্সেল ট্র্যাকিং দেখতে আমাদের ট্র্যাকিং পেজ দেখুন।"
                  : "Track the real-time courier consignment of your live saplings without needing to log in."}
              </p>
              <a
                href="/order-tracking"
                className="inline-block px-4 py-2 bg-stone-100 hover:bg-stone-200 text-forest-950 font-bold text-xs rounded-xl transition"
              >
                {language === "bn" ? "অর্ডার ট্র্যাক করুন" : "Track Your Order"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
