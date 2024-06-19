// eslint-disable-next-line unicorn/prevent-abbreviations
import './commands'
import '@cypress/code-coverage/support'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      seed(): void
    }
  }
}

export {}
