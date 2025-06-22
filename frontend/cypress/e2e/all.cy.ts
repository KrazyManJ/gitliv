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
import {setBearerAuthToken} from "../../src/api";
const TOKEN_COOKIE_NAME = "auth_token";

describe('All test, ready?', () => {
    // const username = Cypress.env('username');
    // const password = Cypress.env('password');
    const token = Cypress.env('token')
    const owner = 'vlasticka-lab'; // replace with a valid user/org in your test data
    const repo = 'new'; // replace with a valid repo name
    const branch = 'main'; // replace with a real branch

    beforeEach(() => {
        cy.visit('/')
        cy.window().then(() => {
            Cookies.set(TOKEN_COOKIE_NAME, token)
            setBearerAuthToken(token)
        })
        cy.get('[data-cy="login"]').click()
        cy.visit('/repositories')
        cy.get('[data-cy="repositories"]')
    });

    afterEach(() => {
        try {
            cy.get('[data-cy="dropDown"]').click()
            cy.get('[data-cy="logout"]').click()
            cy.get('h1').contains("GitLiv")
        }catch (e){
            console.log(e)
        }
    })

    it('Change theme to dark mode', () => {
        cy.get('[data-cy="dropDown"]').click()
        cy.get('[data-cy="dark"]').click()
        cy.get('[data-cy="dropDown"]').click()
        cy.get('body').should('have.class', 'dark')
    })

    it('Change theme to light mode', () => {
        cy.get('[data-cy="dropDown"]').click()
        cy.get('[data-cy="light"]').click()
        cy.get('[data-cy="dropDown"]').click()
        cy.get('body').should('not.have.class', 'dark')
    })

    it('Change theme to system mode', () => {
        cy.get('[data-cy="dropDown"]').click()
        cy.get('[data-cy="system"]').click()
        cy.get('[data-cy="dropDown"]').click()
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            if (prefersDark) {
                // testuj něco pro dark
                cy.get('body').should('have.class', 'dark')
            } else {
                // testuj něco pro light
                cy.get('body').should('not.have.class', 'dark')
            }
    })

    // it('Add repository', () => {
    //     cy.visit('/repositories')
    //     cy.get('[data-cy="add"]').click()
    //     cy.get('[data-cy="name"]').find('input').type("Hello")
    //     console.log(Cookies.get(TOKEN_COOKIE_NAME) || "")
    //     cy.get('[data-cy="yes"]').click()
    // })

    it('Test source', () => {
        // Visit the commit page
        cy.visit(`/repos/${owner}/${repo}/commits/${branch}`);

        // Confirm page loaded by checking title
        cy.contains('h1', 'Commits').should('exist');
        cy.contains('span', `${owner}/${repo}`).should('exist');

        // Optional: wait for commit items to render
        cy.get('.commit-item').should('exist');

        // Click the "Source" button
        cy.get('button').contains('Source').click();

        cy.contains('h1', 'Source').should('exist');
        cy.contains('span', `${owner}/${repo}`).should('exist');

        // Wait for files to be visible
        cy.get('[data-cy="file"]').first().click();

        cy.get('[data-cy="file-title"]').should('contain.text', '.md');

        cy.get('[data-cy="file-content"]')
            .invoke('text')
            .should('not.be.empty');
    });


})
