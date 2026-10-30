import { NextResponse } from "next/server";
import { submitSkinAnalysisTask, getSkinAnalysisResult } from "@/lib/youcam";
import { MOCK_DIAGNOSTIC_COMPROMISED, MOCK_DIAGNOSTIC_CALM } from "@/lib/mockData";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mockType, srcFileUrl } = body;

    const isMock = process.env.MOCK_YOUCAM === "true" || !process.env.YOUCAM_API_KEY;

    if (isMock) {
      // Simulate real-world network latency (800ms) for realistic UX
      await new Promise((r) => setTimeout(r, 800));
      const mockResult = mockType === "calm" ? MOCK_DIAGNOSTIC_CALM : MOCK_DIAGNOSTIC_COMPROMISED;
      return NextResponse.json({
        success: true,
        source: "mock_engine",
        data: mockResult
      });
    }

    // Call live YouCam API v2.1
    const { taskId } = await submitSkinAnalysisTask({
      srcFileUrl: srcFileUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
      dstActions: [
        "hd_redness",
        "hd_moisture",
        "hd_oiliness",
        "hd_acne",
        "hd_skin_type"
      ]
    });

    // Poll until completion (or up to 15 seconds)
    let attempts = 0;
    while (attempts < 8) {
      await new Promise((r) => setTimeout(r, 2000));
      const result = await getSkinAnalysisResult(taskId);
      if (result.task_status === "success") {
        return NextResponse.json({
          success: true,
          source: "youcam_v2.1",
          data: result
        });
      }
      if (result.task_status === "error") {
        return NextResponse.json({
          success: false,
          error: result.error || "YouCam processing error",
          message: result.error_message
        }, { status: 422 });
      }
      attempts++;
    }

    return NextResponse.json({
      success: true,
      source: "youcam_v2.1_pending",
      data: { taskId, status: "processing" }
    });
  } catch (error: any) {
    console.error("API /api/youcam/task Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to process skin analysis"
    }, { status: 500 });
  }
}
