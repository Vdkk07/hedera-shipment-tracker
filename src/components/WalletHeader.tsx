import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { LogOut, Copy, Check } from "lucide-react";
import { useState } from "react";

export const WalletHeader = () => {
  const { account, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm font-mono">
          {account ? formatAddress(account) : "Not connected"}
        </span>
        {account && (
          <Button
            variant="ghost"
            size="sm"
            onClick={copyAddress}
            className="h-6 w-6 p-0"
          >
            {copied ? (
              <Check className="h-3 w-3" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
      <Button variant="outline" size="sm" onClick={disconnect}>
        <LogOut className="h-4 w-4 mr-2" />
        Disconnect
      </Button>
    </div>
  );
};
