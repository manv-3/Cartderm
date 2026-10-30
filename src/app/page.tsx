"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CameraModal } from "@/components/scanner/CameraModal";
import { PRODUCTS_CATALOG } from "@/lib/inciDatabase";
import { useCartStore } from "@/store/useCartStore";
import { ShieldCheck, Sparkles, ArrowRight, Camera, CheckCircle2 } from "lucide-react";

export default function Home() {
  const { setIsScannerOpen, setIsCartOpen, items, diagnosticProfile } = useCartStore();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Top Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/60 via-stone-50 to-stone-50 border-b border-stone-200/60 py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 shadow-2xs text-xs font-semibold text-stone-700">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>YouCam Skin AI Hackathon 2026 • Devpost Submission</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-900 font-serif max-w-4xl mx-auto leading-tight">
              Clinical Beauty Shopping,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-600">
                Protected by CartDerm.
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-600 font-light leading-relaxed">
              Don&apos;t risk chemical burns or barrier damage from viral skincare. CartDerm scans your skin via <strong>YouCam AI Skin Analysis (v2.1)</strong> and cross-examines your cart&apos;s active ingredients before checkout.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setIsScannerOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Camera className="w-4 h-4 text-rose-400" />
                <span>
                  {diagnosticProfile ? "Re-scan Skin Barrier" : "Try 5-Sec Skin Scan"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs sm:text-sm border border-stone-200 shadow-xs transition-all flex items-center space-x-2"
              >
                <span>View Demo Cart ({items.length})</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              </button>
            </div>

            {/* Feature Pills */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 font-medium">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>16 HD Diagnostic Metrics</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Hardware Bias & Lens Check</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Autonomous 1-Click Swap</span>
              </span>
            </div>
          </div>
        </section>

        {/* Curated Product Catalog Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-200 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Curated Formulations
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif mt-1">
                Clinical Skincare Catalog
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-2 sm:mt-0 max-w-sm">
              Mix and match acids, retinoids, and barrier essentials. CartDerm will alert you if any combination endangers your active skin mantle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {PRODUCTS_CATALOG.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-10 mt-16 text-center text-xs text-stone-500 space-y-3">
        <div className="max-w-4xl mx-auto px-4">
          <p className="font-semibold text-stone-800">
            CartDerm • Intelligent Skin AI & E-Commerce Barrier Guardian
          </p>
          <p className="mt-1 text-stone-400 text-[11px]">
            Built with the YouCam AI Skin Analysis REST API (v2.1 HD), Next.js 14, and Tailwind CSS.
            Designed for the YouCam API Skin AI & eCommerce VTO Hackathon on Devpost.
          </p>
          <p className="mt-2 text-[10px] text-stone-400">
            Cosmetic decision support only. Does not diagnose clinical conditions or replace licensed dermatological consultation.
          </p>
        </div>
      </footer>

      {/* Modals & Slide-out Drawers */}
      <CartDrawer />
      <CameraModal />
    </div>
  );
}
