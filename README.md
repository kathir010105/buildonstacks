# Micro-Pension: Non-Custodial Blockchain Pension System

A decentralized micro-pension system built on Stacks blockchain that allows users to create time-locked pension accounts with automatic beneficiary failover and community-funded penalty pools.

## 🚀 Features

### Core Functionality

- **Non-Custodial**: Users maintain full control of their funds
- **Time-Locked**: Pensions unlock at predetermined dates/block heights
- **Beneficiary Protection**: Automatic failover if account becomes inactive
- **Proof-of-Life**: Regular pings to keep accounts active
- **Early Exit**: Optional withdrawal with penalties that fund community pool
- **Multiple Plans**: Choose from Standard, Conservative, or Flexible plans

### Smart Contract Features

- **Clarity Language**: Built on Stacks blockchain for Bitcoin security
- **Event Logging**: Full transparency of all operations
- **Admin Controls**: Emergency pause and parameter management
- **Community Pool**: Penalties fund fee rebates for low-income users

### Frontend Features

- **Mobile-First Design**: Responsive React application
- **Wallet Integration**: Hiro wallet and Stacks Connect support
- **Real-Time Updates**: Live pension status and progress tracking
- **Intuitive UX**: 3-step enrollment process with visual feedback

## 🏗️ Architecture

### Smart Contract (`pension.clar`)

```
├── Core Functions
│   ├── enroll() - Create pension account
│   ├── contribute() - Add funds to pension
│   ├── claim() - Withdraw after unlock
│   ├── exit-early() - Early withdrawal with penalty
│   └── proof-of-life() - Keep account active
├── Admin Functions
│   ├── add-plan() - Create new pension plans
│   ├── emergency-pause() - Pause system if needed
│   └── withdraw-community-pool() - Manage penalty funds
└── Data Structures
    ├── plans - Pension plan configurations
    ├── accounts - User enrollment data
    ├── balances - Contribution and claimable amounts
    └── events - Transaction history
```

### Frontend (`frontend/`)

```
├── Components
│   ├── Dashboard - Overview and quick actions
│   ├── Enroll - 4-step enrollment process
│   ├── Contribute - Add funds with quick amounts
│   ├── Claim - Withdraw or early exit
│   └── Plans - Plan comparison and selection
├── Styling
│   ├── Tailwind CSS - Utility-first styling
│   ├── Responsive Design - Mobile-first approach
│   └── Custom Components - Reusable UI elements
└── State Management
    ├── React Hooks - Local component state
    ├── Stacks Connect - Wallet integration
    └── Mock Data - Development simulation
```

## 🛠️ Technology Stack

### Blockchain

- **Stacks**: Bitcoin L2 for smart contracts
- **Clarity**: Smart contract language
- **Clarinet**: Development and testing framework

### Frontend

- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Stacks Connect**: Wallet integration
- **React Router**: Client-side routing
- **Lucide React**: Icon library

### Development

- **Node.js**: Runtime environment
- **npm/yarn**: Package management
- **PostCSS**: CSS processing
- **ESLint**: Code quality

## 📋 Prerequisites

- Node.js 16+ and npm/yarn
- Stacks CLI (for contract deployment)
- Hiro wallet or Stacks wallet
- Basic knowledge of React and blockchain concepts

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <repository-url>
cd buildonstacks
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install contract dependencies (if using Clarinet)
cd ../contracts
npm install
```

### 3. Start Development

```bash
# Start frontend development server
cd frontend
npm start

# Test smart contracts (optional)
cd ../contracts
clarinet test
```

### 4. Connect Wallet

1. Open http://localhost:3000
2. Click "Connect Wallet"
3. Approve connection in your Hiro wallet
4. Start using the application!

## 🔧 Configuration

### Smart Contract Configuration

Edit `contracts/pension.clar` to modify:

- Default beneficiary wait period
- Maximum penalty rates
- Admin addresses
- Plan parameters

### Frontend Configuration

Edit `frontend/src/App.js` to modify:

- App name and icon
- Network configuration (testnet/mainnet)
- Wallet connection settings

### Environment Variables

Create `.env` files for:

- Contract addresses
- API endpoints
- Network configurations

## 📱 Usage Guide

### 1. Enrollment Process

1. **Choose Plan**: Select from Standard, Conservative, or Flexible
2. **Set Date**: Pick your unlock date (minimum 6-24 months)
3. **Set Beneficiary**: Designate who can claim if you're inactive
4. **Confirm**: Review and sign the enrollment transaction

### 2. Contributing

- **Quick Amounts**: Choose from preset amounts (0.1 to 10 STX)
- **Custom Amounts**: Enter any amount you want
- **Regular Contributions**: Add funds whenever you want

### 3. Managing Your Pension

- **Dashboard**: View progress, balances, and quick actions
- **Proof of Life**: Send regular pings to keep account active
- **Early Exit**: Withdraw early with penalty (if plan allows)
- **Claim**: Withdraw full amount after unlock date

### 4. Beneficiary Claims

- **Inactivity Detection**: System monitors last activity
- **Wait Period**: Beneficiary must wait 7+ days after inactivity
- **Automatic Claims**: Beneficiary can claim funds directly

## 🧪 Testing

### Smart Contract Tests

```bash
cd contracts
clarinet test
```

Tests cover:

- ✅ Enrollment and validation
- ✅ Contributions and balance updates
- ✅ Claims and early exits
- ✅ Beneficiary management
- ✅ Admin functions
- ✅ Error conditions
- ✅ Event emissions

### Frontend Tests

```bash
cd frontend
npm test
```

### Manual Testing

1. **Testnet Deployment**: Deploy to Stacks testnet
2. **Wallet Integration**: Test with Hiro wallet
3. **User Flows**: Complete enrollment → contribute → claim cycle
4. **Edge Cases**: Test early exits, beneficiary claims, etc.

## 🚀 Deployment

### Smart Contract Deployment

```bash
# Deploy to testnet
clarinet contract publish pension

# Deploy to mainnet (after testing)
clarinet contract publish pension --mainnet
```

### Frontend Deployment

```bash
# Build production version
cd frontend
npm run build

# Deploy to hosting service (Vercel, Netlify, etc.)
```

### Environment Setup

1. **Testnet**: Use Stacks testnet for development
2. **Mainnet**: Deploy to Stacks mainnet for production
3. **Monitoring**: Set up monitoring and alerts
4. **Backup**: Secure admin keys and backup procedures

## 🔒 Security Considerations

### Smart Contract Security

- **No Rehypothecation**: Funds never leave the contract
- **Deterministic Unlocks**: Based on block height only
- **Beneficiary Abuse Prevention**: Proof-of-life + grace window
- **Admin Controls**: Time-locked admin functions

### User Security

- **Private Key Management**: Users control their keys
- **Beneficiary Validation**: Cannot set self as beneficiary
- **Transaction Limits**: Reasonable contribution limits
- **Audit Trail**: All operations logged on blockchain

### Operational Security

- **Emergency Pause**: Admin can pause system if needed
- **Parameter Updates**: Configurable via admin functions
- **Community Governance**: Penalty pool management
- **Regular Audits**: Smart contract security reviews

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards

- **Clarity**: Follow Clarity language best practices
- **React**: Use functional components and hooks
- **Styling**: Follow Tailwind CSS conventions
- **Testing**: Write tests for new functionality
- **Documentation**: Update docs for new features

### Areas for Contribution

- **Smart Contracts**: Additional pension plan types
- **Frontend**: New UI components and features
- **Testing**: More comprehensive test coverage
- **Documentation**: User guides and tutorials
- **Security**: Audit and security improvements

## 📊 Roadmap

### Phase 1 (Current)

- ✅ Core smart contract functionality
- ✅ Basic React frontend
- ✅ Wallet integration
- ✅ Test coverage

### Phase 2 (Next)

- 🔄 BTC-pegged token support
- 🔄 DCA (Dollar Cost Averaging) automation
- 🔄 Advanced analytics dashboard
- 🔄 Mobile app

### Phase 3 (Future)

- 🔮 DID/VC age verification
- 🔮 Multi-chain support
- 🔮 Institutional features
- 🔮 Advanced investment options

## 🆘 Support

### Documentation

- [Smart Contract API](./contracts/README.md)
- [Frontend Components](./frontend/README.md)
- [Deployment Guide](./DEPLOYMENT.md)

### Community

- **Discord**: Join our community server
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas

### Getting Help

1. Check the documentation first
2. Search existing issues
3. Create a new issue with details
4. Join community discussions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Stacks Foundation** for blockchain infrastructure
- **Clarity Language** team for smart contract platform
- **Open Source Community** for tools and libraries
- **Beta Testers** for feedback and improvements

## 📞 Contact

- **Project Lead**: [Your Name]
- **Email**: [your.email@example.com]
- **Twitter**: [@yourhandle]
- **Website**: [https://micro-pension.app]

---

**Built with ❤️ on Stacks Blockchain**

_Empowering financial security through decentralized technology_
