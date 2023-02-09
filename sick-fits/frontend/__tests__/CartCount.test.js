import { render, screen } from '@testing-library/react';
import wait from 'waait';
import CartCount from '../components/CartCount';

describe('<CartCount />', () => {
  it('render', () => {
    render(<CartCount count={10} />);
  });

  it('matches snapshot', async () => {
    const { container } = render(<CartCount count={11} />);
    expect(container).toMatchSnapshot();
  });

  it('updates via props', async () => {
    const { container, rerender } = render(<CartCount count={11} />);
    expect(container.textContent).toBe('11');
    // update props
    rerender(<CartCount count="12" />);
    expect(container.textContent).toBe('1211'); // testing the transition
    // WAIT for it for a moment because it has transitions
    await wait(400); // the duration of our transition
    // await screen.findByText('12');
    expect(container.textContent).toBe('12');
    expect(container).toMatchSnapshot();
  });
});
