import React, { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
// import { useSession } from 'next-auth/client'

import style from './style';

import List from './List';
import ReceiveSetting from './ReceiveSetting';
import Transaction from './Transaction';
import AccountSettings from './AccountSettings';
import VF from './VF';
import HF from './HF';


global.debug = false
global.dark = false

const Home: React.FunctionComponent<{ name: string, email: string }> = ({ name, email }) => {
	const [loginEmail, setLoginEmail] = useState("");
	const [loginUsername, setLoginUsername] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
	const [receiveSettings, setReceiveSettings] = useState([]);
	const [newCurrency, setNewCurrency] = useState("BTC");
	const [newType, setNewType] = useState("Address");
	const [newValue, setNewValue] = useState("");
	const [username, setUsername] = useState("");

	useEffect(() => {
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
			if (res.username) setUsername(res.username);
		}).catch(console.error);
	});
	const accountView = email ? (<AccountSettings
		email={email}
		username={username}
	>
	</AccountSettings>) : (<VF>
		<h2>Account Settings</h2>
		<form style={style.verticalFlex}>
			<div>
				Email
			</div>
			<input type={'email'} onChange={(event) => {
				setLoginEmail(event.target.value);
			}}></input>
			<div>
				Password
			</div>
			<input type={'password'} onChange={(event) => {
				setLoginPassword(event.target.value);
			}}></input>
			<button onClick={() => {
				fetch('/account/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						email: loginEmail,
						password: loginPassword
					}),
					credentials: 'include'
				}).then(res => res.json()).then(console.log).then(() => {
					window.location.reload();
				}).catch(console.error);
			}}>Log In</button>
		</form>
		<div style={style.hr} key={Math.random().toString()}></div>
		<form style={style.verticalFlex}>
			<div>
				Email
			</div>
			<input type={'email'} name={'email'} onChange={(event) => {
				setLoginEmail(event.target.value);
			}}></input>
			<div>
				Username
			</div>
			<input type={'text'} name={'username'} onChange={(event) => {
				setLoginUsername(event.target.value);
			}}></input>
			<div>
				Password
			</div>
			<input type={'password'} name={'password'} onChange={(event) => {
				setLoginPassword(event.target.value);
			}}></input>
			<button onClick={() => {
				fetch('/account/create', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						email: loginEmail,
						username: loginUsername,
						password: loginPassword
					}),
					credentials: 'include'
				}).then(res => res.json()).then(console.log).then(() => {
					window.location.reload();
				}).catch(console.error);
			}}>Sign Up</button>
		</form>
	</VF>);

	let receiveSettingsCollection = receiveSettings ? (receiveSettings
	// [
	// 	{
	// 		currency: 'BTC',
	// 		type: 'Address',
	// 		value: '34FCBNrW6pnk4g2cRuPwjQcztLkGyGSAM2'
	// 	},
	// 	{
	// 		currency: 'BCH',
	// 		type: 'Address',
	// 		value: 'qzu2elrm9k4h6y0cypsc4s52er3lx3zrpgaf4mfxru'
	// 	}
	// ]
	.map((i) => {
		return {
			currency: i.currency,
			type: 'Address',
			value: i.address
		}
	})
	.map((i) => {
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

	let donationHistory = [
		{
			currency: 'BTC',
			txid: 'ef2da132d438d589d8e1bb6c0aab55686dee0df326ea95e1d140a938b2077240',
			from: '1GVfZSpRBBX8qjXHSn9r5BtMhxxFAkJkyP',
			to: '34FCBNrW6pnk4g2cRuPwjQcztLkGyGSAM2'
		},
		{
			currency: 'BCH',
			txid: 'b0a65b470823585e3d81c379e8ce4ddb3c0e53aa82234c5beddf4c78eee08c4f',
			from: 'qpsevka4xacc2rsgzwdvfwc8487kcknwayn5mjnwva',
			to: 'qzu2elrm9k4h6y0cypsc4s52er3lx3zrpgaf4mfxru'
		},
		{
			currency: 'BTC',
			txid: '4f1a56a3d56fa910067896f1e32f71259c5d5f9f4ee5afc3db211d1066a507de',
			from: '1GVfZSpRBBX8qjXHSn9r5BtMhxxFAkJkyP',
			to: '34FCBNrW6pnk4g2cRuPwjQcztLkGyGSAM2'
		}
	].map((i) => {
		return (
			<Transaction
				key={i.txid}
				currency={i.currency}
				txid={i.txid}
				from={i.from}
				to={i.to}
			></Transaction>
		)
	})

	return (
		<VF style={{...{
			minHeight: '100vh'
		}, ...style.main}}>
			<h1>Midnight Cash</h1>
			<HF>
				{accountView}
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
							<option value={'BTC'}>BTC</option>
							<option value={'BCH'}>BCH</option>
						</select>
						Type
						<select onChange={(event) => {
							setNewType(event.target.value);
						}}>
							<option value={'address'}>Address</option>
							<option value={'xpub'}>Extended Public Key</option>
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
				<VF>
					<h2>Donation History</h2>
					<List>
						{donationHistory}
					</List>
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