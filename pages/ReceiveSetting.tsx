import React from 'react'

import style from './style';

import VF from './VF'
import HF from './HF'

const ReceiveSetting: React.FunctionComponent<{ currency: string, type: string, value: string }> = ({ currency, type, value }) => (
	<VF>
        <div>
            {`Currency: ${currency}`}
        </div>
        <div>
            {`${type}: ${value}`}
        </div>
        <button>Remove</button>
    </VF>
)
  
  export default ReceiveSetting