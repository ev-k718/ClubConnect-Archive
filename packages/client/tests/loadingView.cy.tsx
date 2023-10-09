import LoadingView from "@/components/loadingView";

describe("LoadingView", () => {
    it("renders", () => {
        cy.mount(<LoadingView />);
    });

    it("has loading component", () => {
        cy.mount(<LoadingView />);
        cy.get('.mantine-k54dx3')
    });
});
