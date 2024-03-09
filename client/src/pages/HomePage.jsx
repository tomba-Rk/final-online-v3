// HomePage.js
import React, { useState } from 'react';
import axios from 'axios';

function HomePage() {
    const [referralLink, setReferralLink] = useState('');

    const createReferralLink = async () => {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/create-referral`, { userId: 'user123' });
        setReferralLink(response.data.referralLink);
    };

    return (
        <div>
            <button onClick={createReferralLink}>Create Referral Link</button>
            {referralLink && <p>Your Referral Link: {referralLink}</p>}
        </div>
    );
}

export default HomePage;
