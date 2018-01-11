import React, { Component } from 'react'
import TokenContract from '../build/contracts/Token.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      contractHandle: null,
      contractInstance: null,
      mainAccount: null,
      web3: null,
      start: '',
      end: '',
      address: '',
      ethAmt: 1
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      this.showProblem('Error finding web3.')
    })
  }

  timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const ico = contract(TokenContract)
    ico.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {

      if (error) {
        this.showProblem(error.toString())
      }

      this.setState( { mainAccount : accounts[0] } )

      let icoInstance

      // now get the instance of the contract
      ico.deployed().then((instance) => {
        icoInstance = instance
        this.setState( { 
            address : instance.address,
            contractHandle : ico,
            contractInstance : icoInstance } )
        return icoInstance.start.call()
      }).then((result) => {
        this.setState( { start : this.timeConverter(result) } )
        return icoInstance.end.call() // then fetech the "end" property
      }).then((result) => {
        this.setState( { end : this.timeConverter(result) } )
      
      }).catch((err) => {
        console.error(err)
        this.showProblem('Oh no ! Something failed  -- please check you are logged into Metamask<br/><br/>'+err.toString())
      })
    })
  }

  showProblem(msg) {
    console.error(msg)
    let errDiv = document.getElementsByClassName('mainSection')[0]
    errDiv.innerHTML = msg
    errDiv.className = 'mainSection error'
  }

  buy() {
    this.state.contractInstance.buyTokens( { from : this.state.mainAccount, value : this.state.web3.toWei(this.state.ethAmt, 'ether') })
    .then((result) => {
        alert('bought some tokens ok !')
    }).catch((err) => {
      this.showProblem('Something went wrong with buying the tokens :(<br/><br/>'+err.toString())
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Token ICO Demo DApp</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>A Token Launch !  <small>{this.state.address}</small></h1>

              {this.state.errorMessage}

              <div className="mainSection">
                Demo Tokens are available for a limitted time.<br/>
                From {this.state.start} until {this.state.end}<br/>

                <div className="purchaseSection">
                  <h2>
                    Purchase Tokens by sending ETH : 
                  </h2>
                  <input className="ethAmount" type="number" value={this.state.ethAmt} onChange={ (e)=>{ this.setState( { ethAmt :  e.target.value } ) }} size="3" />
                  <button onClick={ ()=>this.buy() }>Purchase now</button>
                </div>


              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
