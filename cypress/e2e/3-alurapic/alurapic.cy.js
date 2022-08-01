describe('Login e registro de usuários no AluraPic', () => {

    beforeEach(() => {
        cy.visit('/');
        // cy.intercept('POST', 'https://apialurapic.herokuapp.com/user/login', {statusCode:400}).as('stubPost');
    })

    it('Verifica mensagem de validação', () => {
        cy.contains('a', 'Register now').click();
        cy.contains('button', 'Register').click();
        cy.contains('ap-vmessage', 'Email is required!').should('be.visible');
        cy.contains('button', 'Register').click();
        cy.contains('ap-vmessage', 'Full name is required!').should('be.visible');
        cy.contains('ap-vmessage', 'User name ').should('be.visible');
        cy.contains('ap-vmessage', 'Password is required!').should('be.visible');
    });
    
    it('Verifica mensagem de e-mail inválido', () => {
        cy.contains('a', 'Register now').click();
        cy.contains('button', 'Register').click();
        cy.get('input[formcontrolname=email]').type('Fernando');
        cy.contains('ap-vmessage', 'Invalid e-mail').should('be.visible');
    });

    it('Verifica mensagem de senha menor que 8 caracteres', () => {
        cy.contains('a', 'Register now').click();
        cy.contains('button', 'Register').click();
        cy.get('input[formcontrolname=password]').type('123');
        cy.contains('button', 'Register').click();
        cy.contains('ap-vmessage', 'Mininum length is 8').should('be.visible');
    });

    it('Realiza o login com usuário válido', () => {
        cy.login(Cypress.env('userName'), Cypress.env('password'));
        // cy.wait('@stubPost');
        cy.contains('a', '(Logout)').should('be.visible');
    });

    it('Realiza o login com usuário inválido', () => {
        cy.login('fernando', '1234');
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Invalid user name or password');
        });
    });
 
    const usuarios = require('../../fixtures/usuarios.json');
    usuarios.forEach(usuario => {
        it(`Cadastra novo usuário: ${usuario.username}`, () => {
            cy.contains('a', 'Register now').click();
            cy.get('input[formcontrolname=email]').type(usuario.email);
            cy.get('input[formcontrolname=fullName]').type(usuario.fullname);
            cy.get('input[formcontrolname=userName]').type(usuario.username);
            cy.get('input[formcontrolname=password]').type(usuario.password);
            cy.contains('button', 'Register').click();
        });
    }); 
    it('Fazer login do Flávio', () => {
        cy.request({
            method: 'POST',
            url: 'https://apialurapic.herokuapp.com/user/login',
            body: Cypress.env()
        }).then(response => {
            expect(response.status).to.be.equal(200);
            expect(response.body).is.not.empty;
            expect(response.body).to.have.property("id");
            expect(response.body.id).to.be.equal(1);
            expect(response.body).to.have.property("email");
            expect(response.body.email).to.be.equal("flavio@alurapic.com.br");

        });
    });
    it('Buscar fotos do Flávio', () => {
        // const tempoEsperado = Math.random() * 3000;
        cy.request({
            method: 'GET',
            url: 'https://apialurapic.herokuapp.com/flavio/photos'
        }).then(response => {
            expect(response.status).to.be.equal(200);
            expect(response.body).is.not.empty;
            expect(response.body[0]).to.have.property('description');
            expect(response.body[0].description).to.be.equal('Farol iluminado');
            // expect(response.duration).to.be.lte(tempoEsperado);
        });
    });

});