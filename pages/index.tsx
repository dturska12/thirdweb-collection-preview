import { useContract, useNFTs, SmartContract, useTotalCount } from "@thirdweb-dev/react";
import React, { useState, useContext } from "react";
import Container from "../components/Container/Container";
import NFTGrid from "../components/NFT/NFTGrid";
import { BaseContract } from "ethers";
import ChainContext from "../context/Chain";

const loadSupply = (contract: SmartContract<BaseContract> | undefined) => {
  const { data: count, isLoading, error } = useTotalCount(contract);
  if (!isLoading) {
    return count?.toNumber();
  }
};

export default function Buy() {
  const [contractAddress, setContractAddress] = useState("");
  const { selectedChain, setSelectedChain } = useContext(ChainContext);

  const { contract } = useContract(contractAddress);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(25);

  const loadMore = () => {
    setStart(end);
    setEnd(end + 25);
  };

  const supply = loadSupply(contract);

  const { data, isLoading } = useNFTs(contract, { start: start, count: end });

  const handleChainChange = (e: { target: { value: string; }; }) => {
    setSelectedChain(e.target.value);
  };

  return (
    <Container maxWidth="lg">
      <h1>Preview your NFTs before you mint!</h1>
      <input
        type="text"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #111111",
          backgroundColor: "#111111",
          borderRadius: "4px",
          width: "400px"
        }}
        placeholder="Enter contract address"
      />
      <h2>Select your chain</h2>
      <select
        value={selectedChain}
        onChange={handleChainChange}
        style={{
          padding: "10px",
          fontSize: "16px",
          border: "1px solid #111111",
          backgroundColor: "#111111",
          borderRadius: "4px",
          width: "400px"
        }}
      >
        <option value="ethereum">Ethereum</option>
        <option value="polygon">Polygon</option>
        <option value="goerli">Goerli</option>
        <option value="arbitrum">Arbitrum One</option>
        <option value="arbitrum-goerli">Arbitrum Goerli</option>
        <option value="optimisim">Optimism</option>
        <option value="binance">Binance SmartChain</option>
        <option value="binance-testnet">Binance SmartChain Testnt</option>
        <option value="fantom">Fantom Opera</option>
        <option value="fantom-testnet">Fantom Testnet</option>
        <option value="avalanche-fuji">Avalanche C Chain</option>
        <option value="avalanche-fuji-testnet">Avalanche Fuji Testnet</option>
      </select>

      <NFTGrid
        data={data}
        isLoading={isLoading}
        emptyText={
          "Looks like there are no NFTs in this collection. Did you import your contract on the thirdweb dashboard? https://thirdweb.com/dashboard"
        }
      />
      
      {supply && end < supply && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={loadMore}>
            Load 25 more
          </button>
        </div>
      )}
      
      <div></div>
    </Container>
  );
}
