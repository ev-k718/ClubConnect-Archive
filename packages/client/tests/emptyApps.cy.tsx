import EmptyApps from "@/components/applicationDashboard/emptyApps";


describe('<EmptyApps />', () => {
    it('renders', () => {
        cy.mount(<EmptyApps/>);
    })
    
    it('renders with welcome text', () => {
        cy.mount(<EmptyApps/>);
        cy.get('.mantine-Title-root').contains('Welcome')
    })

    it('renders with welcome text', () => {
        cy.mount(<EmptyApps/>);
        cy.get('.mantine-exw0qt').contains('You have no open applications')
    })

    it('has button to browse clubs thats clickable', () => {
        cy.mount(<EmptyApps/>);
        cy.get('.mantine-UnstyledButton-root').click();
    })

})
