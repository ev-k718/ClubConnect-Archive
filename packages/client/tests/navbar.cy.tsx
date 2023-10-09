import NavBar from "@/components/navbar";

describe("NavBar", () => {
    it("renders", () => {
        cy.mount(<NavBar />);
    });

    it("has page name", () => {
        cy.mount(<NavBar />);
        cy.get('.mantine-dicgnb').contains("ClubConnect");
    });

    it("has clickable burger button", () => {
        cy.mount(<NavBar />);
        cy.get('.mantine-Burger-root').click();
    });

    it("has clickable signout button", () => {
        cy.mount(<NavBar />);
        it("has clickable button", () => {
            cy.mount(<NavBar />);
            cy.get('.mantine-Burger-root').click();});
    });

    it("has clickable applicant portal button", () => {
        cy.mount(<NavBar />);
        it("has clickable button", () => {
            cy.mount(<NavBar />);
            cy.get('[style="min-width: 100%; display: table;"] > [href="/applicant"]').click();});
    });

    it("has clickable my clubs button", () => {
        cy.mount(<NavBar />);
        it("has clickable button", () => {
            cy.mount(<NavBar />);
            cy.get('[style="min-width: 100%; display: table;"] > [href="/member"]').click();});
    });
});