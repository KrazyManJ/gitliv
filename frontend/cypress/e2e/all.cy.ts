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
    let repo = 'Hello'; // replace with a valid repo name
    const branch = 'main'; // replace with a real branch
    const editedRepoName = repo+"123"

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
                cy.get('body').should('have.class', 'dark')
            } else {
                cy.get('body').should('not.have.class', 'dark')
            }
    })

    it('Add repository', () => {
        cy.visit('/repositories')
        cy.get('[data-cy="add"]').click()
        cy.get('[data-cy="name"]').type(repo)
        cy.get('[data-cy="readme"]').click()
        cy.get('[data-cy="yes"]').click()
        cy.get('h3').contains(repo).first()
    })

    it('Edit repository', () => {
        cy.visit('/repositories')
        cy.get('[data-cy="edit"]').first().click()
        cy.intercept('GET', '/repos/*/*').as('getRepo')
        cy.wait('@getRepo')
        cy.get('[data-cy="name"]').type("123")
        cy.intercept('PATCH', '/repos/*/*').as('patchHelloRepo')
        cy.get('[data-cy="yes"]').click()
        cy.wait('@patchHelloRepo')
        cy.visit('/repositories')
        cy.get('h3').contains(editedRepoName).first()
        repo = editedRepoName
    })

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

    it('Delete repository', () => {
        cy.visit('/repositories')
        cy.get('[data-cy="delete"]').first().click()
        cy.get('code').contains(`${owner}/${repo}`)
        cy.get('[data-cy="repository-name-input"]').type(`${owner}/${repo}`)
        cy.intercept('GET', '/user/repos*').as('getUserRepos')
        cy.get('[data-cy="confirm-delete"]').click()
        cy.wait('@getUserRepos')
        cy.get('h3').should('not.contain', repo)
    })

})
