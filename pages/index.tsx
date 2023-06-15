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
  const [end, setEnd] = useState(500); // Updated to load 500 NFTs

  const loadMore = () => {
    setStart(end);
    setEnd(end + 500); // Updated to load 500 more NFTs
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
        {/* Options for different blockchain networks */}
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
            Load 500 more
          </button>
        </div>
      )}

      <div></div>
    </Container>
  );
}
