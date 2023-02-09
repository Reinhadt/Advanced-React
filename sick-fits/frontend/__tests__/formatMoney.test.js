import formatMoney from '../lib/formatMoney';

describe('format money func', () => {
  it('works with fractional money', () => {
    expect(formatMoney(1)).toEqual('$0.01');
    expect(formatMoney(10)).toEqual('$0.10');
    expect(formatMoney(9)).toEqual('$0.09');
  });

  it('leaves off cents with its whole amounts', () => {
    expect(formatMoney(5000)).toEqual('$50');
    expect(formatMoney(100)).toEqual('$1');
    expect(formatMoney(500000)).toEqual('$5,000');
  });

  it('works with whole and fractional amounts', () => {
    expect(formatMoney(140)).toEqual('$1.40');
    expect(formatMoney(5412)).toEqual('$54.12');
  });
});
