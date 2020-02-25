import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {Link } from 'react-router-dom';

class Buy extends Component {
    
    constructor(props){
        
        super(props);
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
                transactions: res.data.transactions
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
         console.log((this.state.balance - (res.data["Global Quote"]["05. price"] * this.state.quantity)));
         if((this.state.balance - (res.data["Global Quote"]["05. price"] * this.state.quantity)).toFixed(2) < 0){
             alert("You don't have enough money to buy these shares.");
         }
         else{
            console.log(this.state.quantity);
            var arr = [];
            arr.push(this.state.transactions);
            arr.push({symbol: this.state.symbol, shares: this.state.quantity, cost: res.data["Global Quote"]["05. price"]});
            
            this.setState({balance: (this.state.balance - (res.data["Global Quote"]["05. price"] * this.state.quantity)).toFixed(2),
                transactions: arr
            })
            
            axios.put('http://localhost:5000/api/users/update', {
                id: this.state.id,
                name: this.state.name,
                accountBalance: this.state.balance,
                transactions: arr
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
        const { user } = this.props.auth;

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
                <h4>Current Balance: {  } </h4>
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

Buy.propTypes = {
    auth: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    auth: state.auth
  });
  export default connect(
    mapStateToProps
  )(Buy);