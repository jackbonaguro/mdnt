import React from 'react'

import style from './style';

const List: React.FunctionComponent<{ children }> = ({ children }) => {
	const elements = children.reduce((acc, child, index) => {
		acc.push(child)
		if (index >= children.length - 1) return acc
		acc.push((
			<div style={style.hr} key={Math.random().toString()}></div>
		) as React.ReactElement)
		return acc
	}, []);
	console.log(elements)
	return (
		<div style={{...style.verticalFlex}}>
			{elements}
		</div>
	)
}
  
  export default List