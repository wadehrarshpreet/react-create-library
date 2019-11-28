// @flow
/** @jsx jsx */
import type { Node } from 'react';
import { jsx, css } from '@emotion/core';

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
		css={css`
			padding: 20px;
			border-radius: 3px;
			color: white;
			background: ${types[type] || 'black'};
		`}
		{...(rest: any)}
	>
		{children}
	</div>
);

export default Demo;
