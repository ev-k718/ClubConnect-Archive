import ApplicationButtonMembersView from "@/components/applicationButtonMembersView";

describe("ApplicationButtonMembersView", () => {
    it("should render", () => {
        const application = {
        clubId: "clubId",
        id: "id",
        name: "name",
        deadline: "2021-10-15T00:00:00.000Z",
        status: "status",
        openDate: "2021-10-15T00:00:00.000Z",
        description: "description",
        questions: []
        };

        cy.mount(<ApplicationButtonMembersView application = {application}/>);
    })

    it("should have a name", () => {
        const application = {
        clubId: "clubId",
        id: "id",
        name: "namee",
        deadline: "2021-10-15T00:00:00.000Z",
        status: "status",
        openDate: "2021-10-15T00:00:00.000Z",
        description: "description",
        questions: []
        };

        cy.mount(<ApplicationButtonMembersView application = {application}/>);
        cy.get(':nth-child(1) > .mantine-1eliosc').contains("namee")

    })

    it("should have a deadline", () => {
        const application = {
        clubId: "clubId",
        id: "id",
        name: "namee",
        deadline: "2021-10-15T00:00:00.000Z",
        status: "status",
        openDate: "2021-10-15T00:00:00.000Z",
        description: "description",
        questions: []
        };

        cy.mount(<ApplicationButtonMembersView application = {application}/>);
        cy.get(':nth-child(2) > .mantine-1eliosc')

    })

    it("should have a status", () => {
        const application = {
        clubId: "clubId",
        id: "id",
        name: "namee",
        deadline: "2021-10-15T00:00:00.000Z",
        status: "status",
        openDate: "2021-10-15T00:00:00.000Z",
        description: "description",
        questions: []
        };

        cy.mount(<ApplicationButtonMembersView application = {application}/>);
        cy.get(':nth-child(3) > .mantine-1eliosc')
    })


    it("view applicants button clicks", () => {
        const application = {
        clubId: "clubId",
        id: "id",
        name: "namee",
        deadline: "2021-10-15T00:00:00.000Z",
        status: "status",
        openDate: "2021-10-15T00:00:00.000Z",
        description: "description",
        questions: []
        };

        cy.mount(<ApplicationButtonMembersView application = {application}/>);
        cy.get(':nth-child(3) > .mantine-1eliosc').click()
    })


    });
