import React from 'react'

import VF from './VF';
import HF from './HF';

import style from './style';

const AccountSettings: React.FunctionComponent<{ email: string, children }> = ({ email, children }) => {
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
            <input value={'jack'} onChange={() => {}}></input>
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
            </VF>
        </VF>
	)
}
  
  export default AccountSettings