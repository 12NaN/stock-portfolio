import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {Link } from 'react-router-dom';
class Transactions extends Component {
    
    constructor(props){
        super(props);
        const { user } = this.props.auth;
        this.state = {symbol: "", balance : user.accountBalance, quantity: 0};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.onChangeSymbol = this.onChangeSymbol.bind(this);
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
         console.log((this.state.balance - (res.data["Global Quote"]["05. price"] * this.state.quantity)));
         if((this.state.balance - (res.data["Global Quote"]["05. price"] * this.state.quantity)).toFixed(2) < 0){
             alert("You don't have enough money to buy these shares.");
         }
         else{
            console.log(this.state.quantity);
            this.setState({balance: (this.state.balance - (res.data["Global Quote"]["05. price"] * this.state.quantity)).toFixed(2)})
         }
        })
        .catch(error => alert("That symbol doesn't exist."))
    }
    render() {
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
                <h4>Current Balance: ${this.state.balance.toFixed(2)} </h4>
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
            </div>
        );
    }
}

Transactions.propTypes = {
    auth: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    auth: state.auth
  });
  export default connect(
    mapStateToProps
  )(Transactions);