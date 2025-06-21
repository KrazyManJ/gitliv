// https://on.cypress.io/api

// describe('My First Test', () => {
//   it('visits the app root url', () => {
//     cy.visit('/')
//     cy.contains('h1', 'You did it!')
//   })
// })

// const username = Cypress.env('username');
// const password = Cypress.env('password');
//
// console.log(username)


import Cookies from "js-cookie";
const TOKEN_COOKIE_NAME = "auth_token";

describe('All test, ready?', () => {
    // const username = Cypress.env('username');
    // const password = Cypress.env('password');
    const token = Cypress.env('token')

    beforeEach(() => {
        cy.visit('/')
        cy.window().then(() => {
            Cookies.set(TOKEN_COOKIE_NAME, token)
        })
        cy.get('[data-cy="login"]').click()
    });

    // afterEach(() => {
    //     cy.get('[data-cy="logout"]').click()
    // })

    it('Add repository', () => {
        cy.visit('/repositories')
        cy.get('[data-cy="repository"]').click()
    })
})
