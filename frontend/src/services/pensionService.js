import { openContractCall } from '@stacks/connect';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import {
  uintCV,
  principalCV,
  PostConditionMode,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
} from '@stacks/transactions';
import { CONTRACT_ID, NETWORK_KEY, getContractParts } from '../config';

const { contractAddress, contractName } = getContractParts();
const network = NETWORK_KEY === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

function requireContractConfigured() {
  if (!contractAddress || !contractName) throw new Error('Contract ID not configured');
}

// Approximate date -> unlock block height assuming ~10s per block
export function estimateUnlockBlockFromDate(date) {
  const avgSecondsPerBlock = 10; // adjust if desired
  const now = new Date();
  const diffSeconds = Math.max(0, (new Date(date).getTime() - now.getTime()) / 1000);
  const blocksFromNow = Math.ceil(diffSeconds / avgSecondsPerBlock);
  // In frontend we don't know current chain height; use blocks-from-now, contract checks >= unlock.
  // You may fetch current height from API to compute absolute; for now we pass relative future height.
  return blocksFromNow;
}

export async function enroll({ planId, unlockBn, beneficiary }) {
  requireContractConfigured();
  return openContractCall({
    network,
    contractAddress,
    contractName,
    functionName: 'enroll',
    functionArgs: [uintCV(planId), uintCV(unlockBn), principalCV(beneficiary)],
    appDetails: { name: 'Micro-Pension', icon: 'https://via.placeholder.com/32x32' },
  });
}

export async function proofOfLife() {
  requireContractConfigured();
  return openContractCall({
    network,
    contractAddress,
    contractName,
    functionName: 'proof-of-life',
    functionArgs: [],
    appDetails: { name: 'Micro-Pension', icon: 'https://via.placeholder.com/32x32' },
  });
}

export async function claim() {
  requireContractConfigured();
  return openContractCall({
    network,
    contractAddress,
    contractName,
    functionName: 'claim',
    functionArgs: [],
    appDetails: { name: 'Micro-Pension', icon: 'https://via.placeholder.com/32x32' },
  });
}

export async function exitEarly() {
  requireContractConfigured();
  return openContractCall({
    network,
    contractAddress,
    contractName,
    functionName: 'exit-early',
    functionArgs: [],
    appDetails: { name: 'Micro-Pension', icon: 'https://via.placeholder.com/32x32' },
  });
}

export async function claimAsBeneficiary({ owner }) {
  requireContractConfigured();
  return openContractCall({
    network,
    contractAddress,
    contractName,
    functionName: 'claim-as-beneficiary',
    functionArgs: [principalCV(owner)],
    appDetails: { name: 'Micro-Pension', icon: 'https://via.placeholder.com/32x32' },
  });
}

export async function contribute({ amountUstx }) {
  requireContractConfigured();
  return openContractCall({
    network,
    contractAddress,
    contractName,
    functionName: 'contribute',
    functionArgs: [],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [
      makeStandardSTXPostCondition(
        undefined,
        FungibleConditionCode.LessEqual,
        BigInt(amountUstx)
      ),
    ],
    appDetails: { name: 'Micro-Pension', icon: 'https://via.placeholder.com/32x32' },
  });
}
