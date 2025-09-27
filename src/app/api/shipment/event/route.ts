import { NextRequest } from "next/server";
import { getHederaClient, getRequiredEnv } from "@/lib/hedera";
import { TopicMessageSubmitTransaction } from "@hashgraph/sdk";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventType, shipmentSerial, cid } = body as {
      eventType: "CREATED" | "PICKED_UP" | "IN_TRANSIT" | "DELIVERED" | string;
      shipmentSerial: number | string;
      cid?: string;
    };

    if (!eventType || shipmentSerial === undefined || shipmentSerial === null) {
      return new Response(JSON.stringify({ error: "eventType and shipmentSerial are required" }), { status: 400 });
    }

    const topicId = getRequiredEnv("HEDERA_TOPIC_ID");

    const message = {
      eventType,
      shipmentSerial: Number(shipmentSerial),
      cid: cid || null,
      at: new Date().toISOString(),
    };

    const client = getHederaClient();
    const tx = await new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(JSON.stringify(message))
      .execute(client);

    const receipt = await tx.getReceipt(client);

    return new Response(
      JSON.stringify({
        topicId,
        transactionId: tx.transactionId?.toString?.() ?? "",
        status: receipt.status?.toString?.() ?? "SUCCESS",
        message,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message || "Failed to submit event" }), { status: 500 });
  }
}