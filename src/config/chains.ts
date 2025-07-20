export const CHAIN_CONFIG = {
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://ethereum-rpc.publicnode.com',
    color: '#627EEA',
    chainId: 1,
  },
  polygon: {
    name: 'Polygon',
    symbol: 'MATIC', 
    rpcUrl: 'https://polygon-rpc.com',
    color: '#8247E5',
    chainId: 137,
  },
  arbitrum: {
    name: 'Arbitrum',
    symbol: 'ETH',
    rpcUrl: 'https://arbitrum-one.publicnode.com',
    color: '#28A0F0',
    chainId: 42161,
  },
};

export const UNISWAP_V3_ETH_USDC_POOL = '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640';

export const GAS_LIMITS = {
  transfer: 21000,
  erc20Transfer: 65000,
  swap: 150000,
};