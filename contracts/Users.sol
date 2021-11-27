// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";

struct User {
    bytes32 name;
    uint256 id;
    string bio;
    address uAddress;
    uint256[] followers;
    uint256[] following;
}

contract Users {
    using Counters for Counters.Counter;
    Counters.Counter private _ids;

    mapping(uint256 => User) private idToUser;

    event UserSignup(
        bytes32 indexed name,
        uint256 indexed id,
        string indexed bio
    );

    constructor() {}

    function signup(bytes32 name, string memory bio) public noUserExist returns (User memory) {
        _ids.increment();
        uint256 id = _ids.current();
        idToUser[id] = User(
            name,
            id,
            bio,
            msg.sender,
            new uint256[](0),
            new uint256[](0)
        );

        emit UserSignup(
            name,
            id,
            bio
        );

        return idToUser[id];
    }

    function fetchAllUsers() public view returns (User[] memory) {
        uint256 itemCount = _ids.current();
        User[] memory users = new User[](itemCount);

        for (uint256 i = 0; i < itemCount; i++) {
            User storage currentUser = idToUser[i + 1];
            users[i] = currentUser;
        }

        return users;
    }

    function followUser(uint256 id) public isUserExist isIdExist(id) {
        uint256 userId = fetchUserByAddress().id;
        // Mutate user object
        idToUser[userId].following.push(id);
        // Mutate follower object
        idToUser[id].followers.push(userId);
    }

    function fetchUserByAddress()
        public
        view
        isUserExist
        returns (User memory user)
    {
        uint256 itemCount = _ids.current();
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToUser[i + 1].uAddress == msg.sender) {
                return idToUser[i + 1];
            }
        }
    }

    modifier noUserExist() {
        bool userFound = false;
        uint256 itemCount = _ids.current();
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToUser[i + 1].uAddress == msg.sender) {
                userFound = true;
                break;
            }
        }
        require(userFound == false);
        _;
    }

    modifier isUserExist() {
        bool userFound = false;
        uint256 itemCount = _ids.current();
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToUser[i + 1].uAddress == msg.sender) {
                userFound = true;
                break;
            }
        }
        require(userFound == true, "No user found");
        _;
    }

    modifier isIdExist(uint256 id) {
        bool userFound = false;
        uint256 itemCount = _ids.current();
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToUser[i + 1].id == id) {
                userFound = true;
                break;
            }
        }
        require(userFound == true);
        _;
    }
}
