import React from 'react'

import VF from './VF';
import HF from './HF';

import style from './style';

const AccountSettings: React.FunctionComponent<{ email: string, username: string, children }> = ({ email, username, children }) => {
	return (
		<VF>
            <h2>Account Settings</h2>
            <div>
                Email
            </div>
            <input value={email} onChange={() => {}}></input>
            <div>
                Username
            </div>
            <input value={username} onChange={() => {}}></input>
            <VF>
                <h4>Notification Settings</h4>
                <HF>
                    Email Notifications
                    <input type={'checkbox'}></input>
                </HF>
                <HF>
                    Push Notifications
                    <input type={'checkbox'}></input>
                </HF>
                <HF>
                    Webhook Notifications
                    <input type={'checkbox'}></input>
                </HF>
                Webhook Address
                <input value="https://midnight.cash/webhook" onChange={() => {}}></input>
                <button onClick={() => {
                    fetch('/account/logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        credentials: 'include'
                    }).then(res => res.json()).then(console.log).then(() => {
                        window.location.reload();
                    }).catch(console.error);
                }}>Log Out</button>
            </VF>
        </VF>
	)
}
  
  export default AccountSettings