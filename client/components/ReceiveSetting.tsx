import React from 'react'

import style from './style';

import VF from './VF'
import HF from './HF'

const ReceiveSetting: React.FunctionComponent<{ currency: string, type: string, value: string, email: string }> = ({ currency, type, value, email }) => (
	<VF>
        <div>
            {`Currency: ${currency}`}
        </div>
        <div>
            {`${type}: ${value}`}
        </div>
        <button onClick={() => {
			fetch('/api/account/receiveSetting/remove', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					currency
				})
			}).then(res => res.json()).then(console.log).then(() => {
				// window.location.reload();
			}).catch(console.error);
		}}>Remove</button>
    </VF>
)
  
  export default ReceiveSetting