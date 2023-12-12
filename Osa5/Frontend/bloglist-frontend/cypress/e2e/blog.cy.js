describe('Note ', function() {
  beforeEach(function() {
    cy.visit('http://localhost:5173')
  })

  it('front page can be opened', function() {
    cy.contains('Blogs')
  })

  it('Login form is shown', function() {
    cy.get('#username')
    cy.get('#password')
    cy.get('#login-button').contains('Login')
  })

  it('succeeds with correct credentials', function() {
    cy.get('#username').type('test')
    cy.get('#password').type('test')
    cy.get('#login-button').click()
    cy.contains('Logged in successfully as test')
  })

  it('fails with wrong credentials', function() {
    cy.get('#username').type('test')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()
    cy.contains('Failed to login')
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('test')
      cy.get('#password').type('test')
      cy.get('#login-button').click()
    })

    it('A blog can be created, liked and deleted', function() {
      cy.get('#new-blog').click()
      cy.get('#new-title').type('cytitle')
      cy.get('#new-author').type('cyauth')
      cy.get('#new-url').type('cyurl')
      cy.get('#submit-blog').click()

      cy.contains("cytitle by testdude").parent().as('blogtomodify')
      cy.get('@blogtomodify').find('#view').click()
      cy.get('@blogtomodify').find('#like').click()
      cy.get('@blogtomodify').contains('1')
      cy.get('@blogtomodify').find('#delete').click()
      cy.contains('Blog post deleted successfully')
      cy.contains('cytitle').should('not.exist');
    })

    it('blogs get ordered by likes', function() {
      // AAAAAAAAAAAAAAA
    });

  })

  it('succeeds with correct credentials but unable to delete post that is not mine', function() {
    cy.get('#username').type('uustest')
    cy.get('#password').type('uustest')
    cy.get('#login-button').click()
    cy.contains('Logged in successfully as uustest')

    cy.contains("Testblog by testdude").parent().as('blogtomodify')
    cy.get('@blogtomodify').find('#delete').should('not.exist');
  })
})