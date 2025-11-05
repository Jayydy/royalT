export const CONTRACT_ADDRESSES = {
  // Base Sepolia addresses
  SongNFT: '0x9B7dE684347b295135972C9A71282694Bd860417',
  RoyaltySplitEscrow: '0xc7686cd02dF92234af7eB425Dad9044C7eDAdD6E',
  ConditionalEscrow: '0x28BF3342dc25eA963b8Be2B8EcD09689aC285463',
} as const;

export const CHAIN_ID = 84532; // Base Sepolia

// Complete ABIs for our contracts
export const CONTRACT_ABIS = {
  SongNFT: [
    // Minting and token management
    'function mintSongNFT(address account, uint256 price, uint256 songId, uint256 amount, string memory songURI, address royaltyReceiver, uint96 feeNumerator, address royaltySplit) external',
    'function createSong(uint256 songId, uint256 price, uint256 totalSupply, string memory songURI, address royaltyReceiver, uint96 feeNumerator, address royaltySplit) external',
    'function buySongNFT(uint256 songId, uint256 amount) external payable',
    'function setSongURI(uint256 songId, string memory newURI) external',
    'function uri(uint256 songId) public view returns (string memory)',
    'function balanceOf(address account, uint256 id) external view returns (uint256)',
    'function totalSupply(uint256 id) external view returns (uint256)',
    'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) external',
    // Royalties
    'function royaltyInfo(uint256 tokenId, uint256 salePrice) external view returns (address receiver, uint256 royaltyAmount)',
    'function setRoyalty(uint256 songId, address receiver, uint96 feeNumerator) external',
    // Ownership and roles
    'function owner() external view returns (address)',
    'function grantRole(bytes32 role, address account) external',
    'event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)',
    'event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)',
    'event SongNFTMinted(address indexed account, uint256 amount, uint256 songId)',
    'event SetURI(string uri, uint256 songId)',
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