import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from './App'

function renderApp(route = '/') {
  window.history.pushState({}, '', route)
  return render(<App />)
}

test('renders the homepage and loads products', async () => {
  renderApp()
  expect(screen.getByText(/make room for/i)).toBeInTheDocument()
  expect(await screen.findByText('Test mug')).toBeInTheDocument()
  expect(global.fetch).toHaveBeenCalledWith('https://fakestoreapi.com/products')
})

test('shows login validation errors for an empty form', async () => {
  renderApp('/login')
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
  expect(await screen.findByText('Email is required')).toBeInTheDocument()
  expect(await screen.findByText('Use at least 6 characters')).toBeInTheDocument()
})

test('adds a fetched product to the cart', async () => {
  renderApp()
  await screen.findByText('Test mug')
  fireEvent.click(screen.getByRole('button', { name: /add to bag/i }))
  fireEvent.click(screen.getByRole('link', { name: /shopping bag/i }))
  expect(await screen.findByText('The bag')).toBeInTheDocument()
  expect(screen.getByText('Test mug')).toBeInTheDocument()
})

test('protects checkout and redirects unauthenticated users to login', async () => {
  renderApp('/checkout')
  await waitFor(() => expect(window.location.pathname).toBe('/login'))
  expect(screen.getByText(/your good things/i)).toBeInTheDocument()
})
