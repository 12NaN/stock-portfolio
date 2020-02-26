import React, { Component } from 'react';
import axios from 'axios';
import PropTypes, { array } from "prop-types";
import { connect } from "react-redux";
import {Link } from 'react-router-dom';

class Buy extends Component {
    
    constructor(props){
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this); // handle submissions
        this.onChangeQuantity = this.onChangeQuantity.bind(this); // handle change to quantity
        this.onChangeSymbol = this.onChangeSymbol.bind(this); // handle change to symbol
    }
    
    componentDidMount(){
        const { user } = this.props.auth; // Get user data

        axios.get('http://localhost:5000/api/users/user/'+user.id) // Get user data from database based on their user id
        .then(res => {
            this.setState({ // Set state based on user data.
                symbol : "",
                id: res.data._id,
                name: res.data.name,
                balance: res.data.accountBalance,
                quantity: 0,
                transactions: res.data.transactions,
                cash: res.data.cash
            });
            
        })
        .catch((error) =>{
            console.log(error)
        });
    }
    onChangeSymbol(e) { // Set the state of symbol when it is changed
        this.setState({symbol: e.target.value});
    }
    onChangeQuantity(e) { // Set the state of quantity when it is changed
        this.setState({quantity: e.target.value});
    }
    
    
    handleSubmit() { // When the user submits their data
        axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${this.state.symbol}&apikey=T5CMC85GIANZVEPW`)
        .then(res => { // Get data from AlphaVantage API based on company symbol
         if((this.state.balance - (res.data["Global Quote"]["05. price"] * this.state.quantity)).toFixed(2) < 0){ // Alert the user if they don't have enough money.
             alert("You don't have enough money to buy these shares.");
         }
         else{
            let cash = this.state.cash; // Set cash to this.state.cash
            var arr = [];
            arr = (this.state.transactions); // Set arr array to this.state.transactions
            console.log(arr);
            arr.push({symbol: this.state.symbol, shares: this.state.quantity, cost: res.data["Global Quote"]["05. price"]}); // Update arr
            cash = cash + (res.data["Global Quote"]["05. price"] * this.state.quantity); // Update cash

            // Change state based on balance change, new transactions and amount of cash
            this.setState({balance: (this.state.balance - (res.data["Global Quote"]["05. price"] * this.state.quantity)).toFixed(2),
                transactions: arr, cash: cash
            })
            
            // Send the updated data to the database
            axios.put('http://localhost:5000/api/users/update', {
                id: this.state.id,
                name: this.state.name,
                accountBalance: this.state.balance,
                transactions: this.state.transactions
            })
            .then(res =>{
                console.log(res);
            })
            .catch(err =>{
                console.log(err);
            });
         }
        })
        .catch(error => alert(error));
    }
    render() {
        var arr = [];
        if(this.state.transactions){ // Iterate through transactions and push them to arr
          for(let i in (this.state.transactions)){
            arr.push(this.state.transactions[i]);
          }
        }
        var i =0;
        // Iterate through arr and list data to users. If the current price is greater than opening, make it green. If the current price is less than opening price, make it red. Else, grey 
        const listItems = arr.map((num) =>      
            <li key={i++} style={{color: parseInt(num['open']) > parseInt(num['curr_price']) ? "red" : parseInt(num['open']) < parseInt(num['curr_price']) ? "green" : "grey"}}>{(num['symbol'] + '-' + num['shares'] + " Shares   $" + num['cost'])}</li>  
       );
        return (
            <div>
                {/*Link to the dashboard and the transactions page*/}
                <Link to="/dashboard" className="btn-flat waves-effect">
                    <i className="material-icons left">keyboard_backspace</i> Back to
                    Dashboard
                </Link>
                <br></br>
                <Link to="/transactions" className="btn-flat waves-effect">
                    <i className="material-icons left">keyboard_backspace</i> View Transactions
                </Link>
                <h4 style={{textAlign: "center"}}>Portfolio</h4>
                {/*Print the user's current balance*/}
                <h4>Current Balance: ${this.state.balance} </h4>
                <h6>Symbol: </h6>
                <input type="text" name="Symbol" default="BABA" onChange={this.onChangeSymbol}></input>
                <br></br>
                <br></br>
                <h6>Quantity: </h6>
                <input type="number" name="Quantity" min="1" default="1" onChange={this.onChangeQuantity}></input>
                <button
                style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                }}
                onClick={this.handleSubmit}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                Buy
                </button>
                
                <div>
                    {/*Print the user's portfolio cash*/}
                    <h3>Portfolio: (${this.state.cash})</h3>
                    <ul>{listItems}</ul>
                </div>
            </div>
        );
    }
}

Buy.propTypes = {
    auth: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    auth: state.auth
  });
  export default connect(
    mapStateToProps
  )(Buy);