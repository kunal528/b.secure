// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract SecureVault {

    struct Credential{
        string url;
        string username;
        string password;
    }

    mapping(address => Credential[]) credentials;

    function set(string memory url_,string memory usr, string memory pwd) public{
        Credential memory credential = Credential(url_, usr, pwd);
        credentials[msg.sender].push(credential);
    }

    function getAll() public view returns(Credential[] memory) {
        return credentials[msg.sender];
    }

    
}