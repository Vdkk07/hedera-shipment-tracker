"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="space-y-1">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export default function Dashboard() {
  // Create Shipment
  const [shipmentId, setShipmentId] = useState("");
  const [description, setDescription] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const [createdResult, setCreatedResult] = useState<any | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createWarn, setCreateWarn] = useState<string | null>(null);

  // Update Status
  const [updateSerial, setUpdateSerial] = useState("");
  const [updateFile, setUpdateFile] = useState<File | null>(null);
  const [updatingType, setUpdatingType] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateOk, setUpdateOk] = useState<string | null>(null);
  const [updateWarn, setUpdateWarn] = useState<string | null>(null);

  // Timeline
  const [timelineSerial, setTimelineSerial] = useState("");
  const [loadingTimeline, setLoadingTimeline] = useState(false);
  const [timeline, setTimeline] = useState<any | null>(null);
  const [timelineError, setTimelineError] = useState<string | null>(null);

  const hasCreateInputs = shipmentId.trim().length > 0;
  const validSerialForUpdate = useMemo(() => updateSerial && !Number.isNaN(Number(updateSerial)), [updateSerial]);
  const validSerialForTimeline = useMemo(() => timelineSerial && !Number.isNaN(Number(timelineSerial)), [timelineSerial]);

  async function uploadToIPFS(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/storage/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
    const data = await res.json();
    return data.cid as string;
  }

  async function handleCreateShipment() {
    try {
      setCreating(true);
      setCreateError(null);
      setCreateWarn(null);
      setCreatedResult(null);
      let cid: string | undefined = undefined;
      if (docFile) {
        try {
          cid = await uploadToIPFS(docFile);
        } catch (e: any) {
          const msg = String(e?.message || "").toLowerCase();
          if (msg.includes("maintenance")) {
            setCreateWarn("File upload service under maintenance. Proceeding without attaching a file.");
          } else {
            throw e;
          }
        }
      }
      const res = await fetch("/api/shipment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipmentId, description, cid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create shipment");
      setCreatedResult(data);
    } catch (e: any) {
      setCreateError(e.message || "Failed to create shipment");
    } finally {
      setCreating(false);
    }
  }

  async function postEvent(eventType: string) {
    try {
      setUpdatingType(eventType);
      setUpdateError(null);
      setUpdateOk(null);
      setUpdateWarn(null);
      let cid: string | undefined = undefined;
      if (updateFile) {
        try {
          cid = await uploadToIPFS(updateFile);
        } catch (e: any) {
          const msg = String(e?.message || "").toLowerCase();
          if (msg.includes("maintenance")) {
            setUpdateWarn("File upload service under maintenance. Submitting event without attachment.");
          } else {
            throw e;
          }
        }
      }
      const res = await fetch("/api/shipment/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType, shipmentSerial: Number(updateSerial), cid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit event");
      setUpdateOk(`${eventType} submitted`);
    } catch (e: any) {
      setUpdateError(e.message || "Failed to submit event");
    } finally {
      setUpdatingType(null);
    }
  }

  async function fetchTimeline() {
    if (!validSerialForTimeline) return;
    try {
      setLoadingTimeline(true);
      setTimelineError(null);
      setTimeline(null);
      const res = await fetch(`/api/shipment/${Number(timelineSerial)}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load timeline");
      setTimeline(data);
    } catch (e: any) {
      setTimelineError(e.message || "Failed to load timeline");
    } finally {
      setLoadingTimeline(false);
    }
  }

  function formatTs(ts?: string) {
    if (!ts) return "";
    const n = Number(ts.split(".")[0]) * 1000;
    return new Date(n).toLocaleString();
  }

  return (
    <div className="min-h-screen w-full px-4 py-8 sm:px-8">
      <header className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hedera Logistics MVP</h1>
          <p className="text-sm text-muted-foreground">HTS NFTs for shipments • HCS for events • IPFS/Filecoin for docs</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Badge>Testnet</Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Create Shipment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Shipment ID</label>
              <Input
                placeholder="e.g. SHP-00123"
                value={shipmentId}
                onChange={(e) => setShipmentId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="What is in the shipment?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Attach document or image (optional)</label>
              <Input type="file" accept="image/*,application/pdf" onChange={(e) => setDocFile(e.target.files?.[0] || null)} />
            </div>
            {createError ? (
              <p className="text-sm text-destructive">{createError}</p>
            ) : null}
            {createWarn ? (
              <p className="text-xs text-amber-600 dark:text-amber-400">{createWarn}</p>
            ) : null}
            {createdResult ? (
              <div className="text-sm rounded-md border p-3">
                <div className="font-medium">Shipment created</div>
                <div className="mt-1 space-y-1">
                  <div>TokenId: <span className="font-mono">{createdResult.tokenId}</span></div>
                  <div>Serial: <span className="font-mono">{createdResult.serial}</span></div>
                  <div>Tx: <span className="font-mono break-all">{createdResult.transactionId}</span></div>
                </div>
              </div>
            ) : null}
            <Button onClick={handleCreateShipment} disabled={!hasCreateInputs || creating} className="w-full">
              {creating ? "Minting..." : "Mint NFT (Create Shipment)"}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Shipment Serial (NFT)</label>
              <Input
                placeholder="e.g. 1"
                value={updateSerial}
                onChange={(e) => setUpdateSerial(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Attach doc/image for this event (optional)</label>
              <Input type="file" accept="image/*,application/pdf" onChange={(e) => setUpdateFile(e.target.files?.[0] || null)} />
            </div>
            {updateError ? <p className="text-sm text-destructive">{updateError}</p> : null}
            {updateOk ? <p className="text-sm text-green-600 dark:text-green-400">{updateOk}</p> : null}
            {updateWarn ? <p className="text-xs text-amber-600 dark:text-amber-400">{updateWarn}</p> : null}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" disabled={!validSerialForUpdate || updatingType !== null} onClick={() => postEvent("PICKED_UP")}>Picked Up</Button>
              <Button variant="secondary" disabled={!validSerialForUpdate || updatingType !== null} onClick={() => postEvent("IN_TRANSIT")}>In Transit</Button>
              <Button variant="secondary" disabled={!validSerialForUpdate || updatingType !== null} onClick={() => postEvent("DELIVERED")}>Delivered</Button>
              <Button variant="outline" disabled={!validSerialForUpdate || updatingType !== null} onClick={() => postEvent("CUSTOM")}>
                Custom Event
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Timeline View</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="text-sm font-medium">Shipment Serial (NFT)</label>
                <Input
                  placeholder="e.g. 1"
                  value={timelineSerial}
                  onChange={(e) => setTimelineSerial(e.target.value)}
                />
              </div>
              <Button onClick={fetchTimeline} disabled={!validSerialForTimeline || loadingTimeline}>
                {loadingTimeline ? "Loading..." : "Fetch"}
              </Button>
            </div>
            {timelineError ? <p className="text-sm text-destructive">{timelineError}</p> : null}
            {timeline ? (
              <div className="space-y-3">
                <div className="rounded-md border p-3 text-sm">
                  <div className="font-medium mb-1">NFT</div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    <div className="text-muted-foreground">TokenId</div>
                    <div className="font-mono break-all">{timeline.tokenId}</div>
                    <div className="text-muted-foreground">Serial</div>
                    <div className="font-mono">{timeline.serial}</div>
                    {timeline.metadata?.shipmentId ? <><div className="text-muted-foreground">Shipment ID</div><div className="font-mono">{timeline.metadata.shipmentId}</div></> : null}
                    {timeline.metadata?.cid ? <><div className="text-muted-foreground">CID</div><div className="font-mono break-all">{timeline.metadata.cid}</div></> : null}
                  </div>
                </div>
                <Separator />
                <SectionHeading title="Events" description="From Hedera Mirror Node (HCS)" />
                <div className="space-y-2">
                  {timeline.events?.length ? (
                    timeline.events.map((e: any, idx: number) => (
                      <div key={idx} className="rounded-md border p-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{e.eventType}</Badge>
                          <span className="text-xs text-muted-foreground">{formatTs(e.consensus_timestamp)}</span>
                        </div>
                        <div className="mt-2 text-xs font-mono break-all">
                          {e.transaction_id || ""}
                        </div>
                        {e.cid ? (
                          <div className="mt-2 text-sm">
                            CID: <span className="font-mono break-all">{e.cid}</span>
                          </div>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No events found.</p>
                  )}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <footer className="mt-10 text-xs text-muted-foreground">
        Use Hedera Testnet. Store docs on IPFS/Filecoin via web3.storage. This is a hackathon MVP.
      </footer>
    </div>
  );
}