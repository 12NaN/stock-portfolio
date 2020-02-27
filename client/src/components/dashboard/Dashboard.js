import React, { Component } from "react";
import axios from 'axios';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import {Link } from "react-router-dom";

class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state ={};
  }
  componentDidMount(){
    const { user } = this.props.auth; // Get user data
    //axios.get('http://localhost:5000/api/users/user/'+user.id) 
    axios.get('https://my-stock-portfolio-ttp.herokuapp.com/api/users/user/'+user.id) // Retrieve user data from db based on user id
    .then(res => {
        this.setState({ // Setting state based on user's data
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
  onLogoutClick = e => { // Logout when the logout button is clicked
    e.preventDefault();
    this.props.logoutUser();
  };
render() {
return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Hey there,</b> {this.state.name}
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
            </Link>
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