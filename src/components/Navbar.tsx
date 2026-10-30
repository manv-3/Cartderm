"use client";

import React from "react";
import { ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export const Navbar = () => {
  const { items, setIsCartOpen, setIsScannerOpen, diagnosticProfile, conflictAnalysis } = useCartStore();

  const isGuarded = !!diagnosticProfile;
  const hasConflict = conflictAnalysis?.safetyStatus === "CRITICAL_CONFLICT";

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-stone-900 font-serif">
              AURA <span className="text-rose-600">DERMA</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium uppercase tracking-wider text-stone-400 border-l border-stone-200 pl-2">
              Clean Clinical Beauty
            </span>
          </div>
        </div>

        {/* Center / CartDerm Badge */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsScannerOpen(true)}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-xs ${
              hasConflict
                ? "bg-rose-50 text-rose-700 border border-rose-300 animate-pulse"
                : isGuarded
                ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200"
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${hasConflict ? "text-rose-600" : isGuarded ? "text-emerald-600" : "text-stone-500"}`} />
            <span>
              {hasConflict
                ? "CartDerm: 1 Barrier Conflict"
                : isGuarded
                ? "CartDerm Shield: Active"
                : "CartDerm: Scan Skin"}
            </span>
          </button>
        </div>

        {/* Cart Drawer Trigger */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full hover:bg-stone-100 transition-colors text-stone-800"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-6 h-6" />
            {items.length > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                {items.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
