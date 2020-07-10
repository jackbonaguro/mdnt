import React, { useState } from 'react'

import VF from './VF';
import HF from './HF';

import style from './style';

const AccountSettings: React.FunctionComponent<{
    email?: string, 
    username: string,
    notificationSettings: any,
    setNotificationSettings: any
}> = ({ 
    email, 
    username,
    notificationSettings,
    setNotificationSettings
}) => {
	const [loginEmail, setLoginEmail] = useState("");
	const [loginUsername, setLoginUsername] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
    if (email) {
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
                        <input
                            type={'checkbox'}
                            checked={notificationSettings.email || false}
                            onChange={(event) => {
                                setNotificationSettings({
                                    ...notificationSettings,
                                    email: event.target.checked
                                });
                                fetch('/account/notificationSettings/update', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        email,
                                        notificationSettings: {
                                            ...notificationSettings,
                                            email: event.target.checked
                                        }
                                    })
                                }).catch(console.error);
                            }}
                        ></input>
                    </HF>
                    <HF>
                        Push Notifications
                        <input
                            type={'checkbox'}
                            checked={notificationSettings.push || false}
                            onChange={(event) => {
                                setNotificationSettings({
                                    ...notificationSettings,
                                    push: event.target.checked
                                });
                                fetch('/account/notificationSettings/update', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        email,
                                        notificationSettings: {
                                            ...notificationSettings,
                                            push: event.target.checked
                                        }
                                    })
                                }).catch(console.error);
                            }}
                        ></input>
                    </HF>
                    <HF>
                        Webhook Notifications
                        <input
                            type={'checkbox'}
                            checked={notificationSettings.webHook || false}
                            onChange={(event) => {
                                setNotificationSettings({
                                    ...notificationSettings,
                                    webHook: event.target.checked
                                });
                                fetch('/account/notificationSettings/update', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        email,
                                        notificationSettings: {
                                            ...notificationSettings,
                                            webHook: event.target.checked
                                        }
                                    })
                                }).catch(console.error);
                            }}
                        ></input>
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
        );
    } else {
        return (
            <VF>
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
            </VF>
        );
    }
}
  
  export default AccountSettings