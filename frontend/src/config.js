export const CONTRACT_ID = process.env.REACT_APP_CONTRACT_ID || '';
export const STACKS_API_URL = process.env.REACT_APP_STACKS_API_URL || 'https://api.testnet.hiro.so';
export const NETWORK_KEY = process.env.REACT_APP_NETWORK || 'testnet';

export const getContractParts = () => {
  if (!CONTRACT_ID.includes('.')) return { contractAddress: '', contractName: '' };
  const [contractAddress, contractName] = CONTRACT_ID.split('.');
  return { contractAddress, contractName };
};
