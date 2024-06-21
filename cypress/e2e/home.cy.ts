describe('Conversation Summary', () => {
  it('visits the home page', () => {
    cy.visit('/')
    
    cy.contains('Nia Silvio')
    cy.contains('+13126185863')
    cy.contains('email@email.com')
    cy.contains('First reply on Wed May 1, 2024')
    cy.contains('Most recent reply on Wed June 5, 2024')
  })
})
