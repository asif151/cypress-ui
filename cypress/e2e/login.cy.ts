describe('Positive Test case', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })

    it('Add to cart a product and successfully checkout', function () {
        let itemPrice: number;
        let itemTax: number;
        let itemTotal: number;

        const username = Cypress.env('users').cypressUser.username;
        const password = Cypress.env('users').cypressUser.password;
        cy.visit('/')

        cy.get('input[name=user-name]').type(username)
        cy.get('input[name=password]').type(`${password}{enter}`)

        cy.url().should('include', '/inventory.html')

        cy.contains('.inventory_item_name', 'Sauce Labs Bolt T-Shirt')
            .parents('.inventory_item')
            .find('button')
            .click();

        // Now click on the shopping cart
        cy.get('#shopping_cart_container').click();

        // verify that you are on the cart page
        cy.url().should('include', '/cart.html');

        // Verify the item appears in the cart
        cy.get('.cart_item').should('exist'); // Ensures at least one item is in the cart

        // verify the quantity
        cy.get('.cart_quantity').should('contain', '1');

        // Check the presence and visibility of the item name
        cy.get('.inventory_item_name')
            .should('be.visible')
            .and('exist')
            .then($itemName => {
                cy.log(`Item Name: ${$itemName.text()}`);
            });

        // Check the presence and visibility of the item description
        cy.get('.inventory_item_desc')
            .should('be.visible')
            .and('exist')
            .then($itemDescription => {
                cy.log(`Item Description: ${$itemDescription.text()}`);
            });

        // Check the presence and visibility of the item price
        cy.get('.inventory_item_price')
            .should('be.visible')
            .and('exist')
            .then($itemPrice => {
                cy.log(`Item Price: ${$itemPrice.text()}`);
            });

        // Click on the CHECKOUT button
        cy.get('.checkout_button').click();

        // verify that you are redirected to the checkout page
        cy.url().should('include', '/checkout-step-one.html');

        // Enter first name
        cy.get('#first-name').type('asif');

        // Enter last name
        cy.get('#last-name').type('gulzar');

        // Enter zip code
        cy.get('#postal-code').type('54000');

        // Click on the CONTINUE button
        cy.get('.btn_primary.cart_button').click();

        // redirected to the next step of the checkout process
        cy.url().should('include', '/checkout-step-two.html');

        // Verify the item details
        cy.get('.cart_item').within(() => {
            cy.get('.summary_quantity').should('contain', '1');
            cy.get('.inventory_item_name').should('be.visible');
            cy.get('.inventory_item_desc').should('be.visible');
        });

        // Verify payment information
        cy.get('.summary_info').within(() => {
            cy.get('.summary_info_label').first().should('contain', 'Payment Information:');
            cy.get('.summary_value_label').first().should('be.visible');
        });

        // Verify shipping information
        cy.get('.summary_info').within(() => {
            cy.get('.summary_info_label').eq(1).should('contain', 'Shipping Information:');
            cy.get('.summary_value_label').eq(1).should('be.visible');
        });

        // Verify pricing details
        cy.get('.summary_info')
            .find('.summary_subtotal_label')
            .invoke('text')
            .then((priceResult) => {
                itemPrice = parseFloat(priceResult.replace(/[^0-9.]/g, ''));
                cy.log(`Item Price: ${itemPrice}`);
                expect(itemPrice).to.equal(15.99)
            });
        cy.get('.summary_info')
            .find('.summary_tax_label')
            .invoke('text')
            .then((taxResults) => {
                itemTax = parseFloat(taxResults.replace(/[^0-9.]/g, ''));
                cy.log(`Item tax: ${itemTax}`);

            });
        cy.get('.summary_info')
            .find('.summary_total_label')
            .invoke('text')
            .then((totalPriceResults) => {
                itemTotal = parseFloat(totalPriceResults.replace(/[^0-9.]/g, ''))
                cy.log(`Item Price: ${itemTotal}`);
                expect(itemTotal).to.equal(itemPrice + itemTax)
            });

        // verify the presence of buttons
        cy.get('.cart_footer').within(() => {
            cy.get('.cart_cancel_link').should('be.visible').and('contain', 'CANCEL');
            cy.get('.btn_action.cart_button').should('be.visible').and('contain', 'FINISH');
        });

        cy.get('.cart_footer .btn_action.cart_button')
            .should('be.visible') // Ensure the button is visible
            .click();

        // Verify header text
        cy.get('#checkout_complete_container .complete-header')
            .should('be.visible')
            .and('contain.text', 'THANK YOU FOR YOUR ORDER');

        // Verify confirmation text
        cy.get('#checkout_complete_container .complete-text')
            .invoke('text')
            .then(text => {
                // Clean up text content
                const cleanedText = text
                    .replace(/\s+/g, ' ') // Replace multiple whitespace characters with a single space
                    .replace(/\u00A0/g, ' ') // Replace non-breaking spaces with regular spaces
                    .trim(); // Trim leading and trailing whitespace

                console.log('Cleaned Text:', cleanedText); // Print cleaned text content to the console
                expect(cleanedText).to.equal('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
            })
            .then(() => cy.log('Confirmation text verified'));
    });
})
