import { NextRequest } from "next/server";
import { getHederaClient, getRequiredEnv } from "@/lib/hedera";
import {
  TokenMintTransaction,
} from "@hashgraph/sdk";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description, cid, shipmentId } = body as {
      description: string;
      cid?: string;
      shipmentId: string;
    };

    if (!shipmentId) {
      return new Response(JSON.stringify({ error: "shipmentId is required" }), { status: 400 });
    }

    const tokenId = getRequiredEnv("HEDERA_NFT_TOKEN_ID");

    const metadataObj = {
      shipmentId,
      description: description || "",
      cid: cid || null,
      createdAt: new Date().toISOString(),
    };
    const metadata = Buffer.from(JSON.stringify(metadataObj));

    const client = getHederaClient();
    const tx = await new TokenMintTransaction()
      .setTokenId(tokenId)
      .setMetadata([metadata])
      .execute(client);

    const receipt = await tx.getReceipt(client);

    const serials = receipt.serials ?? [];
    const serial = serials[0]?.toNumber?.() ?? serials[0];

    return new Response(
      JSON.stringify({
        tokenId,
        serial,
        transactionId: tx.transactionId?.toString?.() ?? "",
        metadata: metadataObj,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message || "Failed to mint NFT" }), { status: 500 });
  }
}