import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWallet } from "@/hooks/useWallet";
import { Wallet, Loader2 } from "lucide-react";

export const WalletConnect = () => {
  const { connect, isConnecting } = useWallet();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Connect Your Wallet
          </CardTitle>
          <CardDescription>
            Connect your MetaMask or Ethereum wallet to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={connect}
            disabled={isConnecting}
            className="w-full"
            size="lg"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect MetaMask
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground text-center mt-4">
            Make sure you have MetaMask installed in your browser
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
