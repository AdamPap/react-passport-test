import React from 'react'
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios'

export default class Subscription extends React.Component {
    // createSubscription = (token) => {
    //     console.log(token)
    //     // fetch('/save-stripe-token', {
    //     //   method: 'POST',
    //     //   body: JSON.stringify(token),
    //     // }).then(response => {
    //     //   response.json().then(data => {
    //     //     alert(`We are in business, ${data.email}`);
    //     //   });
    //     // });
    // }

    createSubscription = async token => {
        console.log(token)
        const data = {
            source: token.id,
            // description: description
        }
        console.log(data)
        const res = await axios({
            method: 'POST',
            withCredentials: true,
            data,
            url: "http://localhost:3001/createSubscription"
        })
        console.log(res)
    }

    render() {
        return (
            <StripeCheckout
                token={this.createSubscription}
                // token={token => console.log(token)}
                // description='test one'
                stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE}
            />
        )
    }
}