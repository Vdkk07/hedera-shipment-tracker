import { NextRequest } from "next/server";
import { getRequiredEnv } from "@/lib/hedera";
import { Web3Storage } from "web3.storage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof Blob)) {
      return new Response(JSON.stringify({ error: "file is required as multipart/form-data" }), { status: 400 });
    }

    const token = getRequiredEnv("WEB3_STORAGE_TOKEN");
    const client = new Web3Storage({ token });

    // Retry upload a few times to gracefully handle brief maintenance windows
    const attempts = 3;
    let lastError: any = null;
    for (let i = 0; i < attempts; i++) {
      try {
        // File from Next FormData is already a Blob with name and type
        // @ts-ignore - web3.storage accepts Blob/File; Next exposes as Blob
        const cid = await client.put([file as any], { wrapWithDirectory: false });
        return new Response(JSON.stringify({ cid }), { status: 200, headers: { "Content-Type": "application/json" } });
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || "").toLowerCase();
        // If service is under maintenance, no need to keep retrying aggressively
        if (msg.includes("maintenance")) break;
        // small backoff before next try
        await new Promise((r) => setTimeout(r, 500 * (i + 1)));
      }
    }

    const message = String(lastError?.message || "Failed to upload to IPFS");
    const isMaintenance = message.toLowerCase().includes("maintenance");

    if (isMaintenance) {
      return new Response(
        JSON.stringify({
          error: "Web3.Storage is undergoing maintenance. Please try again later or proceed without attaching a file.",
          code: "WEB3_STORAGE_MAINTENANCE",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message || "Failed to upload to IPFS" }), { status: 500 });
  }
}