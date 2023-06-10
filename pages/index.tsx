import { useContract, useNFTs, SmartContract, useTotalCount } from "@thirdweb-dev/react";
import React, { useState } from "react";
import Container from "../components/Container/Container";
import NFTGrid from "../components/NFT/NFTGrid";
import { BaseContract } from "ethers";

const loadSupply = (contract: SmartContract<BaseContract> | undefined) => {

  const { data: count, isLoading, error } = useTotalCount(contract);
  if (!isLoading) {
    return count?.toNumber();
  }
}

export default function Buy() {
  const [contractAddress, setContractAddress] = useState("");

  const { contract } = useContract(contractAddress);
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(25);

  const loadMore = () => {
    setStart(end)
    setEnd(end + 25)
  }

  const supply = loadSupply(contract)

  const { data, isLoading } = useNFTs(contract, { start: start, count: end });

  return (
    <Container maxWidth="lg">
      <h1>Preview your NFTs before you mint!</h1>
      <input
        type="text"
        value={contractAddress}
        onChange={(e) => setContractAddress(e.target.value)}
        style={{
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #111111',
          backgroundColor: '#111111',
          borderRadius: '4px',
          width: '400px'
        }}
        placeholder="Enter contract address"
      />
      <NFTGrid
        data={data}
        isLoading={isLoading}
        emptyText={
          "Looks like there are no NFTs in this collection. Did you import your contract on the thirdweb dashboard? https://thirdweb.com/dashboard"
        }
      />{supply && end < supply && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={loadMore}>
            Load 25 more
          </button>
        </div>
      )}<div>
      </div>
    </Container>
  );
}