import price from './price';

it('converts a number to a readable price', () => {
    expect(price(20)).toBe("$20.00");
});
  