import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ContactProvider, useContact } from './ContactContext'

function Probe() {
  const { isOpen, context, open, close } = useContact()
  return (
    <div>
      <span data-testid="state">{isOpen ? 'open' : 'closed'}</span>
      <span data-testid="context">{context ?? 'none'}</span>
      <button onClick={() => open()}>open-plain</button>
      <button onClick={() => open('AI Infra — Early Access')}>open-tagged</button>
      <button onClick={(e) => open(e as unknown as string)}>open-event</button>
      <button onClick={close}>close</button>
    </div>
  )
}

describe('ContactContext', () => {
  it('starts closed with no context and toggles open/close', () => {
    render(<ContactProvider><Probe /></ContactProvider>)
    expect(screen.getByTestId('state')).toHaveTextContent('closed')
    expect(screen.getByTestId('context')).toHaveTextContent('none')
    fireEvent.click(screen.getByText('open-plain'))
    expect(screen.getByTestId('state')).toHaveTextContent('open')
    expect(screen.getByTestId('context')).toHaveTextContent('none')
    fireEvent.click(screen.getByText('close'))
    expect(screen.getByTestId('state')).toHaveTextContent('closed')
  })

  it('open(context) stores the lead source and close clears it', () => {
    render(<ContactProvider><Probe /></ContactProvider>)
    fireEvent.click(screen.getByText('open-tagged'))
    expect(screen.getByTestId('state')).toHaveTextContent('open')
    expect(screen.getByTestId('context')).toHaveTextContent('AI Infra — Early Access')
    fireEvent.click(screen.getByText('close'))
    expect(screen.getByTestId('context')).toHaveTextContent('none')
  })

  it('ignores a non-string argument (e.g. a click event passed by onClick={open})', () => {
    render(<ContactProvider><Probe /></ContactProvider>)
    fireEvent.click(screen.getByText('open-event'))
    expect(screen.getByTestId('state')).toHaveTextContent('open')
    expect(screen.getByTestId('context')).toHaveTextContent('none')
  })

  it('throws when used outside the provider', () => {
    expect(() => render(<Probe />)).toThrow(/useContact must be used within a ContactProvider/)
  })
})
