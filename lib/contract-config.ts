export const CONTRACT_ADDRESSES = {
  // Base Sepolia addresses
  SongNFT: '0xCeEf4AF4615D1B17471Bb1dCe1e96ea04Ab238ac',
  RoyaltySplitEscrow: '0xc7686cd02dF92234af7eB425Dad9044C7eDAdD6E',
  ConditionalEscrow: '0x28BF3342dc25eA963b8Be2B8EcD09689aC285463',
} as const;

export const CHAIN_ID = 84532; // Base Sepolia

// Complete ABIs for our contracts
export const CONTRACT_ABIS = {
  SongNFT: [
    // Minting and token management
    'function createSong(string uri, address artist, address[] memory collaborators, uint256[] memory shares) external returns (uint256)',
    'function balanceOf(address account, uint256 id) external view returns (uint256)',
    'function totalSupply(uint256 id) external view returns (uint256)',
    'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) external',
    // Royalties
    'function royaltyInfo(uint256 tokenId, uint256 salePrice) external view returns (address receiver, uint256 royaltyAmount)',
    'function setTokenRoyalty(uint256 tokenId, address recipient, uint96 fraction) external',
    // Ownership and roles
    'function owner() external view returns (address)',
    'function grantRole(bytes32 role, address account) external',
    'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId, uint256 amount)',
    'event RoyaltySet(uint256 indexed tokenId, address recipient, uint96 fraction)',
  ],
  RoyaltySplitEscrow: [
    // ETH handling
    'function depositETH(address account, address payer, uint256 songId, uint256 amount, uint256 chainId) external payable',
    'function withdrawETH(address account, uint256 songId, address[] memory recipients, uint256[] memory shares) external',
    'function getBalance(address account, uint256 songId) external view returns (uint256)',
    // ERC20 token handling
    'function depositERC20(address account, address payer, address token, uint256 amount, uint256 songId, uint256 chainId) external payable',
    'function withdrawERC20(address account, address token, uint256 songId, address[] memory recipients, uint256[] memory shares) external',
    'function getERC20Balance(address account, address token, uint256 songId) external view returns (uint256)',
    // Events
    'event Deposited(address indexed account, address indexed payer, uint256 indexed songId, uint256 amount, uint256 chainId)',
    'event Withdrawn(address indexed account, uint256 indexed songId, uint256 amount)',
    // Admin functions
    'function owner() external view returns (address)',
    'function pause() external',
    'function unpause() external',
  ],
  ConditionalEscrow: [
    // Basic escrow functions
    'function depositETH(address account, address payer, uint256 songId, uint256 amount, uint256 chainId) external payable',
    'function depositERC20(address account, address payer, address token, uint256 amount, uint256 songId, uint256 chainId) external payable',
    'function getBalance(address account, uint256 songId) external view returns (uint256)',
    // Condition management
    'function setCondition(uint256 songId, uint256 minStreams, uint256 unlockTime, address oracle, bool requiresApproval) external',
    'function checkCondition(uint256 songId) external view returns (bool)',
    'function submitSignedReport(uint256 songId, uint256 periodStart, uint256 periodEnd, uint256 plays, uint256 revenue, bytes memory signature) external',
    'function approveRelease(address token, uint256 songId) external',
    // View functions
    'function getCondition(uint256 songId) external view returns (uint256 minStreams, uint256 unlockTime, address oracle, bool requiresApproval, bool isApproved)',
    // Events
    'event ConditionSet(uint256 indexed songId, uint256 minStreams, uint256 unlockTime, address oracle, bool requiresApproval)',
    'event ReportSubmitted(uint256 indexed songId, uint256 periodStart, uint256 periodEnd, uint256 plays, uint256 revenue)',
    'event ReleaseApproved(uint256 indexed songId)',
    // Admin functions
    'function owner() external view returns (address)',
    'function pause() external',
    'function unpause() external',
  ],
} as const;