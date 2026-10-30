import { YouCamSkinAnalysisResult, MOCK_DIAGNOSTIC_COMPROMISED } from "./mockData";

const BASE_URL = process.env.YOUCAM_BASE_URL || "https://yce-api-01.makeupar.com";
const API_KEY = process.env.YOUCAM_API_KEY || "";
const IS_MOCK = process.env.MOCK_YOUCAM === "true" || !API_KEY;

export async function submitSkinAnalysisTask(params: {
  srcFileId?: string;
  srcFileUrl?: string;
  dstActions?: string[];
  mockType?: "compromised" | "calm";
}): Promise<{ taskId: string }> {
  if (IS_MOCK) {
    console.log("[YouCam Client] Running in Mock Mode - Returning mock taskId");
    return { taskId: params.mockType === "calm" ? "mock_task_calm_4119c" : "mock_task_comp_9281a" };
  }

  const endpoint = `${BASE_URL}/s2s/v2.1/task/skin-analysis`;
  const defaultActions = [
    "hd_redness",
    "hd_moisture",
    "hd_oiliness",
    "hd_acne",
    "hd_skin_type"
  ];

  const payload: Record<string, unknown> = {
    dst_actions: params.dstActions || defaultActions,
    format: "json",
    miniserver_args: {
      enable_mask_overlay: true
    }
  };

  if (params.srcFileId) {
    payload.src_file_id = params.srcFileId;
  } else if (params.srcFileUrl) {
    payload.src_file_url = params.srcFileUrl;
  } else {
    throw new Error("Either srcFileId or srcFileUrl must be provided to YouCam API.");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`YouCam Task Submission Error (${res.status}): ${errorText}`);
  }

  const json = await res.json();
  return { taskId: json.data.task_id };
}

export async function getSkinAnalysisResult(taskId: string): Promise<YouCamSkinAnalysisResult> {
  if (IS_MOCK || taskId.startsWith("mock_task_")) {
    console.log(`[YouCam Client] Mock Polling for taskId: ${taskId}`);
    return MOCK_DIAGNOSTIC_COMPROMISED;
  }

  const endpoint = `${BASE_URL}/s2s/v2.1/task/skin-analysis/${taskId}`;
  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`YouCam Status Polling Error (${res.status}): ${errorText}`);
  }

  const json = await res.json();
  return {
    task_id: taskId,
    task_status: json.data.task_status,
    error: json.data.error,
    error_message: json.data.error_message,
    results: json.data.results
  };
}
