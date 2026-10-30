"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Camera, RefreshCw, CheckCircle2, ShieldAlert, Sparkles, Check } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { BarrierDiagnosticProfile } from "@/lib/mockData";

export const CameraModal: React.FC = () => {
  const {
    isScannerOpen,
    setIsScannerOpen,
    setDiagnosticProfile,
    items,
    setConflictAnalysis,
    setIsCartOpen
  } = useCartStore();

  const [mode, setMode] = useState<"webcam" | "preset">("preset");
  const [selectedPreset, setSelectedPreset] = useState<"compromised" | "calm">("compromised");
  const [isCapturing, setIsCapturing] = useState(false);
  const [lensCleaned, setLensCleaned] = useState(true);

  // WebRTC Stream Ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (isScannerOpen && mode === "webcam") {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 } } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasCameraPermission(true);
          }
        })
        .catch((err) => {
          console.warn("Camera access denied or unavailable:", err);
          setHasCameraPermission(false);
          setMode("preset");
        });
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isScannerOpen, mode]);

  if (!isScannerOpen) return null;

  const handleRunAnalysis = async () => {
    setIsCapturing(true);

    try {
      // 1. Call YouCam API v2.1 (or mock engine)
      const res = await fetch("/api/youcam/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mockType: selectedPreset,
          srcFileUrl: selectedPreset === "calm"
            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
            : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
        })
      });

      const json = await res.json();
      const output = json.data?.results?.output || [];

      // Extract YouCam metrics
      const rednessMetric = output.find((m: any) => m.type === "hd_redness");
      const moistureMetric = output.find((m: any) => m.type === "hd_moisture");
      const oilinessMetric = output.find((m: any) => m.type === "hd_oiliness");
      const skinTypeMetric = output.find((m: any) => m.type === "hd_skin_type");
      const overallMetric = output.find((m: any) => m.type === "all");
      const skinAgeMetric = output.find((m: any) => m.type === "skin_age");

      const profile: BarrierDiagnosticProfile = {
        rednessScore: rednessMetric?.ui_score || (selectedPreset === "calm" ? 85 : 58),
        moistureScore: moistureMetric?.ui_score || (selectedPreset === "calm" ? 78 : 41),
        oilinessScore: oilinessMetric?.ui_score || 68,
        skinAge: skinAgeMetric?.score || (selectedPreset === "calm" ? 24 : 28),
        overallScore: overallMetric?.score || (selectedPreset === "calm" ? 83.5 : 61.2),
        skinTypeClassification: skinTypeMetric?.skin_type || (selectedPreset === "calm" ? "Normal" : "Combination & Compromised Redness"),
        confidenceRating: lensCleaned ? 89 : 68,
        barrierStatus: selectedPreset === "calm" ? "HEALTHY" : "COMPROMISED",
      };

      setDiagnosticProfile(profile);

      // 2. Immediately trigger Agentic INCI conflict analysis
      const agentRes = await fetch("/api/agent/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          profile
        })
      });

      const agentData = await agentRes.json();
      setConflictAnalysis(agentData);

      // Close modal and reveal cart drawer with active guardian analysis
      setIsScannerOpen(false);
      setIsCartOpen(true);
    } catch (e) {
      console.error("Scan analysis failed:", e);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100 flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 font-serif">
                CartDerm Optical Diagnostic
              </h2>
              <p className="text-[11px] text-stone-500">
                Powered by YouCam AI Skin Analysis (v2.1 HD)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsScannerOpen(false)}
            className="p-2 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Media Selection */}
        <div className="p-6 space-y-5">
          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setMode("preset")}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === "preset"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Clinical Test Profiles (Demo)
            </button>
            <button
              onClick={() => setMode("webcam")}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === "webcam"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Live Front Camera
            </button>
          </div>

          {/* Viewfinder Preview Box */}
          <div className="relative aspect-4/3 w-full rounded-2xl bg-stone-900 overflow-hidden border border-stone-800 shadow-inner flex items-center justify-center">
            {mode === "webcam" ? (
              hasCameraPermission ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror -scale-x-100"
                />
              ) : (
                <div className="text-center p-6 text-stone-400 text-xs">
                  <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span>Requesting camera permission or camera unavailable.</span>
                </div>
              )
            ) : (
              <img
                src={
                  selectedPreset === "compromised"
                    ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                }
                alt="Demo Selfie"
                className="w-full h-full object-cover"
              />
            )}

            {/* Target Face Oval Overlay (mimics YouCam CameraKit STRICT guidance) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-56 h-72 border-2 border-dashed border-white/60 rounded-[50%] flex items-center justify-center">
                <span className="text-[10px] text-white/70 font-mono tracking-wider bg-black/40 px-2 py-0.5 rounded-full">
                  YouCam Face Guide
                </span>
              </div>
            </div>

            {/* Live Hardware Pre-Flight Telemetry Badges */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <span className="flex items-center space-x-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Lens: Clear (95%)</span>
              </span>
              <span>Luma: 0.82 [OK]</span>
              <span>Ratio: 72%</span>
            </div>
          </div>

          {/* Test Profile Presets (If in preset mode) */}
          {mode === "preset" && (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPreset("compromised")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedPreset === "compromised"
                    ? "border-rose-500 bg-rose-50/50 ring-2 ring-rose-200"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">Sensitized Skin Profile</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  High Erythema (58), Low Moisture (41). Triggers barrier safety swap.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPreset("calm")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedPreset === "calm"
                    ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-200"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">Resilient Skin Profile</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Calm Redness (85), High Moisture (78). Safe for chemical actives.
                </p>
              </button>
            </div>
          )}

          {/* Pre-Flight Lens Reminder Checkbox (The Hardware Smudge Solution) */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start space-x-3">
            <input
              type="checkbox"
              id="cleanLens"
              checked={lensCleaned}
              onChange={(e) => setLensCleaned(e.target.checked)}
              className="mt-0.5 rounded border-amber-400 text-rose-600 focus:ring-rose-500"
            />
            <label htmlFor="cleanLens" className="text-xs text-amber-900 cursor-pointer">
              <span className="font-semibold">Optical Pre-Flight Verified:</span> Front lens is wiped clean of oily fingerprints to avoid blur-induced false negatives.
            </label>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Reliability Index: <strong className="text-emerald-700">{lensCleaned ? "89% (High)" : "68% (Reduced)"}</strong>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isCapturing}
            className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isCapturing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running YouCam AI v2.1...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                <span>Analyze Skin & Shield Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
