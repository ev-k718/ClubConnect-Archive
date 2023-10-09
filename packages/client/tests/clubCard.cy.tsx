import ClubCard from '@/components/clubDashboard/ClubCard';


describe('<ClubCard />', () => {
    it('renders', () => {
        cy.mount(<ClubCard id = {23} name = {"ClubName"} membersLength = {12} cycle ={"Spring semester"}/>);
    })

    it('has an image', () => {
        cy.mount(<ClubCard id = {23} name = {"ClubName"} membersLength = {12} cycle ={"Spring semester"}/>);
        cy.get('img').should('be.visible')
    })

    it('has correct name', () => {
        cy.mount(<ClubCard id = {23} name = {"ClubName"} membersLength = {12} cycle ={"Spring semester"}/>);
        cy.get('.mantine-uc85lc > :nth-child(1) > .mantine-Text-root').contains("ClubName")
    })

    it('has application cycle and correct application cycle', () => {
        cy.mount(<ClubCard id = {23} name = {"ClubName"} membersLength = {12} cycle ={"Spring semester"}/>);
        cy.get(':nth-child(1) > .mantine-1w85feo').contains('Application Cycle')
        cy.get(':nth-child(1) > .mantine-ylv45l').contains('Spring semester')
    })

    it('has members and correct member value', () => {
        cy.mount(<ClubCard id = {23} name = {"ClubName"} membersLength = {12} cycle ={"Spring semester"}/>);
        cy.get(':nth-child(2) > .mantine-1w85feo').contains('Members')
        cy.get(':nth-child(2) > .mantine-ylv45l').contains('12')
    })


    it('has button is clickable', () => {
        cy.mount(<ClubCard id = {23} name = {"ClubName"} membersLength = {12} cycle ={"Spring semester"}/>);
        cy.get('.mantine-UnstyledButton-root').click
    })

    

    


})
