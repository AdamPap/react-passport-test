import React from 'react'
import axios from 'axios'

export default function CancelSubscription() {

    const cancelSub = async () => {
        const res = await axios({
            method: 'POST',
            withCredentials: true,
            url: "http://localhost:3001/cancelSubscription"
        })
    }

    return (
        <button onClick={cancelSub}>Cancel subscription</button>
    )
}
