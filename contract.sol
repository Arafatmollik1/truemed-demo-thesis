contract Product{
    
    struct ProductDetail{
        
        string productQR;
        address owner;
        string transactionHash;
        
    }
    
    mapping(string=>ProductDetail) productDetails;
    address public admin;
    
    
    constructor(address _admin){
        admin=_admin;
    }

    // will hold all the product QR

    function setProductDetail(string memory _productID)public {
        require(msg.sender==admin,"Only Admin 0x05d6983137ec70e21952d5c516d5ff8bd186b782");
        ProductDetail storage product=productDetails[_productID];
        product.productQR=_productID;
        product.owner=msg.sender;
    }
    function settransactionHash(string memory _productID,string memory _transactionHash)public {
        require(msg.sender==admin,"Only Admin 0x05d6983137ec70e21952d5c516d5ff8bd186b782");
        ProductDetail storage product=productDetails[_productID];
        product.transactionHash=_transactionHash;
    }
    
    // to get product details stored using the QR
    
    function getProductDetails(string memory _productID) view public returns(string memory,address,string memory) {
        ProductDetail storage product=productDetails[_productID];
        return(product.productQR,product.owner,product.transactionHash);
    }

}