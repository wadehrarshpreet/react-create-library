// @flow
{{#ifCond style '===' 'emotion'}}
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
{{/ifCond}}
import * as React from 'react';
{{#ifCond style '===' 'styled-component'}}
import styled from 'styled-components';
{{/ifCond}}
{{#ifCond style '===' 'css'}}
import './Demo.css';
{{/ifCond}}
{{#ifCond style '===' 'scss'}}
import './Demo.scss';
{{/ifCond}}
{{#ifCond style '===' 'less'}}
import './Demo.less';
{{/ifCond}}


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

{{#ifCond style '===' 'styled-component'}}
const DEMODiv = styled.div`
	padding: 20px;
	border-radius: 3px;
	color: white;
	background: ${(props: DemoProps) => types[props.type] || 'black'};
`;
{{/ifCond}}

const Demo = ({ children, type = 'info', ...rest }: DemoProps): React.Node => (
	{{#ifCond style '===' 'styled-component'}}
	<DEMODiv data-testid='DemoMessage' type={type} {...rest}>
		{children}
	</DEMODiv>
	{{else}}
	<div
		data-testid='DemoMessage'
		{{#if externalCSS}}
		className={'my-demo-class'}
		style=\{{
			background: `${types[type] || 'black'}`,
		}}
		{{/if}}
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
	{{/ifCond}}
);

export default Demo;
