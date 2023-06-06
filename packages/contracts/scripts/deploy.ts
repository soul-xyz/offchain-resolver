import { ethers, network, waffle } from "hardhat";
import fs from "fs";

/*
npx hardhat run --network goerli scripts/deploy.ts

npx hardhat verify --network goerli {address} --constructor-args arguments.js
*/
const config = {
  production: {
    OWNER_ADDRESS: "0xYourProductionOwnerAddress",
    GATEWAY_URL:
      "http://ccip-read-gateway-env.eba-43ukavvq.us-west-2.elasticbeanstalk.com/{sender}/{data}.json",
    SIGNER_ADDRESS: "0xYourProductionSignerAddress"
  },
  test: {
    OWNER_ADDRESS: "0xYourTestOwnerAddress",
    GATEWAY_URL:
      "http://ccip-read-gateway-env.eba-43ukavvq.us-west-2.elasticbeanstalk.com/{sender}/{data}.json",
    SIGNER_ADDRESS: "0xYourTestSignerAddress"
  }
};

const NETWORK_MAP = {
  "1": "mainnet",
  "3": "ropsten",
  "4": "rinkeby",
  "5": "goerli",
  "1337": "hardhat",
  "31337": "hardhat"
};

let isLocal = false;

async function main() {
  const chainId = (await waffle.provider.getNetwork()).chainId;
  const networkName = NETWORK_MAP[chainId];

  console.log(`Deploying to ${networkName}`);

  isLocal = networkName === "hardhat";

  let OWNER_ADDRESS;
  let GATEWAY_URL;
  let SIGNER_ADDRESS;

  if (networkName === "mainnet") {
    ({ OWNER_ADDRESS, GATEWAY_URL, SIGNER_ADDRESS } = config.production);
  } else {
    ({ OWNER_ADDRESS, GATEWAY_URL, SIGNER_ADDRESS } = config.test);
  }

  console.log("Deploying OffchainResolver");

  const OffchainResolver = await ethers.getContractFactory("OffchainResolver");

  console.log('Gateway URL ', GATEWAY_URL, ' signer address', SIGNER_ADDRESS);
  const offchainResolver = await OffchainResolver.deploy(
    GATEWAY_URL,
    [SIGNER_ADDRESS] // You can add more initial signers to the array if needed
  );

  const offchainResolverAddress = (await offchainResolver.deployed()).address;

  console.log({ offchainResolverAddress });

  console.log("Transferring ownership to ", OWNER_ADDRESS);

  await offchainResolver.transferOwnership(OWNER_ADDRESS);

  const info = {
    Contracts: {
      OffchainResolverAddress: offchainResolverAddress
    }
  };

  console.log(info);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
