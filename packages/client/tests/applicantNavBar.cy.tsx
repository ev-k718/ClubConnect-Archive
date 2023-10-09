import ApplicantNavBar from "@/components/applicantNavbar";

describe("ApplicantNavBar", () => {
    it("renders", () => {
        cy.mount(<ApplicantNavBar />);
    });

    it("has page name", () => {
        cy.mount(<ApplicantNavBar />);
        cy.get('.mantine-Text-root').contains("ClubConnect");
    });

    it("has clickable burger button", () => {
        cy.mount(<ApplicantNavBar />);
        cy.get('.mantine-Burger-root').click();
    });

    it("has clickable signout button", () => {
        cy.mount(<ApplicantNavBar />);
        it("has clickable button", () => {
            cy.mount(<ApplicantNavBar />);
            cy.get('.mantine-Burger-root').click();});
    });

    it("has clickable all clubs button", () => {
        cy.mount(<ApplicantNavBar />);
        it("has clickable button", () => {
            cy.mount(<ApplicantNavBar />);
            cy.get('[style="min-width: 100%; display: table;"] > :nth-child(2)').click();});
    });

    it("has clickable my clubs button", () => {
        cy.mount(<ApplicantNavBar />);
        it("has clickable button", () => {
            cy.mount(<ApplicantNavBar />);
            cy.get('[style="min-width: 100%; display: table;"] > [href="/member"]').click();});
    });

    it("has clickable my applications button", () => {
        cy.mount(<ApplicantNavBar />);
        it("has clickable button", () => {
            cy.mount(<ApplicantNavBar />);
            cy.get('[style="min-width: 100%; display: table;"] > :nth-child(3)').click();});
    });
    

    

});