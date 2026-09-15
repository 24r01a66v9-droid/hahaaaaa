import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.matchMedia = () => ({ matches: false, addListener: jest.fn(), removeListener: jest.fn() })

beforeEach(() => {
  localStorage.clear()
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([{ id: 1, title: 'Test mug', price: 18.5, image: 'test.jpg' }]) }))
})

afterEach(() => {
  jest.restoreAllMocks()
})
