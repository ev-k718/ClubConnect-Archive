import StatCard from "@/components/statCard";

describe("StatCard", () => {
    it("renders", () => {
        cy.mount(<StatCard data = {[]} criteria = {[]} />);
    });
    }
);