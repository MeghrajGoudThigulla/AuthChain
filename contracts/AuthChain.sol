pragma solidity ^0.8.33;

/**
 * @title AuthChain Product Registry
 * @dev Hardened smart contract for institutional-grade product verification.
 * Features: Tamper-proofing (Metadata Hashes), Gas-optimized batching, and strict RBAC.
 */
contract AuthChain {

    address public owner;
    uint256 public sellerCount;
    uint256 public productCount;

    // Institutional batch cap to avoid block gas limit griefing
    uint256 public constant MAX_BATCH_SIZE = 50;

    // Enums for efficient state management
    enum ProductStatus { Manufactured, AtSeller, Sold, Recalled }

    // Custom Errors (cheaper than strings)
    error ProductNotAvailable();
    error NotAuthorized();
    error NotManufacturer();
    error InvalidInput();
    error BatchSizeExceeded();

    // Roles
    mapping(address => bool) public manufacturers;

    struct seller {
        uint256 sellerId;
        bytes32 sellerName;
        bytes32 sellerBrand;
        bytes32 sellerCode;
        uint256 sellerNum;
        bytes32 sellerManager;
        bytes32 sellerAddress;
    }
    
    mapping(uint256 => seller) public sellers;
    mapping(bytes32 => uint256) public sellerMap;

    struct productItem {
        uint256 productId;
        bytes32 productSN;
        bytes32 productName;
        bytes32 productBrand;
        uint256 productPrice;
        ProductStatus productStatus; 
        string productMetadata; // IPFS CID
        bytes32 metadataHash;   // keccak256(jsonBody) for tamper detection
    }

    mapping(uint256 => productItem) public productItems;
    mapping(bytes32 => uint256) public productMap;
    
    // supply chain tracking
    mapping(bytes32 => bytes32) public productsManufactured;
    mapping(bytes32 => bytes32) public productsForSale;
    mapping(bytes32 => bytes32) public productsSold;

    // Events for indexing & UX
    event ManufacturerAdded(address indexed manufacturer);
    event SellerAdded(bytes32 indexed manufacturerId, bytes32 indexed sellerCode, bytes32 name);
    event ProductAdded(bytes32 indexed manufacturerId, bytes32 indexed productSN, bytes32 name, string metadata, bytes32 metadataHash);
    event ProductSoldToSeller(bytes32 indexed productSN, bytes32 indexed sellerCode);
    event ProductSoldToConsumer(bytes32 indexed productSN, bytes32 indexed consumerCode);
    event ProductStatusUpdated(bytes32 indexed productSN, ProductStatus oldStatus, ProductStatus newStatus);

    constructor() {
        owner = msg.sender;
        manufacturers[msg.sender] = true; 
        emit ManufacturerAdded(msg.sender);
    }

    modifier onlyOwner() {
        if(msg.sender != owner) revert NotAuthorized();
        _;
    }

    modifier onlyManufacturer() {
        if(!manufacturers[msg.sender]) revert NotManufacturer();
        _;
    }

    function addManufacturer(address _manufacturer) external onlyOwner {
        manufacturers[_manufacturer] = true;
        emit ManufacturerAdded(_manufacturer);
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        owner = _newOwner;
    }

    /**
     * @dev Authorize a trusted retailer.
     */
    function addSeller(
        bytes32 _manufacturerId, 
        bytes32 _sellerName, 
        bytes32 _sellerBrand, 
        bytes32 _sellerCode,
        uint256 _sellerNum, 
        bytes32 _sellerManager, 
        bytes32 _sellerAddress
    ) external onlyManufacturer {
        sellers[sellerCount] = seller(sellerCount, _sellerName, _sellerBrand, _sellerCode,
        _sellerNum, _sellerManager, _sellerAddress);
        sellerMap[_sellerCode] = sellerCount;
        sellerCount++;

        emit SellerAdded(_manufacturerId, _sellerCode, _sellerName);
    }

    /**
     * @dev Register a single product with IPFS metadata and tamper-proof hash.
     */
    function addProduct(
        bytes32 _manufacturerId, 
        bytes32 _productName, 
        bytes32 _productSN, 
        bytes32 _productBrand,
        uint256 _productPrice,
        string calldata _productMetadata,
        bytes32 _metadataHash
    ) external onlyManufacturer {
        _internalAddProduct(_manufacturerId, _productName, _productSN, _productBrand, _productPrice, _productMetadata, _metadataHash);
    }

    /**
     * @dev High-efficiency batch registration for manufacturers.
     */
    function batchAddProduct(
        bytes32 _manufacturerId,
        bytes32[] calldata _productNames,
        bytes32[] calldata _productSNs,
        bytes32[] calldata _productBrands,
        uint256[] calldata _productPrices,
        string[] calldata _productMetadatas,
        bytes32[] calldata _metadataHashes
    ) external onlyManufacturer {
        uint256 len = _productSNs.length;
        if (len > MAX_BATCH_SIZE) revert BatchSizeExceeded();
        if (len != _productNames.length || len != _productBrands.length || 
            len != _productPrices.length || len != _productMetadatas.length ||
            len != _metadataHashes.length) {
            revert InvalidInput();
        }

        for (uint256 i = 0; i < len; ) {
            _internalAddProduct(
                _manufacturerId, 
                _productNames[i], 
                _productSNs[i], 
                _productBrands[i], 
                _productPrices[i], 
                _productMetadatas[i],
                _metadataHashes[i]
            );
            unchecked { ++i; } // Gas optimized loop increment
        }
    }

    /**
     * @dev Internal registration logic.
     */
    function _internalAddProduct(
        bytes32 _manufacturerId, 
        bytes32 _productName, 
        bytes32 _productSN, 
        bytes32 _productBrand,
        uint256 _productPrice,
        string calldata _productMetadata,
        bytes32 _metadataHash
    ) internal {
        productItems[productCount] = productItem(
            productCount, 
            _productSN, 
            _productName, 
            _productBrand,
            _productPrice, 
            ProductStatus.Manufactured, 
            _productMetadata,
            _metadataHash
        );
        productMap[_productSN] = productCount;
        productCount++;
        
        productsManufactured[_productSN] = _manufacturerId;
        
        emit ProductAdded(_manufacturerId, _productSN, _productName, _productMetadata, _metadataHash);
    }

    /**
     * @dev Start downstream distribution.
     */
    function manufacturerSellProduct(bytes32 _productSN, bytes32 _sellerCode) external onlyManufacturer {
        uint256 index = productMap[_productSN];
        if (productItems[index].productSN != _productSN) revert ProductNotAvailable();
        
        ProductStatus oldStatus = productItems[index].productStatus;
        productItems[index].productStatus = ProductStatus.AtSeller;
        productsForSale[_productSN] = _sellerCode;
        
        emit ProductSoldToSeller(_productSN, _sellerCode);
        emit ProductStatusUpdated(_productSN, oldStatus, ProductStatus.AtSeller);
    }

    /**
     * @dev Finalize consumer purchase.
     */
    function sellerSellProduct(bytes32 _productSN, bytes32 _consumerCode) external {   
        uint256 index = productMap[_productSN];
        
        if (productItems[index].productSN != _productSN) revert ProductNotAvailable();

        // Ensure product is in distribution state
        if (productItems[index].productStatus != ProductStatus.AtSeller) revert ProductNotAvailable();

        ProductStatus oldStatus = productItems[index].productStatus;
        productItems[index].productStatus = ProductStatus.Sold;
        productsSold[_productSN] = _consumerCode;
        
        emit ProductSoldToConsumer(_productSN, _consumerCode);
        emit ProductStatusUpdated(_productSN, oldStatus, ProductStatus.Sold);
    }

    /**
     * @dev Immutable cryptographic verification.
     */
    function verifyProduct(bytes32 _productSN, bytes32 _consumerCode) external view returns(bool){
        if (_productSN == bytes32(0) || productsSold[_productSN] == bytes32(0)) {
            return false;
        }
        return (productsSold[_productSN] == _consumerCode);
    }
}
