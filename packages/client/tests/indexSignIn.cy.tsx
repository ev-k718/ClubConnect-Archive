//@ts-nocheck
import SignIn from '@/pages'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import React from 'react'

describe('<SignIn />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<UserProvider><SignIn /></UserProvider>)
    cy.get('.mantine-UnstyledButton-root').click()
  })
})