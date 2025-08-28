# Deployment Guide

This guide covers deploying the Micro-Pension system to Stacks testnet and mainnet.

## 🚀 Prerequisites

### Required Tools

- **Stacks CLI**: Latest version installed
- **Hiro Wallet**: For transaction signing
- **Testnet STX**: For testnet deployment
- **Mainnet STX**: For mainnet deployment

### Environment Setup

```bash
# Install Stacks CLI
curl -sL https://stacks.sh | sh

# Verify installation
stacks --version

# Login to your account
stacks login
```

## 🧪 Testnet Deployment

### 1. Prepare Testnet Environment

```bash
# Switch to testnet
stacks config set environment testnet

# Check your testnet balance
stacks balance

# Get testnet STX if needed (faucet)
stacks faucet
```

### 2. Deploy Smart Contract

```bash
# Navigate to contracts directory
cd contracts

# Deploy pension contract
stacks contract publish pension

# Note the contract address from output
# Example: ST1PQHQKV0RJXZFY1YQKNS1NKYCPMD3DVKV1QGSWT.pension
```

### 3. Initialize Contract

```bash
# Add default pension plans
stacks call pension add-plan \
  --args u1 u12 u6 u500 true '"Standard Plan"' \
  --contract ST1PQHQKV0RJXZFY1YQKNS1NKYCPMD3DVKV1QGSWT.pension

stacks call pension add-plan \
  --args u2 u24 u12 u1000 false '"Conservative Plan"' \
  --contract ST1PQHQKV0RJXZFY1YQKNS1NKYCPMD3DVKV1QGSWT.pension

stacks call pension add-plan \
  --args u3 u6 u3 u300 true '"Flexible Plan"' \
  --contract ST1PQHQKV0RJXZFY1YQKNS1NKYCPMD3DVKV1QGSWT.pension
```

### 4. Configure Frontend

```bash
# Update frontend configuration
cd ../frontend

# Edit src/App.js with testnet contract address
# Update network to StacksTestnet
# Update contract address
```

### 5. Test Functionality

```bash
# Start frontend
npm start

# Test complete user flow:
# 1. Connect wallet
# 2. Enroll in plan
# 3. Contribute funds
# 4. Send proof of life
# 5. Test early exit (if allowed)
```

## 🌐 Mainnet Deployment

### 1. Security Checklist

- [ ] Smart contract audited
- [ ] All tests passing
- [ ] Testnet thoroughly tested
- [ ] Admin keys secured
- [ ] Emergency procedures documented
- [ ] Insurance/coverage considered

### 2. Prepare Mainnet Environment

```bash
# Switch to mainnet
stacks config set environment mainnet

# Verify mainnet configuration
stacks config

# Check mainnet balance
stacks balance
```

### 3. Deploy Smart Contract

```bash
# Deploy to mainnet
stacks contract publish pension --mainnet

# Verify deployment
stacks contract info ST1PQHQKV0RJXZFY1YQKNS1NKYCPMD3DVKV1QGSWT.pension
```

### 4. Initialize Mainnet Contract

```bash
# Add pension plans (same as testnet)
stacks call pension add-plan \
  --args u1 u12 u6 u500 true '"Standard Plan"' \
  --contract ST1PQHQKV0RJXZFY1YQKNS1NKYCPMD3DVKV1QGSWT.pension

# Add other plans...
```

### 5. Update Frontend for Production

```bash
# Update configuration for mainnet
# Build production version
npm run build

# Deploy to hosting service
```

## 🔧 Configuration Management

### Environment Variables

Create `.env` files for different environments:

```bash
# .env.testnet
REACT_APP_NETWORK=testnet
REACT_APP_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1YQKNS1NKYCPMD3DVKV1QGSWT.pension
REACT_APP_STACKS_API_URL=https://api.testnet.hiro.so

# .env.mainnet
REACT_APP_NETWORK=mainnet
REACT_APP_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1YQKNS1NKYCPMD3DVKV1QGSWT.pension
REACT_APP_STACKS_API_URL=https://api.hiro.so
```

### Contract Parameters

Key parameters to configure:

```clarity
;; Beneficiary wait period (in blocks)
(define-data-var beneficiary-wait-default uint u10080) ; ~1 week

;; Maximum penalty rate (basis points)
;; 1000 = 10% maximum penalty

;; Plan configurations
;; Standard: 12 months, 6 month cliff, 5% penalty
;; Conservative: 24 months, 12 month cliff, 10% penalty
;; Flexible: 6 months, 3 month cliff, 3% penalty
```

## 📊 Monitoring & Maintenance

### Contract Monitoring

```bash
# Monitor contract events
stacks events ST1PQHQKV0RJXZFY1YQKNS1NKYCPMD3DVKV1QGSWT.pension

# Check contract state
stacks call pension get-community-pool --contract ST1PQHQKV0RJXZFY1YQKNS1NKYCPMD3DVKV1QGSWT.pension
```

### Key Metrics to Track

- **Total Enrollments**: Number of active pension accounts
- **Total Contributions**: Amount of STX locked in pensions
- **Community Pool**: Penalty funds available
- **Beneficiary Claims**: Number of inactivity-based claims
- **Early Exits**: Number of early withdrawals

### Emergency Procedures

```bash
# Emergency pause (admin only)
stacks call pension emergency-pause \
  --contract ST1PQHQKV0RJXZFY1YQKNS1NKYCPMD3DVKV1QGSWT.pension

# Unpause system
stacks call pension emergency-unpause \
  --contract ST1PQHQKV0RJXZFY1YQKNS1NKYCPMD3DVKV1QGSWT.pension
```

## 🚨 Troubleshooting

### Common Issues

#### Contract Deployment Fails

```bash
# Check STX balance
stacks balance

# Verify contract syntax
clarinet check

# Check network connectivity
stacks status
```

#### Frontend Connection Issues

```bash
# Verify contract address
# Check network configuration
# Ensure wallet is connected to correct network
# Check browser console for errors
```

#### Transaction Failures

```bash
# Check user STX balance
# Verify contract is not paused
# Check transaction parameters
# Review error messages
```

### Debug Commands

```bash
# Get contract info
stacks contract info ST1PQHQKV0RJXZFY1YQKNS1NKYCPMD3DVKV1QGSWT.pension

# Check user account
stacks call pension get-account --args ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5

# Check user balance
stacks call pension get-balance --args ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5

# View recent events
stacks events ST1PQHQKV0RJXZFY1YQKNS1NKYCPMD3DVKV1QGSWT.pension --limit 10
```

## 🔐 Security Best Practices

### Admin Key Management

- **Multi-sig**: Use multi-signature wallets for admin functions
- **Time-locks**: Implement delays for critical admin actions
- **Backup**: Secure backup of admin keys
- **Rotation**: Regular key rotation procedures

### Contract Security

- **Audits**: Regular security audits
- **Bug Bounties**: Incentivize security research
- **Monitoring**: Continuous monitoring for suspicious activity
- **Updates**: Plan for contract upgrades

### Operational Security

- **Access Control**: Limit access to production systems
- **Monitoring**: Monitor all admin actions
- **Incident Response**: Document incident response procedures
- **Recovery**: Test recovery procedures regularly

## 📈 Scaling Considerations

### Performance Optimization

- **Batch Operations**: Group multiple operations
- **Gas Optimization**: Minimize contract gas usage
- **Caching**: Implement frontend caching strategies
- **CDN**: Use CDN for static assets

### User Experience

- **Loading States**: Clear feedback during transactions
- **Error Handling**: User-friendly error messages
- **Mobile Optimization**: Ensure mobile-first design
- **Accessibility**: Follow accessibility guidelines

## 🎯 Post-Deployment Checklist

### Smart Contract

- [ ] Contract deployed successfully
- [ ] Initial plans configured
- [ ] Admin functions tested
- [ ] Emergency procedures tested
- [ ] Monitoring set up

### Frontend

- [ ] Production build deployed
- [ ] Contract address updated
- [ ] Network configuration correct
- [ ] Wallet integration working
- [ ] All user flows tested

### Operations

- [ ] Monitoring alerts configured
- [ ] Admin procedures documented
- [ ] Support channels established
- [ ] Documentation updated
- [ ] Team trained on procedures

## 📞 Support & Resources

### Official Documentation

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Language Guide](https://docs.stacks.co/write-smart-contracts/)
- [Clarinet Documentation](https://docs.hiro.so/clarinet/)

### Community Resources

- [Stacks Discord](https://discord.gg/stacks)
- [Hiro Support](https://www.hiro.so/support)
- [Stacks Forum](https://forum.stacks.org/)

### Emergency Contacts

- **Technical Issues**: Create GitHub issue
- **Security Issues**: Email security@micro-pension.app
- **Community Support**: Join Discord server

---

**Remember**: Always test thoroughly on testnet before mainnet deployment. Security and user experience are paramount in DeFi applications.
