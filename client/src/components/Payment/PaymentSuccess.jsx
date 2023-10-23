
import React from 'react'
import { Link, useSearchParams } from "react-router-dom"
const PaymentSuccess = () => {

    const seachQuery = useSearchParams()[0]

    const referenceNum = seachQuery.get("reference")
    return (
        <>
           
                <h1 > Order Successfull</h1>

                <p>Reference No.{referenceNum}</p>

                <Link to="/dashboard">Go to Dashboard</Link>
            </>     
          
    )
}

export default PaymentSuccess