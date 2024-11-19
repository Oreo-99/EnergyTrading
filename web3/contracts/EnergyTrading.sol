// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract EnergyTrading {
    struct EnergyListing {
        address owner;
        string name;               // Company Name
        uint256 costPerUnit;       // Cost per Energy Unit in Wei
        uint256 energyAmount;      // Total Energy Available (kWh)
        string fuelType;           // Type of Fuel
        string description;        // Description of the Energy Offering
        string image;              // URL to Company Logo/Image
        uint256 amountSold;        // Total Energy Sold (kWh)
        uint256 createdAt;         // Timestamp of Listing Creation
    }

    struct Purchase {
        address buyer;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(uint256 => EnergyListing) public energyListings;
    mapping(uint256 => Purchase[]) public purchaseHistory; // Mapping to store purchase history per listing
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
        uint256 timestamp // Added timestamp to the event
    );

    /**
     * @dev Creates a new energy listing.
     * @param _owner Address of the company creating the listing.
     * @param _name Name of the company.
     * @param _costPerUnit Cost per energy unit in Wei.
     * @param _energyAmount Total energy available in kWh.
     * @param _fuelType Type of fuel.
     * @param _description Description of the energy offering.
     * @param _image URL to the company logo/image.
     * @return The ID of the newly created energy listing.
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
     * @param _id ID of the energy listing.
     * @param _amount Amount of energy to purchase in kWh.
     */
    function buyEnergy(uint256 _id, uint256 _amount) public payable {
        EnergyListing storage listing = energyListings[_id];
        require(listing.energyAmount > 0, "Energy listing does not exist.");
        require(_amount > 0, "Purchase amount must be greater than zero.");
        require(
            listing.energyAmount - listing.amountSold >= _amount,
            "Not enough energy available."
        );

        uint256 totalCost = listing.costPerUnit * _amount;
        require(msg.value == totalCost, "Incorrect ETH amount sent.");

        // Effects
        listing.amountSold += _amount;

        // Record the purchase with timestamp
        Purchase memory newPurchase = Purchase({
            buyer: msg.sender,
            amount: _amount,
            timestamp: block.timestamp
        });
        purchaseHistory[_id].push(newPurchase);

        // Interactions
        (bool sent, ) = payable(listing.owner).call{value: msg.value}("");
        require(sent, "Failed to send Ether to the owner.");

        emit EnergyPurchased(_id, msg.sender, _amount, totalCost, block.timestamp);
    }

    /**
     * @dev Retrieves all energy listings.
     * @return An array of all energy listings.
     */
    function getEnergyListings() public view returns (EnergyListing[] memory) {
        EnergyListing[] memory allListings = new EnergyListing[](numberOfListings);

        for (uint256 i = 0; i < numberOfListings; i++) {
            EnergyListing storage item = energyListings[i];
            allListings[i] = item;
        }

        return allListings;
    }

    /**
     * @dev Retrieves a specific energy listing by ID.
     * @param _id ID of the energy listing.
     * @return The energy listing.
     */
    function getEnergyListing(uint256 _id) public view returns (EnergyListing memory) {
        require(_id < numberOfListings, "Energy listing does not exist.");
        return energyListings[_id];
    }

    /**
     * @dev Retrieves all energy listings created by a specific owner.
     * @param _owner Address of the owner.
     * @return An array of energy listings created by the owner.
     */
    function getEnergyListingsByOwner(address _owner) public view returns (EnergyListing[] memory) {
        uint256 count = 0;

        // First, count how many listings the owner has
        for (uint256 i = 0; i < numberOfListings; i++) {
            if (energyListings[i].owner == _owner) {
                count++;
            }
        }

        // Initialize an array with the count
        EnergyListing[] memory ownerListings = new EnergyListing[](count);
        uint256 index = 0;

        // Populate the array with the owner's listings
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
     * @param _id ID of the energy listing.
     * @return An array of Purchase structs representing the purchase history.
     */
    function getPurchaseHistory(uint256 _id) public view returns (Purchase[] memory) {
        require(_id < numberOfListings, "Energy listing does not exist.");
        return purchaseHistory[_id];
    }
}
