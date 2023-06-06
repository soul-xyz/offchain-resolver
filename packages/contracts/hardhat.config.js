require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('hardhat-deploy');
require('hardhat-deploy-ethers');
require('solidity-coverage');

const devgatewayurl =
  'http://ccip-read-gateway-env.eba-43ukavvq.us-west-2.elasticbeanstalk.com/{sender}/{data}.json';


const { alchemyAPIKey, deployerPrivateKey, etherscanAPIKey } = require('./env.json');

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
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${alchemyAPIKey}`,
      accounts: [deployerPrivateKey],
    },
  },
  etherscan: {
    apiKey: etherscanAPIKey,
  },
};