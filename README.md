
# ICO Token Frontend Demo

A very simple Token with an ICO,    
And a very simple DApp that connects to it.

### Install

`$ npm install`

### Run

`$ npm run start`

----

### But first ... Start a local dev chain

`$ truffle develop`

##### OR

`$ ganache-cli`

##### OR

Run the "Ganache" GUI

----

### Deploy to chain

(See what is in `truffle.js` for the host and port connection to the chain)

`$ truffle compile` # do this first to compile the contract.     
`$ truffle migrate --reset` # put the contract on the chain

----

### Debugging the contract

`$ truffle develop --log` # in one terminal   
`> debug [transaction id]` # in "truffle develop" terminal


----

## Where is the code ?

The smart contract code is in [`contracts/Token.js`](contracts/Token.js)

The JS/React DApp code that connects to the contract is in [`src/App.js`](src/App.js)


## How can I see my tokens ?

To see your token balance in Metamask,
click the orange "Add Token" button and paste in your token address as shown on the screen.

To programatically see your token balance you could do something like this in the browser JS terminal:

```
address = *(get from onscreen)*
abi = *(get from build/contracts/Token.json)*
myContract = web3.eth.contract( abi ).at( address )
myContract.balanceOf( web3.eth.accounts[0] , (err, ok) => console.log( err, ok.c[0] ) )

```

## What should I do with this ?

As an exercise, try the following challanges, modifing the DApp to :    

* Show token balance on the screen of the DApp 
* Show total amount of tokens, and number of tokens currently available on the screen
* Implement a "transfer" token form to send tokens to another address


