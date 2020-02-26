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
    render() {
        var arr = [];
        const { user } = this.props.auth;
        if(this.state.transactions){
          //  console.log(this.state.transactions["0"])
          for(let i in (this.state.transactions)){
            console.log(this.state.transactions[i]);
              arr.push(this.state.transactions[i]);
          }
        }
        let i = 0;
        const listItems = arr.map((num) =>
        <li key={i++}>{("BUY (" + num['symbol'] + ') - ' + num['shares'] + " Shares @ $" + num['cost'] + " Each")}</li>
        );
        return (
            <div>
                <Link to="/dashboard" className="btn-flat waves-effect">
                    <i className="material-icons left">keyboard_backspace</i> Back to
                    Dashboard
                </Link>
                <br></br>
                <Link to="/buy" className="btn-flat waves-effect">
                    <i className="material-icons left">keyboard_backspace</i> Buy Stock
                </Link>
                <h4 style={{textAlign: "center"}}>Transactions</h4>
                <div style={{textAlign: "center"}}>
                    <ul><u>{listItems}</u></ul>
                </div>
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