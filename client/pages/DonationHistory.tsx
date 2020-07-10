import React, { useState, useEffect } from 'react'

import VF from './VF';
import HF from './HF';
import List from './List';
import Transaction from './Transaction';

import style from './style';

let decoder = new TextDecoder("utf-8");

const DonationHistory: React.FunctionComponent<{ email: string }> = ({ email }) => {
    let [donationHistory, setDonationHistory] = useState<any[]>([]);
    useEffect(() => {
        if (email) {
            let donationStream = fetch('/account/donations/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                }),
                credentials: 'include'
            }).then(res => {
                if (!res.body) {
                    return;
                }
                let buffer = Buffer.from('');
                return res.body.pipeTo(new WritableStream({
                    write(message) {
                        try {
                            const msg = decoder.decode(message);
                            buffer = Buffer.concat([buffer, Buffer.from(msg)]);
                        } catch (e) {
                            console.error(e);
                        }
                    },
                    close() {
                        let bufferStr = decoder.decode(buffer);
                        let split = bufferStr.split('\n');
                        let donations = split.map((str) => {
                            if (!str) {
                                return;
                            }
                            try {
                                const donation = JSON.parse(str);
                                return donation;
                            } catch (e) {
                                console.error(e);
                            }
                        }).filter((s) => s);
                        return setDonationHistory(donations);
                    }
                }));
            }).catch(console.error);
        }
    }, []);

    const donationHistoryList = (donationHistory && donationHistory.length) ? donationHistory.map((i) => {
		return (
			<Transaction
				key={`${i.transaction}|${i.receivingAddress}|${Math.random()}`} // Colliding keys make it render twice, idk why
				currency={i.currency}
				txid={i.transaction}
				// from={i.from} // Doesn't make sense as you'd essentially need every input address to tx
				to={i.receivingAddress}
			></Transaction>
		)
    }) : [];

    if (email) {
        return (
            <VF>
                <h2>Donation History</h2>
                <List>
                    {donationHistoryList}
                </List>
            </VF>
        );
    } else {
        return (<></>);
    }
}
  
  export default DonationHistory