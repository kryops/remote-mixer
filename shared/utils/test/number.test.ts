import { ensureBetween, valueToFraction, fractionToValue } from '../src/number'

describe('util/number', () => {
  describe('ensureBetween', () => {
    it('returns the value if it is between min and max', () => {
      expect(ensureBetween(0.5, 0, 1)).toBe(0.5)
      expect(ensureBetween(0, 0, 1)).toBe(0)
      expect(ensureBetween(1, 0, 1)).toBe(1)
      expect(ensureBetween(0, -1, 1)).toBe(0)
    })

    it('returns the min value', () => {
      expect(ensureBetween(-1, 0, 1)).toBe(0)
      expect(ensureBetween(-0.5, 0, 1)).toBe(0)
    })

    it('returns the max value', () => {
      expect(ensureBetween(2, 0, 1)).toBe(1)
      expect(ensureBetween(1.5, 0, 1)).toBe(1)
    })
  })

  describe('valueToFraction', () => {
    it('should return fraction between 0 and 1', () => {
      expect(valueToFraction(1, 0, 2)).toBe(0.5)
      expect(valueToFraction(2, 1, 3)).toBe(0.5)
      expect(valueToFraction(0, 0, 2)).toBe(0)
      expect(valueToFraction(2, 0, 2)).toBe(1)
      expect(valueToFraction(0.4, 0, 1)).toBe(0.4)
    })
    it('should return fraction greater than 1', () => {
      expect(valueToFraction(3, 0, 2)).toBe(1.5)
      expect(valueToFraction(3, 1, 2)).toBe(2)
    })
    it('should return fraction smaller than 0', () => {
      expect(valueToFraction(-1, 0, 2)).toBe(-0.5)
      expect(valueToFraction(0.5, 1, 2)).toBe(-0.5)
      expect(valueToFraction(-1, 1, 2)).toBe(-2)
    })
  })

  describe('fractionToValue', () => {
    it('should return the min value for fraction 0', () => {
      expect(fractionToValue(0, 1, 2)).toBe(1)
      expect(fractionToValue(0, 2, 1)).toBe(2)
      expect(fractionToValue(0, 1, 1)).toBe(1)
    })

    it('should return the max value for fraction 1', () => {
      expect(fractionToValue(1, 1, 2)).toBe(2)
      expect(fractionToValue(1, 2, 1)).toBe(1)
      expect(fractionToValue(1, 1, 1)).toBe(1)
    })

    it('should add the fraction to the min value', () => {
      expect(fractionToValue(0.5, 1, 2)).toBe(1.5)
      expect(fractionToValue(0.5, 2, 1)).toBe(1.5)
    })
  })
})
