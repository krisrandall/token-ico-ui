pragma solidity ^0.4.18;

//Notes
//Dates
//Payable
//Emums
//Structs

contract Token {

    enum ContractState {
        notInSale, inSale, saleOver 
    }

    address private _owner;

    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint8 public decimals;

    uint256 public start;
    uint256 public end;

    //Maps users balance to their key
    mapping(address => uint256) balances;

    struct Buyer {
        uint256 balance;
        address publicKey;
        uint256 purchaseDate;
    }

    mapping(address => Buyer) buyers;

    function checkSaleState() public view returns (ContractState) {
        if (now < start) {
            return ContractState.notInSale;
        }

        if (now > start && now < end) {
            return ContractState.inSale;
        }

        if (now > end) {
            return ContractState.saleOver;
        }
    }

    function Token() public {
        _owner = msg.sender;
        name = "Demo Token";
        symbol = "DT";
        totalSupply = 10000;
        decimals = 2;

        start = 1514764800;  // 1 Jan 2018
        end = start + 30 days;

        //On deploy, i set all the tokens to me :)
        balances[_owner] = totalSupply;
    }

    function balanceOf(address who) public constant returns(uint256) {
        return balances[who];
    }

    function contractBalance () public constant returns (uint) {
        return this.balance;
    }

    function transfer(address to, uint256 value) public returns (bool) {
        if (balanceOf(msg.sender) >= value) {
            balances[msg.sender] -= value;
            balances[to] += value;

            Transfer(msg.sender, to, value);
            return true;
        } else {
            return false;
        }
    }

    function buyTokens() public payable {
        require(now > start && now < end);

        uint amountToIssue = msg.value / 18;

        buyers[msg.sender] = Buyer(amountToIssue, msg.sender, now);
        balances[_owner] -= amountToIssue;
        balances[msg.sender] += amountToIssue;

        TokensBought(amountToIssue);
    }

    function withdraw() public {
        require(now > end + 14 days);

        address me = 0x00e7b2bdd46ee2a540436773e5127c77b160a9af0c;
        me.transfer(this.balance);
    }

    event TokensBought(uint amount);

    modifier greaterThanZero() {
        require(balances[msg.sender] > 0);
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner);
        _;
    }

    event Transfer(address indexed from, address indexed to, uint256 value);
}