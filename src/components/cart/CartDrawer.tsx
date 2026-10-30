"use client";

import React from "react";
import { X, Trash2, ShieldCheck, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { ConflictCard } from "@/components/agent/ConflictCard";

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    setIsScannerOpen,
    diagnosticProfile,
    conflictAnalysis
  } = useCartStore();

  if (!isCartOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const hasConflict = conflictAnalysis?.safetyStatus === "CRITICAL_CONFLICT";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Cart Header */}
          <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <h2 className="text-base font-bold text-stone-900">Your Bag ({items.length})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* CartDerm Guardian Banner / Status */}
            {!diagnosticProfile ? (
              <div className="bg-gradient-to-br from-rose-50 to-amber-50/40 border border-rose-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center space-x-2 text-rose-900 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>CartDerm Barrier Protection: Unverified</span>
                </div>
                <p className="text-xs text-rose-800/80 leading-relaxed">
                  You have high-potency chemical actives in your bag. Run a 5-second optical scan to check whether your active skin barrier can tolerate them.
                </p>
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>Run Optical Skin Scan</span>
                </button>
              </div>
            ) : (
              <ConflictCard />
            )}

            {/* List of Cart Items */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Cart Items
              </h3>

              {items.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  Your bag is currently empty.
                </div>
              ) : (
                items.map((item) => {
                  const isConflicting = conflictAnalysis?.conflictingProductId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center space-x-4 p-3.5 rounded-xl border transition-all ${
                        isConflicting
                          ? "border-rose-300 bg-rose-50/30"
                          : "border-stone-100 hover:border-stone-200 bg-white"
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover border border-stone-100"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase text-stone-400 block">
                          {item.brand}
                        </span>
                        <h4 className="text-xs font-bold text-stone-900 truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs font-mono font-semibold text-stone-800">
                            ${item.price.toFixed(2)}
                          </span>
                          {isConflicting && (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
                              Conflict Flagged
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Cart Footer & Checkout */}
          <div className="p-6 border-t border-stone-100 bg-stone-50/50 space-y-4">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              disabled={items.length === 0}
              className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md transition-all ${
                hasConflict
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-stone-900 hover:bg-stone-800 text-white"
              }`}
            >
              <span>{hasConflict ? "Proceed Anyway (Override Warning)" : "Proceed to Checkout"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-stone-400">
              Cosmetic decision support only. Powered by YouCam AI Skin Analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
