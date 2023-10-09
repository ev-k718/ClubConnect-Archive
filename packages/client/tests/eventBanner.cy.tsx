import EventBanner from '@/components/clubProfile/eventBanner';

describe('<EventBanner />', () => {

    let date = new Date();
    it('renders without crashing', () => {
        cy.mount(<EventBanner id = {1} eventName = {"name"} description = {"eventDescription"} location = {"event location"} dateTime = {date} link = {"linkk"} />);
    });

    it('has correct name', () => {
        cy.mount(<EventBanner id = {1} eventName = {"name"} description = {"eventDescription"} location = {"event location"} dateTime = {date} link = {"linkk"} />);
        cy.get(':nth-child(1) > .mantine-1eliosc').should('have.text', 'name');
    });

    it('has correct location', () => {
        cy.mount(<EventBanner id = {1} eventName = {"name"} description = {"eventDescription"} location = {"event location"} dateTime = {date} link = {"linkk"} />);
        cy.get(':nth-child(3) > .mantine-Stack-root > .mantine-1eliosc').should('have.text', "event location");
    });

    it('has a link and clickable', () => {
        cy.mount(<EventBanner id = {1} eventName = {"name"} description = {"eventDescription"} location = {"event location"} dateTime = {date} link = {"linkk"} />);
        cy.get('.mantine-Anchor-root').click();
    });

    it('edit button clickable', () => {
        cy.mount(<EventBanner id = {1} eventName = {"name"} description = {"eventDescription"} location = {"event location"} dateTime = {date} link = {"linkk"} />);
        cy.get('.mantine-1emc9ft > .mantine-Group-root > :nth-child(2)').click();
    });


    });

