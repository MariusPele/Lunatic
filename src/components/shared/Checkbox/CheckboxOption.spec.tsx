import { render, fireEvent } from '@testing-library/react';
import { CheckboxOption } from './CheckboxOption';
import { describe, it, expect, vi } from 'vitest';

describe('CheckboxOption', () => {
	const props = {
		id: 'checkbox',
		onCheck: vi.fn(),
		checked: false,
		disabled: false,
		label: 'Option 1',
		description: 'This is option 1',
		codeModality: 'ctrl',
		shortcut: false,
	};
	const defaultProps = {
		id: 'test-checkbox',
		onCheck: vi.fn(),
		label: 'Test checkbox',
	};

	it('renders the component correctly', () => {
		const { getByRole, getByText } = render(<CheckboxOption {...props} />);
		const checkbox = getByRole('checkbox');
		const label = getByText('Option 1');

		expect(checkbox).toBeInTheDocument();
		expect(checkbox).not.toBeChecked();
		expect(label).toBeInTheDocument();
	});
	it('renders the label text', () => {
		const { getByText } = render(<CheckboxOption {...defaultProps} />);
		expect(getByText(defaultProps.label)).toBeInTheDocument();
	});

	it('renders the component with the checked attribute', () => {
		const { getByRole } = render(<CheckboxOption {...props} checked={true} />);
		const checkbox = getByRole('checkbox');

		expect(checkbox).toBeChecked();
	});

	it('calls the onCheck function when clicked', () => {
		const { getByRole } = render(<CheckboxOption {...props} />);
		const checkbox = getByRole('checkbox');

		fireEvent.click(checkbox);

		expect(props.onCheck).toHaveBeenCalledTimes(1);
		expect(props.onCheck).toHaveBeenCalledWith(true);
	});
	it('calls the onCheck function when space key is pressed', () => {
		const { getByRole } = render(<CheckboxOption {...defaultProps} />);
		const checkbox = getByRole('checkbox');
		fireEvent.keyDown(checkbox, { code: 'Space' });
		expect(defaultProps.onCheck).toHaveBeenCalledWith(true);
	});
});
