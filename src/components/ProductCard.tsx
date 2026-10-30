"use client";

import React from "react";
import { Product } from "@/lib/inciDatabase";
import { useCartStore } from "@/store/useCartStore";
import { Plus, Check, AlertTriangle } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { items, addItem, conflictAnalysis } = useCartStore();
  const isInCart = items.some((item) => item.id === product.id);

  const isConflicting = conflictAnalysis?.conflictingProductId === product.id;

  return (
    <div className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
      isConflicting
        ? "border-rose-400 ring-2 ring-rose-300 shadow-md"
        : "border-stone-200 hover:border-stone-300 hover:shadow-lg"
    }`}>
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Conflict Flag if identified by CartDerm */}
        {isConflicting && (
          <div className="absolute top-3 left-3 bg-rose-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-md">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Barrier Conflict</span>
          </div>
        )}

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-stone-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
          ${product.price.toFixed(2)}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
            {product.brand}
          </span>
          <h3 className="text-base font-semibold text-stone-900 mt-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-stone-500 mt-1.5 line-clamp-2">
            {product.shortDesc}
          </p>

          {/* Active Ingredients Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.actives.map((active, idx) => (
              <span
                key={idx}
                className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                  active.category === "retinoid" || active.category === "exfoliant_aha"
                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                    : active.category === "barrier_repair"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-stone-100 text-stone-700"
                }`}
              >
                {active.name} {active.concentration && `(${active.concentration})`}
              </span>
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-5 pt-3 border-t border-stone-100">
          <button
            onClick={() => !isInCart && addItem(product)}
            disabled={isInCart}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
              isInCart
                ? "bg-stone-100 text-stone-500 cursor-default"
                : "bg-stone-900 hover:bg-stone-800 text-white shadow-xs hover:shadow-md"
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>In Bag</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
