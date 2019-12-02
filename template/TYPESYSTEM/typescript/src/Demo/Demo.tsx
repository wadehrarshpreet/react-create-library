{{#ifCond style '===' 'emotion'}}
/** @jsx jsx */
import { SFC } from 'react';
import { jsx, css } from '@emotion/core';
{{else}}
import React, { SFC } from 'react';
{{#ifCond style '===' 'styled-component'}}
import styled from 'styled-components';
{{/ifCond}}
{{/ifCond}}

export type Type = 'info' | 'success' | 'danger' | 'warning';
export type TypesMap = Record<Type, string>;


const types: TypesMap = {
	info: '#5352ED',
	success: '#2ED573',
	danger: '#FF4757',
	warning: '#FFA502',
};

export interface DemoProps {
	/**
	 * Set this to change Demo Type
	 * @default info
	 */
	type: 'info' | 'success' | 'danger' | 'warning';
	children?: any;
}


{{#ifCond style '===' 'styled-component'}}
const DEMODiv = styled.div`
	padding: 20px;
	border-radius: 3px;
	color: white;
	background: ${(props: DemoProps) => types[props.type] || 'black'};
`;
{{/ifCond}}

const Demo: SFC<DemoProps> = ({ children, type = 'info', ...rest }) => (
	{{#ifCond style '===' 'styled-component'}}
	<DEMODiv data-testid='DemoMessage' type={type} {...rest}>
		{children}
	</DEMODiv>
	{{else}}
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
		{...rest}
	>
		{children}
	</div>
	{{/ifCond}}
);

export default Demo;
