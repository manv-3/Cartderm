"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle, ShieldAlert, Sparkles, ArrowRight, RefreshCw, HelpCircle } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export const ConflictCard: React.FC = () => {
  const {
    diagnosticProfile,
    conflictAnalysis,
    setConflictAnalysis,
    swapProduct,
    items,
    userTriangulationResponse,
    setUserTriangulationResponse
  } = useCartStore();

  const [isTriangulating, setIsTriangulating] = useState(false);

  if (!diagnosticProfile) return null;

  const handleTriangulate = async (responseType: "stinging" | "warm_lighting") => {
    setIsTriangulating(true);
    setUserTriangulationResponse(responseType);

    try {
      const res = await fetch("/api/agent/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          profile: diagnosticProfile,
          userTriangulationResponse: responseType
        })
      });

      const updatedAnalysis = await res.json();
      setConflictAnalysis(updatedAnalysis);
    } catch (e) {
      console.error("Triangulation update failed:", e);
    } finally {
      setIsTriangulating(false);
    }
  };

  const isSafe = conflictAnalysis?.safetyStatus === "SAFE";
  const swap = conflictAnalysis?.swapRecommendation;

  return (
    <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 shadow-xs space-y-4">
      {/* 1. YouCam AI Skin Diagnostic Telemetry Banner */}
      <div className="bg-white rounded-xl p-3 border border-stone-100 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-800">
          <span className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>YouCam v2.1 HD Diagnostic</span>
          </span>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-mono font-medium">
            Reliability: {diagnosticProfile.confidenceRating}%
          </span>
        </div>

        {/* Diagnostic Score Bars */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
          <div className="bg-stone-50 p-2 rounded-lg border border-stone-100">
            <span className="text-[10px] text-stone-400 block font-sans">Erythema (Redness)</span>
            <span className={`text-xs font-bold ${diagnosticProfile.rednessScore < 65 ? "text-rose-600" : "text-stone-800"}`}>
              {diagnosticProfile.rednessScore}/100 {diagnosticProfile.rednessScore < 65 ? "⚠️" : ""}
            </span>
          </div>

          <div className="bg-stone-50 p-2 rounded-lg border border-stone-100">
            <span className="text-[10px] text-stone-400 block font-sans">Hydration (Moisture)</span>
            <span className={`text-xs font-bold ${diagnosticProfile.moistureScore < 50 ? "text-amber-600" : "text-stone-800"}`}>
              {diagnosticProfile.moistureScore}/100 {diagnosticProfile.moistureScore < 50 ? "⚠️" : ""}
            </span>
          </div>

          <div className="bg-stone-50 p-2 rounded-lg border border-stone-100">
            <span className="text-[10px] text-stone-400 block font-sans">Skin Type</span>
            <span className="text-[11px] font-bold text-stone-800 line-clamp-1">
              {diagnosticProfile.skinTypeClassification.split(" ")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Agent Conflict Analysis / Safety Status */}
      {isSafe ? (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-start space-x-3 text-emerald-900">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold flex items-center space-x-2">
              <span>{conflictAnalysis?.summary}</span>
              <span className="bg-emerald-200/60 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-mono">
                Match: {conflictAnalysis?.barrierMatchScore}%
              </span>
            </div>
            <p className="text-emerald-800/90 leading-relaxed">
              {conflictAnalysis?.detailedReasoning}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start space-x-3 text-rose-900">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold flex items-center space-x-2">
              <span>{conflictAnalysis?.summary}</span>
              <span className="bg-rose-200 text-rose-800 text-[10px] px-1.5 py-0.2 rounded font-mono">
                Match: {conflictAnalysis?.barrierMatchScore}%
              </span>
            </div>
            <p className="text-rose-800/90 leading-relaxed">
              {conflictAnalysis?.detailedReasoning}
            </p>
          </div>
        </div>
      )}

      {/* 3. The Agentic Triangulation Micro-Question (Solving Hardware / Lighting Bias) */}
      {!isSafe && conflictAnalysis?.triangulationQuestion && !userTriangulationResponse && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 space-y-2.5 animate-in fade-in">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-900">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>Agentic Triangulation (Hardware Bias Check):</span>
          </div>
          <p className="text-xs text-amber-800/90 leading-normal">
            {conflictAnalysis.triangulationQuestion}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => handleTriangulate("stinging")}
              disabled={isTriangulating}
              className="flex-1 py-1.5 px-2.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold rounded-lg shadow-2xs transition-colors"
            >
              ⚡ Yes, stinging / irritated
            </button>
            <button
              onClick={() => handleTriangulate("warm_lighting")}
              disabled={isTriangulating}
              className="flex-1 py-1.5 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold rounded-lg border border-stone-200 transition-colors"
            >
              💡 No, warm room lighting
            </button>
          </div>
        </div>
      )}

      {/* 4. 1-Click Recommended Safe Alternative Swap */}
      {swap && !isSafe && (
        <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-900">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>Recommended Safe Replacement</span>
            </span>
            <span className="text-[10px] bg-rose-100 text-rose-700 font-mono px-2 py-0.5 rounded-full font-bold">
              Match: {swap.matchScore}%
            </span>
          </div>

          {/* Swap Product Mini Card */}
          <div className="flex items-center space-x-3 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
            <img
              src={swap.replacementProduct.image}
              alt={swap.replacementProduct.name}
              className="w-12 h-12 rounded-lg object-cover border border-stone-200"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-rose-600 block">
                {swap.replacementProduct.brand}
              </span>
              <h4 className="text-xs font-semibold text-stone-900 truncate">
                {swap.replacementProduct.name}
              </h4>
              <span className="text-xs font-bold text-stone-800 font-mono">
                ${swap.replacementProduct.price.toFixed(2)}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-stone-600 leading-snug">
            💡 <strong>Why this swap:</strong> {swap.benefit}
          </p>

          {/* 1-Click Swap Action Button */}
          <button
            onClick={() => swapProduct(swap.originalProductId, swap.replacementProduct)}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-all hover:shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>One-Click Swap in Bag</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
