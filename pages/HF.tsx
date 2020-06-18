import React from 'react'

import style, { randomColor } from './style';

const HF: React.FunctionComponent<{ children }> = ({ children }) => (
    <div style={{...style.horizontalFlex, ...style.p10, backgroundColor: randomColor()}}>
        {children}
    </div>
)
  
  export default HF