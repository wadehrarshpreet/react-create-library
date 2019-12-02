// @flow
{{#ifCond style '===' 'emotion'}}
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
{{/ifCond}}
import type { Node } from 'react';


type Type = 'info' | 'success' | 'danger' | 'warning';

type DemoProps = {
	/**
	 * Set this to change Type
	 */
	type: Type,
	children?: any,
};

const types = {
	info: '#5352ED',
	success: '#2ED573',
	danger: '#FF4757',
	warning: '#FFA502',
};

const Demo = ({ children, type = 'info', ...rest }: DemoProps): Node => (
	<div
		data-testid='DemoMessage'
		{{#ifCond style '===' 'inline'}}
		style=\{{
			padding: '20px',
			borderRadius: '3px',
			color: 'white',
			background: `${types[type] || 'black'}`
		}}
		{{/ifCond}}
		{{#ifCond style '===' 'emotion'}}
		css={css`
			padding: 20px;
			border-radius: 3px;
			color: white;
			background: ${types[type] || 'black'};
		`}
		{{/ifCond}}
		{...(rest: any)}
	>
		{children}
	</div>
);

export default Demo;
