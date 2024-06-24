describe('Conversation Summary', () => {
  it('visits the home page', () => {
    cy.visit('/')

    cy.contains('First reply on')
    cy.contains('Most recent reply on')
    cy.contains('Segment')
    cy.contains('Zip code')
    cy.contains('Reporters contacted')
    cy.contains('Tags')
    cy.contains('Reporters Notes')
    cy.contains('Impact and outcomes')
    cy.contains('Communication patterns')
  })
})
