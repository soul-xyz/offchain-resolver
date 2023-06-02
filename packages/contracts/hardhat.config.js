require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('hardhat-deploy');
require('hardhat-deploy-ethers');

const gatewayurl =
  'http://ccip-read-gateway-env.eba-43ukavvq.us-west-2.elasticbeanstalk.com/{sender}/{data}.json';

let devgatewayurl = 'http://localhost:8080/{sender}/{data}.json';
if (process.env.REMOTE_GATEWAY) {
  devgatewayurl =
    `${process.env.REMOTE_GATEWAY}/{sender}/{data}.json`;
}

const { alchemyAPIKey, deployerPrivateKey, etherscanAPIKey, coinmarketcapAPIKey } = require('./env.json');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: '0.8.10',
  networks: {
    hardhat: {
      throwOnCallFailures: false,
      gatewayurl: devgatewayurl,
    },
    goerli: {
      url: `http://eth-goerli.alchemyapi.io/v2/${alchemyAPIKey}`,
      accounts: [deployerPrivateKey],
      gatewayurl,
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${alchemyAPIKey}`,
      accounts: [deployerPrivateKey],
      gatewayurl,
    },
  },
  etherscan: {
    apiKey: etherscanAPIKey,
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    coinmarketcap: coinmarketcapAPIKey,
  },
  namedAccounts: {
    signer: {
      default: '0x6a6D58A605049191a1F2845C63B79ae73DFe920b',
    },
    deployer: {
      default: 1,
    },
  },
};