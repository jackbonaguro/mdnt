import React from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'

import style from './style';

import List from './List';
import ReceiveSetting from './ReceiveSetting'
import Transaction from './Transaction'
import VF from './VF';
import HF from './HF';


global.debug = false
global.dark = false

const Home: React.FunctionComponent<{ name: string }> = ({ name }) => {
	let receiveSettings = [
		{
			currency: 'BTC',
			type: 'Address',
			value: '34FCBNrW6pnk4g2cRuPwjQcztLkGyGSAM2'
		},
		{
			currency: 'BCH',
			type: 'Address',
			value: 'qzu2elrm9k4h6y0cypsc4s52er3lx3zrpgaf4mfxru'
		}
	].map((i) => {
		return (
			<ReceiveSetting
				key={i.currency}
				currency={i.currency}
				type={i.type}
				value={i.value}
			></ReceiveSetting>
		)
	})

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
			height: '100vh'
		}, ...style.main}}>
			<h1>Midnight Cash</h1>
			<HF>
				<VF>
					<h2>Account Settings</h2>
					<div>
						Email
					</div>
					<input value={'jack@midnight.cash'} onChange={() => {}}></input>
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
				<VF>
					<h2>Receipt Settings</h2>
					<List>
						{receiveSettings}
					</List>
					<VF>
						<h4>Add Receipt Method</h4>
						Currency
						<select>
							<option value={'BTC'}>BTC</option>
							<option value={'BTC'}>BCH</option>
						</select>
						Type
						<select>
							<option value={'address'}>Address</option>
							<option value={'xpub'}>Extended Public Key</option>
						</select>
						Value
						<input></input>
						<button>Add</button>
					</VF>
					<h4>Link to donation page</h4>
					<a href={'https://midnight.cash/jack'} style={style.link}>https://midnight.cash/jack</a>
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

export const getServerSideProps: GetServerSideProps<{ name: string }> = async ({ query }) => {
	const name = query.name instanceof Array ? query.name.join(', ') : query.name
	return {
		props: {
			name: name || 'Midnight Cash',
		},
	}
}