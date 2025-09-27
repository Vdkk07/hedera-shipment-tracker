import { NextRequest } from "next/server";
import { getRequiredEnv } from "@/lib/hedera";

const MIRROR = process.env.HEDERA_MIRROR_URL || "https://testnet.mirrornode.hedera.com";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tokenId = getRequiredEnv("HEDERA_NFT_TOKEN_ID");
    const topicId = getRequiredEnv("HEDERA_TOPIC_ID");
    const serial = params.id;

    // Fetch NFT metadata for the serial (retry to handle Mirror propagation)
    const nftUrl = `${MIRROR}/api/v1/tokens/${tokenId}/nfts/${serial}`;
    const MAX_RETRIES = 12; // extend retries to better handle propagation
    const BASE_DELAY_MS = 800; // base delay for exponential backoff

    let nftRes: Response | null = null;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      nftRes = await fetch(nftUrl, { cache: "no-store" });
      if (nftRes.ok) break;
      // If not found, wait and retry (Mirror Node may be catching up)
      if (nftRes.status === 404) {
        const delay = Math.round(BASE_DELAY_MS * Math.pow(1.6, attempt));
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      // Other errors: stop early
      break;
    }

    if (!nftRes || !nftRes.ok) {
      if (nftRes?.status === 404) {
        return new Response(
          JSON.stringify({
            error: "NFT not found on Mirror Node",
            details: {
              tokenId,
              serial: Number(serial),
              mirrorUrl: nftUrl,
              hint:
                "Recently minted NFTs can take ~5-30s to appear. Wait a bit and retry. Also confirm your HEDERA_NFT_TOKEN_ID matches the minting token and network (testnet).",
            },
          }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
      const t = await (nftRes ? nftRes.text() : Promise.resolve("Unknown error"));
      return new Response(JSON.stringify({ error: `Mirror NFT fetch failed: ${t}` }), { status: 500 });
    }

    const nft = await nftRes.json();

    let metadata: any = null;
    try {
      if (nft.metadata) {
        const b = Buffer.from(nft.metadata, "base64");
        metadata = JSON.parse(b.toString());
      }
    } catch {}

    // Fetch topic messages and filter by serial
    const msgsRes = await fetch(`${MIRROR}/api/v1/topics/${topicId}/messages?order=asc&limit=200`, { cache: "no-store" });
    if (!msgsRes.ok) {
      const t = await msgsRes.text();
      return new Response(JSON.stringify({ error: `Mirror topic fetch failed: ${t}` }), { status: 500 });
    }
    const msgs = await msgsRes.json();

    const events = (msgs.messages || [])
      .map((m: any) => {
        try {
          const body = JSON.parse(Buffer.from(m.message, "base64").toString());
          return {
            consensus_timestamp: m.consensus_timestamp,
            transaction_id: m.payer_account_id ? `${m.payer_account_id}@${m.consensus_timestamp}` : undefined,
            ...body,
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .filter((e: any) => Number(e.shipmentSerial) === Number(serial));

    return new Response(
      JSON.stringify({ tokenId, serial: Number(serial), metadata, nft, events }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message || "Failed to fetch shipment" }), { status: 500 });
  }
}