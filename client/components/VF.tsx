import React, { CSSProperties } from 'react'

import style, { randomColor } from './style';

const VF: React.FunctionComponent<{ children, style?: CSSProperties }> = ({ children, style: customStyle }) => {
    if (!customStyle) {
        customStyle = {}
    }
    return (
        <div style={{...style.verticalFlex, ...style.p10, backgroundColor: randomColor(), ...customStyle}}>
            {children}
        </div>
    )
}
  
  export default VF