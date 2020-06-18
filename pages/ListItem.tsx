import React from 'react'

import style from './style';

const ListItem: React.FunctionComponent<{ content: string }> = ({ content }) => (
	<div style={{...style.horizontalFlex, ...style.p10}}>{content}</div>
)
  
  export default ListItem