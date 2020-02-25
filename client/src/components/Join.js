import React, { Component } from 'react';
import { Link } from "react-router-dom";
import './Join.css';

class Join extends Component {
    render() {
        var name, password;
        return (
            <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Sign In</h1>
                <div>
                <input placeholder="Name" className="joinInput" type="text" onChange={(event) => name = (event.target.value)} />
                </div>
                <div>
                <input placeholder="Password" className="joinInput mt-20" type="text" onChange={(event) => { password = (event.target.value)}} />
                </div>
                <Link onClick={e => (!name || !password) ? e.preventDefault() : null} to={}>
                <button className={'button mt-20'} type="submit">Sign In</button>
                </Link>
            </div>
            </div> 
        );
    }
}

export default Join;
