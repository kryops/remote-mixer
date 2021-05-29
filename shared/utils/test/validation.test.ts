import { isTruthy, isUnique } from '../src/validation'

describe('util/validation', () => {
  describe('isTruthy', () => {
    it.each([[null], [undefined], [false], [0], ['']])(
      'returns false for %p',
      (...args) => {
        expect(isTruthy(args[0])).toBe(false)
      }
    )
    it.each([[1], ['a'], [true], [{}], [[]]])(
      'returns true for %p',
      (...args) => {
        expect(isTruthy(args[0])).toBe(true)
      }
    )
  })

  describe('isUnique', () => {
    it('filters array', () => {
      expect([1, 2, 5, 2, 3, 1].filter(isUnique)).toEqual([1, 2, 5, 3])
    })
  })
})
