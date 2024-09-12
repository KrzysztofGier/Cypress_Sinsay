const user = {
  username: 'jan',
  email: 'sonik165@gmail.com',
  password: 'janjan', 
  invalidPassword: 'abcde',
};

beforeEach(() => {
  cy.visit('/');

  cy.get('#cookiebotDialogOkButton').click();
});

describe('Login Functionality', () => {
  it('Logs in a user and verifies redirection and username', () => {
    cy.get('[data-testid="account-info-logged-false"] > .ds-dropdown-button > .ds-link > .ds-icon').click();
    cy.get('[data-selen="login-email"]').type(user.email);
    cy.get('[data-selen="login-password"]').type(user.password);
    cy.get('[data-selen="login-submit"]').click();

  
    cy.url().should('eq', 'https://www.sinsay.com/pl/pl/');
    cy.get('#accountRoot').should('contain', user.username);
  });

  it('Should not be able to log in with invalid password', () => {
    cy.get('[data-testid="account-info-logged-false"] > .ds-dropdown-button > .ds-link > .ds-icon').click();
    cy.get('[data-selen="login-email"]').type(user.email);
    cy.get('[data-selen="login-password"]').type(user.invalidPassword);
    cy.get('[data-selen="login-submit"]').click();
    cy.get('.sc-gYhhMS').should('contain', 'Niepoprawny login i/lub hasło.'); 
  });
});
it('Invalid Email Format', () => {
  cy.visit('/customer/account/login');
  cy.get('input[name="login[username]"]').type('abasd');
  cy.get('input[name="login[password]"]').type(user.password);
  cy.get('[data-selen="login-submit"]').click();
  cy.get('.text-field__ErrorMessage-sc-1vll61a-5').should('be.visible');
});

describe('Product Search, Add to Cart, and Remove from Cart', () => {
  const product = {
    name: 'Koszulka', 
    sku: '8470j-00x',
    size: 'S',
  };

  beforeEach(() => {
    cy.request({
      method: 'POST',
      url: 'https://www.sinsay.com/pl/pl/customer/account/loginPost/',
      form: true,
      body: {
        login: user.email,
        password: user.password,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('Ensures the cart is empty', () => {
    cy.visit('https://www.sinsay.com/pl/pl/checkout/cart/');
    cy.get('#cartRoot > section > h1').should('be.visible'); 
  });

  it('Searches for a product and adds it to the cart', () => {
    cy.visit('https://www.sinsay.com/pl/pl/');
    cy.get('#algoliaButton').type(product.sku, '{enter}'); 
    cy.get('.AlgoliaProducts-module__algolia-products-container', { timeout: 10000 }).should('contain', '8470j-00x');
    
    cy.contains('Koszulka').click();
    cy.get('.ds-button__light > .ds-icon').click();
    cy.get('ul[data-testid="product-size-group"]', { timeout: 10000 })
    .contains(product.size)
    .click();      
    
    cy.get('[data-testid="add-to-cart-button"]').click();

    cy.get('[data-testid="cart-confirmation-go-to-cart"]', { timeout: 10000 }).click();
  });

  it('Navigates to the cart and removes the product', () => {
    cy.visit('https://www.sinsay.com/pl/pl/');
    cy.get('#algoliaButton').type(product.sku, '{enter}'); 
    cy.get('.AlgoliaProducts-module__algolia-products-container', { timeout: 10000 }).should('contain', '8470j-00x');
    
    cy.contains('Koszulka').click();
    cy.get('.ds-button__light > .ds-icon').click();
    cy.get('ul[data-testid="product-size-group"]', { timeout: 10000 })
    .contains(product.size)
    .click();      
    
    cy.get('[data-testid="add-to-cart-button"]').click();
    
    cy.get('[data-testid="cart-confirmation-go-to-cart"]', { timeout: 10000 }).click();
    cy.visit('https://www.sinsay.com/pl/pl/checkout/cart/');
    
    cy.get('.product-list__RemoveButton-mh8fks-8', { timeout: 10000 }).click();
    cy.get('[data-selen="empty-cart"]', { timeout: 10000 }).should('exist');
  });
});
