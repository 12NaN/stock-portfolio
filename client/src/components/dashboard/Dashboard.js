import React, { Component } from "react";
import Buy from '../layout/Buy';
import Transactions from '../layout/Transactions';
import axios from 'axios';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import {Link } from "react-router-dom";
import Button from '@material-ui/core/Button';

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state ={};
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
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
render() {
return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Hey there,</b> {this.state.name}{/*{user.name.split(" ")[0]}*/}
              <p className="flow-text grey-text text-darken-1">
                You're account balance is ${this.state.balance}
              </p>
            </h4>
            <Link
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              to="/buy"
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Buy Stock
{       /*       <Link to="/buy" component={Buy} balance ={this.state.balance}>Buy Stock</Link>*/
}            </Link>
            <br></br>

            <Link
              style={{
                width: "160px",
                borderRadius: "3px",
                marginTop: "1rem"
              }}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              to="/transactions"
            >
            Transactions 
            </Link>
            <br></br>
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }
}
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);