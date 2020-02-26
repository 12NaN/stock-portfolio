import React, { Component } from 'react';
import axios from 'axios';
import PropTypes, { array } from "prop-types";
import { connect } from "react-redux";
import {Link } from 'react-router-dom';

class Buy extends Component {
    
    constructor(props){
        
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.onChangeSymbol = this.onChangeSymbol.bind(this);
    }
    
    componentDidMount(){
        const { user } = this.props.auth;

        axios.get('http://localhost:5000/api/users/user/'+user.id)
        .then(res => {
            console.log(res);
            this.setState({
                symbol : "",
                id: res.data._id,
                name: res.data.name,
                balance: res.data.accountBalance,
                quantity: 0,
                transactions: res.data.transactions,
                history: res.data.history,
                cash: res.data.cash
            });
            
        })
        .catch((error) =>{
            console.log(error)
        });
    }
    onChangeSymbol(e) {
        this.setState({symbol: e.target.value});
    }
    onChangeQuantity(e) {
        this.setState({quantity: e.target.value});
    }
    
    
    handleSubmit() {
        axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${this.state.symbol}&apikey=T5CMC85GIANZVEPW`)
        .then(res => {
         console.log(res);
//         console.log((this.state.balance - (res.data["Global Quote"]["05. price"] * this.state.quantity)));
         if((this.state.balance - (res.data["Global Quote"]["05. price"] * this.state.quantity)).toFixed(2) < 0){
             alert("You don't have enough money to buy these shares.");
         }
         else{
            var arr = [], hist = [];
            hist = this.state.history;
            arr = (this.state.transactions);
            let j = false;
            let cash = this.state.cash;
            for(let i in arr){
                console.log(arr[i]);
                console.log(this.state.symbol)
                if(arr[i]['symbol'] == this.state.symbol){
                    console.log(arr[i]['shares'])
                    arr[i]['shares'] = parseInt(arr[i]['shares']) + parseInt(this.state.quantity);
                    console.log(arr[i]['shares'])
                    arr[i]['cost'] = parseInt(arr[i]['cost']) + parseInt((res.data["Global Quote"]["05. price"] * this.state.quantity).toFixed(2));
                    console.log(arr[i]['cost'])
                    cash = cash + parseInt((res.data["Global Quote"]["05. price"] * this.state.quantity).toFixed(2));
                    j = true;
                }
                console.log(arr[i]);
            }
            if(j == false)
                arr.push({key: arr.length, symbol: this.state.symbol, shares: this.state.quantity, cost: res.data["Global Quote"]["05. price"], open: res.data["Global Quote"]["02. open"], curr_price: res.data["Global Quote"]["05. price"] });
            hist.push({key: hist.length, symbol: this.state.symbol, shares: this.state.quantity, cost: res.data["Global Quote"]["05. price"], open: res.data["Global Quote"]["02. open"]});
            this.setState({balance: (this.state.balance - (res.data["Global Quote"]["05. price"] * this.state.quantity)).toFixed(2),
                transactions: {symbol: this.state.symbol, shares: this.state.quantity, cost: res.data["Global Quote"]["05. price"]},
                history: hist, cash: cash
            })
            
            axios.put('http://localhost:5000/api/users/update', {
                id: this.state.id,
                name: this.state.name,
                accountBalance: this.state.balance,
                transactions: arr,
                history: this.state.history,
                cash: this.state.cash
            })
            .then(res =>{
                console.log(res);
            })
            .catch(err =>{
                console.log("hi");
            });
            console.log(this.state.balance);
            console.log("post");
         }
        })
        .catch(error => alert("That symbol doesn't exist."));
    }
    render() {
        var arr = [];
        if(this.state.transactions){
          //  console.log(this.state.transactions["0"])
          for(let i in (this.state.transactions)){
           // console.log(this.state.transactions[i]);
            arr.push(this.state.transactions[i]);
          }
        }
        var i =0;
        console.log(arr);
        const listItems = arr.map((num) =>        
            <li key={num} style={{color: parseInt(num['open']) > parseInt(num['curr_price']) ? "red" : parseInt(num['open']) < parseInt(num['curr_price']) ? "green" : "grey"}}>{(num['symbol'] + '-' + num['shares'] + " Shares   $" + num['cost'])}</li>  
       );
        return (
            <div>
                <Link to="/dashboard" className="btn-flat waves-effect">
                    <i className="material-icons left">keyboard_backspace</i> Back to
                    Dashboard
                </Link>
                <br></br>
                <Link to="/transactions" className="btn-flat waves-effect">
                    <i className="material-icons left">keyboard_backspace</i> View Transactions
                </Link>
                <h4 style={{textAlign: "center"}}>Portfolio</h4>
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