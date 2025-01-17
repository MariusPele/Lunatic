import { render } from '@testing-library/react';
import { Label } from './Label';
import { describe, it, expect } from 'vitest';

describe('Label', () => {
	it('renders null when children is falsy', () => {
		const { container } = render(
			<Label htmlFor="input" id="label" description="This is a label">
				{null}
			</Label>
		);

		expect(container.firstChild).toBeNull();
	});

	it('renders a label without description', () => {
		const { getByText, queryByText } = render(
			<>
				<Label htmlFor="kze792d8" id="label">
					<p>Name</p>
				</Label>
				<input
					id="kze792d8"
					className=""
					type="number"
					aria-labelledby="label"
					min="0"
					max="10"
					value=""
					lang="en"
				></input>
			</>
		);

		const label = getByText('Name');
		expect(label).toBeInTheDocument();
		expect(label.parentNode).toHaveAttribute('for', 'kze792d8');
		const description = queryByText('This is a label');
		expect(description).not.toBeInTheDocument();
	});
});
