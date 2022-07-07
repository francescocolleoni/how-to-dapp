//SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;

contract KnowledgeTest {
    string[] public tokens = ["BTC", "ETH"];
    address[] public players;

    address public immutable owner;
    modifier onlyOwner {
        require(owner == msg.sender, "ONLY_OWNER");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function changeTokens() public {
        string[] storage t = tokens;
        t[0] = "VET";
    }

    /// Receives funds.
    receive() external payable { }

    /// Returns contract's balance.
    function getBalance() public view returns(uint) {
        return address(this).balance;
    }
    
    /**
        Transfers all contract's funds to another address.
        Callable only by the contract's owner.
    */
    function transferAll(address payable to) public onlyOwner {
        to.transfer(address(this).balance);
    }

    /// Appends message sender to players.
    function start() public {
        players.push(msg.sender);
    }

    /// Returns the concatenation of two strings.
    function concatenate(string memory a, string memory b) public pure returns(string memory) {
        return string(abi.encodePacked(a, b));
    }
}

/*
Tasks:
- Add a public state variable of type address called owner
- Declare the constructor and initialize the owner variable in the constructor.
  The owner should be initialized with the address of the account that deploys the contract
- Modify the changeTokens() function in such a way that it changes the state variable called tokens.
- Make it so that the contract can receive ETH by sending it directly to the contract address
- Add a function called getBalance() that returns the contract's balance
- Add a function called transferAll() that takes an argument of type address and transfers the entire balance of the contract to it
- Add a restriction so that only the owner can call transferAll(), otherwise, make it revert with an "ONLY_OWNER" error (use a require statement)
- Add a function called start() that adds the address of the account that calls it to the dynamic array called players
- Declare a function called concatenate that takes two strings as parameters and returns them concatenated

Note: Since Solidity does not offer a native way to concatenate strings use abi.encodePacked() to do that

*/
