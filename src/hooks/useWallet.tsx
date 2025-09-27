import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { ethers } from "ethers";

interface WalletContextType {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  provider: ethers.BrowserProvider | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const connect = async () => {
    if (typeof window.ethereum === "undefined") {
      alert(
        "MetaMask is not installed! Please install MetaMask and try again."
      );
      return;
    }

    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        setProvider(provider);
        localStorage.setItem("walletConnected", "true");
        localStorage.setItem("walletAccount", accounts[0]);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
    setProvider(null);
    localStorage.removeItem("walletConnected");
    localStorage.removeItem("walletAccount");
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (
        typeof window.ethereum !== "undefined" &&
        localStorage.getItem("walletConnected")
      ) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_accounts", []);

          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            setProvider(provider);
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAccount(accounts[0]);
          localStorage.setItem("walletAccount", accounts[0]);
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        isConnected,
        isConnecting,
        connect,
        disconnect,
        provider,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
