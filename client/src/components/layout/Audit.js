import React, { Component } from 'react';

class Audit extends Component {
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
        const numbers = [1, 2, 3, 4, 5];
        const listItems = numbers.map((numbers) =>
        <li>{numbers}</li>
        );
        return (
            <div>
                <h3>Audit</h3>
                <li>{listItems}</li>
            </div>
        );
    }
}

export default Audit;