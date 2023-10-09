import WelcomeUser from "@/components/welcomeUser";

describe("WelcomeUser", () => {
    it("renders", () => {
        cy.mount(<WelcomeUser />);
        cy.contains("Welcome!");
    });
    }
);