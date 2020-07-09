import React from 'react'

import style from './style';

import VF from './VF'
import HF from './HF'

const Transaction: React.FunctionComponent<{ currency: string, txid: string, to: string, from: string }> = ({ currency, txid, from, to }) => (
	<VF>
        <div>
            {`Currency: ${currency}`}
        </div>
        <div>
            {'Txid: '}
            <a
                href={`https://bitpay.com/insight/#/${currency}/mainnet/tx/${txid}`}
                target={'_blank'}
                style={style.link}
            >
                {txid}
            </a>
        </div>
        {/* <div>
            {'From: '}
            <a
                href={`https://bitpay.com/insight/#/${currency}/mainnet/address/${from}`}
                target={'_blank'}
                style={style.link}
            >
                {from}
            </a>
        </div> */}
        <div>
            {'To: '}
            <a
                href={`https://bitpay.com/insight/#/${currency}/mainnet/address/${to}`}
                target={'_blank'}
                style={style.link}
            >
                {to}
            </a>
        </div>
    </VF>
)
  
  export default Transaction