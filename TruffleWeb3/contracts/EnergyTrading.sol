// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract EnergyTrading {
    struct EnergyListing {
        address owner;
        string name; // Company Name
        uint256 costPerUnit; // Cost per Energy Unit in Wei
        uint256 energyAmount; // Total Energy Available (kWh)
        string fuelType; // Type of Fuel
        string description; // Description of the Energy Offering
        string image; // URL to Company Logo/Image
        uint256 amountSold; // Total Energy Sold (kWh)
        uint256 createdAt; // Timestamp of Listing Creation
    }

    struct Purchase {
        address buyer;
        uint256 amount;
        uint256 timestamp;
    }

    // Struct to track purchases by user
    struct PurchaseDetail {
        uint256 listingId;
        uint256 amount;
        uint256 timestamp;
        string fuelType; // Type of energy used
        uint256 totalCost; // Total cost of the purchase
    }

    mapping(uint256 => EnergyListing) public energyListings;
    mapping(uint256 => Purchase[]) public purchaseHistory; // Mapping to store purchase history per listing
    mapping(address => PurchaseDetail[]) public userPurchases; // Mapping to store purchases by each user
    uint256 public numberOfListings = 0;

    // Events
    event EnergyListingCreated(
        uint256 indexed id,
        address indexed owner,
        string name,
        uint256 costPerUnit,
        uint256 energyAmount,
        string fuelType,
        string description,
        string image,
        uint256 createdAt
    );

    event EnergyPurchased(
        uint256 indexed id,
        address indexed buyer,
        uint256 amount,
        uint256 totalCost,
        uint256 timestamp
    );

    /**
     * @dev Creates a new energy listing.
     */
    function createEnergyListing(
        address _owner,
        string memory _name,
        uint256 _costPerUnit,
        uint256 _energyAmount,
        string memory _fuelType,
        string memory _description,
        string memory _image
    ) public returns (uint256) {
        require(_costPerUnit > 0, "Cost per unit must be greater than zero.");
        require(_energyAmount > 0, "Energy amount must be greater than zero.");
        require(bytes(_name).length > 0, "Company name is required.");
        require(bytes(_fuelType).length > 0, "Fuel type is required.");
        require(bytes(_image).length > 0, "Image URL is required.");

        EnergyListing storage listing = energyListings[numberOfListings];
        listing.owner = _owner;
        listing.name = _name;
        listing.costPerUnit = _costPerUnit;
        listing.energyAmount = _energyAmount;
        listing.fuelType = _fuelType;
        listing.description = _description;
        listing.image = _image;
        listing.amountSold = 0;
        listing.createdAt = block.timestamp;

        emit EnergyListingCreated(
            numberOfListings,
            _owner,
            _name,
            _costPerUnit,
            _energyAmount,
            _fuelType,
            _description,
            _image,
            block.timestamp
        );

        numberOfListings++;
        return numberOfListings - 1;
    }

    /**
     * @dev Allows users to purchase energy units from a listing.
     */
    function buyEnergy(uint256 _id, uint256 _amount) public payable {
        EnergyListing storage listing = energyListings[_id];

        // Check if the listing exists
        require(listing.energyAmount > 0, "Energy listing does not exist.");

        // Check if the purchase amount is valid
        require(_amount > 0, "Purchase amount must be greater than zero.");

        // Ensure there is enough energy available in the listing
        require(
            listing.energyAmount - listing.amountSold >= _amount,
            "Not enough energy available."
        );

        uint256 totalCost = (listing.costPerUnit * _amount) / 10 ** 18; // Total cost in Wei

        // Ensure the buyer has sent the exact Ether required
        require(msg.value == totalCost, "Incorrect Ether value sent.");

        //above message but returns with the msg.value and totalCost)
        require(
            msg.value == totalCost,
            string(
                abi.encodePacked(
                    "Incorrect Ether value sent. You sent: ",
                    msg.value,
                    " Expected: ",
                    totalCost
                )
            )
        );

        // Update the listing to reflect the sold amount
        listing.amountSold += _amount;

        // Record the purchase with timestamp
        Purchase memory newPurchase = Purchase({
            buyer: msg.sender,
            amount: _amount,
            timestamp: block.timestamp
        });
        purchaseHistory[_id].push(newPurchase);

        // Track the user's purchase
        // Track the user's purchase with additional details
        userPurchases[msg.sender].push(
            PurchaseDetail({
                listingId: _id,
                amount: _amount,
                timestamp: block.timestamp,
                fuelType: listing.fuelType, // Include the type of energy
                totalCost: totalCost // Include the calculated total cost
            })
        );

        // Interactions: Transfer Ether to the listing owner
        (bool sent, ) = payable(listing.owner).call{value: totalCost}("");
        require(sent, "Failed to send Ether to the owner.");

        // Emit the event for the purchase
        emit EnergyPurchased(
            _id,
            msg.sender,
            _amount,
            totalCost,
            block.timestamp
        );
    }

    /**
     * @dev Retrieves all energy listings.
     */
    function getEnergyListings() public view returns (EnergyListing[] memory) {
        EnergyListing[] memory allListings = new EnergyListing[](
            numberOfListings
        );

        for (uint256 i = 0; i < numberOfListings; i++) {
            EnergyListing storage item = energyListings[i];
            allListings[i] = item;
        }

        return allListings;
    }

    /**
     * @dev Retrieves a specific energy listing by ID.
     */
    function getEnergyListing(
        uint256 _id
    ) public view returns (EnergyListing memory) {
        require(_id < numberOfListings, "Energy listing does not exist.");
        return energyListings[_id];
    }

    /**
     * @dev Retrieves all energy listings created by a specific owner.
     */
    function getEnergyListingsByOwner(
        address _owner
    ) public view returns (EnergyListing[] memory) {
        uint256 count = 0;

        for (uint256 i = 0; i < numberOfListings; i++) {
            if (energyListings[i].owner == _owner) {
                count++;
            }
        }

        EnergyListing[] memory ownerListings = new EnergyListing[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < numberOfListings; i++) {
            if (energyListings[i].owner == _owner) {
                ownerListings[index] = energyListings[i];
                index++;
            }
        }

        return ownerListings;
    }

    /**
     * @dev Retrieves the purchase history for a specific energy listing.
     */
    function getPurchaseHistory(
        uint256 _id
    ) public view returns (Purchase[] memory) {
        require(_id < numberOfListings, "Energy listing does not exist.");
        return purchaseHistory[_id];
    }

    /**
     * @dev Retrieves all purchases made by a specific user across listings.
     * @param _user Address of the user.
     * @return An array of PurchaseDetail structs representing the user's purchases.
     */
    function getUserPurchases(
        address _user
    ) public view returns (PurchaseDetail[] memory) {
        return userPurchases[_user];
    }
}
