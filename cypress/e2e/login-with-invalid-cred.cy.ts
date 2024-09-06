describe('Negative Test case', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })

    it('Login user with invalid credentials', function () {

        const username = Cypress.env('users').cypressUser.username;
                cy.visit('/')

        cy.get('input[name=user-name]').type(username)
        cy.get('input[name=password]').type(`123{enter}`)

        cy.get('h3[data-test="error"]')
            .should('be.visible') // Ensure the element is visible
            .invoke('text') // Get the text content
            .then((text: string) => {
                // Clean up the text content
                const cleanedText = text
                    .replace(/\s+/g, ' ') // Replace multiple whitespace characters with a single space
                    .trim(); // Trim leading and trailing whitespace

                cy.log('Cleaned Text:', cleanedText); // Print cleaned text content to the Cypress log
                expect(cleanedText).to.equal('Epic sadface: Username and password do not match any user in this service');
            })
    })
})
