import React, { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'

import style from './style';

import List from './List';
import ReceiveSetting from './ReceiveSetting';
import Transaction from './Transaction';
import AccountSettings from './AccountSettings';
import DonationHistory from './DonationHistory';
import VF from './VF';
import HF from './HF';

global.debug = false;
global.dark = false;

const Home: React.FunctionComponent<{ name: string, email: string }> = ({ name, email }) => {
	const [receiveSettings, setReceiveSettings] = useState([]);
	const [notificationSettings, setNotificationSettings] = useState({});
	const [newCurrency, setNewCurrency] = useState("BCH");
	const [newType, setNewType] = useState("Address");
	const [newValue, setNewValue] = useState("");
	const [username, setUsername] = useState("");

	// onLoad effect
	useEffect(() => {
		console.log(`Notification.permission: ${Notification.permission}`);
		if (Notification.permission !== 'granted') {
			Notification.requestPermission().then((result) => {
				console.log(result);
			});
		}
		if (email) {
			fetch('/account/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
					// 'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: JSON.stringify({
					email
				}),
				credentials: 'include'
			}).then(res => res.json()).then((res) => {
				// console.log(res);
				return Promise.resolve(res);
			}).then((res) => {
				setReceiveSettings(res.receiveSettings);
				setNotificationSettings(res.notificationSettings);
				if (res.username) setUsername(res.username);
			}).catch(console.error);
		}
	}, []);

	let receiveSettingsCollection = receiveSettings ? (receiveSettings.map((i) => {
		return {
			currency: i.currency,
			type: 'Address',
			value: i.address
		}
	}).map((i) => {
		return (
			<ReceiveSetting
				key={i.currency}
				currency={i.currency}
				type={i.type}
				value={i.value}
				email={email}
			></ReceiveSetting>
		)
	})) : [];

	return (
		<VF style={{...{
			minHeight: '100vh',
			minWidth: '100vw'
		}, ...style.main}}>
			<h1>Midnight Cash</h1>
			<button onClick={() => {
				console.log('Test notification');
				let notification = new Notification('Donation Received', {
					body: '<b><a>Click here</a> to see details</b>',
					icon: 'https://thebox.network/favicon.png',
					tag: '1234567890'
				});
			}}>Test Notification</button>
			<HF>
				<AccountSettings
					email={email}
					username={username}
					notificationSettings={notificationSettings}
					setNotificationSettings={setNotificationSettings}
				></AccountSettings>
				{ email ? (
					<VF>
						<h2>Receipt Settings</h2>
						<List>
							{receiveSettingsCollection}
						</List>
						<VF>
							<h4>Add Receipt Method</h4>
							Currency
							<select onChange={(event) => {
								setNewCurrency(event.target.value);
							}}>
								{/* <option value={'BTC'}>BTC</option> */}
								<option value={'BCH'}>BCH</option>
							</select>
							Type
							<select onChange={(event) => {
								setNewType(event.target.value);
							}}>
								<option value={'address'}>Address</option>
								<option value={'xpub'}>Extended Public Key (Experimental)</option>
							</select>
							Value
							<input onChange={(event) => {
								setNewValue(event.target.value);
							}}></input>
							<button onClick={() => {
								fetch('/account/receiveSetting/add', {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json'
									},
									body: JSON.stringify({
										email,
										currency: newCurrency,
										address: newValue
									})
								}).catch(console.error);
							}}>Add</button>
						</VF>
						<h4>Link to donation page</h4>
						<a href={`https://midnight.cash/${username}`} style={style.link}>{`https://midnight.cash/${username}`}</a>
					</VF>
				) : (<></>)}
				<VF>
					<DonationHistory
						email={email}
					></DonationHistory>
				</VF>
			</HF>
		</VF>
	)
}

export default Home

export const getServerSideProps: GetServerSideProps<{ query, req, res }> = async ({ query, req, res }) => {
	const name = query.name instanceof Array ? query.name.join(', ') : query.name
	return {
		props: {
			name: 'Midnight Cash',
			email: res.locals.email || null
		},
	}
}