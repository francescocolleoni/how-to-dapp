//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;
import "hardhat/console.sol";

contract Lottery {
    // declaring the state variables
    address payable[] public players; //dynamic array of type address payable
    address[] public gameWinners;
    address public owner;

    modifier exactEthFeeRequired(uint price) {
        require(msg.value == price, "EXACT_ETH_FEE_REQUIRED");
        _;
    }
    modifier onlyOwner {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }

    // declaring the constructor
    constructor() {
        // TODO: initialize the owner to the address that deploys the contract
        owner = msg.sender; // DONE.
    }

    // declaring the receive() function that is necessary to receive ETH
    receive() external exactEthFeeRequired(0.1 ether) payable {
        // TODO: require each player to send exactly 0.1 ETH
        // DONE. implemented by a modifier.

        // TODO: append the new player to the players array
        players.push(payable(msg.sender)); // DONE.
    }

    // returning the contract's balance in wei
    function getBalance() public onlyOwner view returns (uint256) {
        // TODO: restrict this function so only the owner is allowed to call it
        // DONE. implemented by a modifier.

        // TODO: return the balance of this address
        return address(this).balance; // DONE.
    }

    // selecting the winner
    function pickWinner() public onlyOwner {
        // TODO: only the owner can pick a winner
        // DONE. implemented by a modifier.

        // TODO: owner can only pick a winner if there are at least 3 players in the lottery
        // DONE.
        require(players.length >= 3, "NOT_ENOUGH_PLAYERS");

        uint256 r = random() % players.length;
        address payable winner;

        // TODO: compute an unsafe random index of the array and assign it to the winner variable 
        winner = players[r]; // DONE.

        // TODO: append the winner to the gameWinners array
        gameWinners.push(winner); // DONE.

        // TODO: reset the lottery for the next round
        delete players; // DONE.

        // TODO: transfer the entire contract's balance to the winner
        winner.transfer(address(this).balance); // DONE.
    }

    // helper function that returns a big random integer
    // UNSAFE! Don't trust random numbers generated on-chain, they can be exploited! This method is used here for simplicity
    // See: https://solidity-by-example.org/hacks/randomness
    function random() internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        players.length
                    )
                )
            );
    }
}
