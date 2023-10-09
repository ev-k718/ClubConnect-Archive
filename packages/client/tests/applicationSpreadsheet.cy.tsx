import ApplicationsSpreadsheet from "../src/components/applicationDashboard/applicationsSpreadsheet"
import React from 'react'


describe('<ApplicationsSpreadsheet />', () => {

 
  it('renders multiple rows', () => {
    const applications = [
        {
          id: 1,
          clubName: 'A-Level Capital',
          appName: '2023 Final Round',
          status: 'In progress',
          dueDate: '3/21/23',
        },
        {
          id: 2,
          clubName: 'Nest Strategies',
          appName: '2023 Application',
          status: 'Submitted',
          dueDate: '1/21/23',
        },
        {
          id: 3,
          clubName: 'Marque Magazine',
          appName: 'Photographer Final Round',
          status: 'Open',
          dueDate: '2/22/23',
        },
      ];
    cy.mount(<ApplicationsSpreadsheet data={applications}/>);
  })
  
  it('renders 1 row', () => {
    const dummyData = [
      {
        id: 2,
          clubName: 'Nest Strategies',
          appName: '2023 Application',
          status: 'Submitted',
          dueDate: '1/21/23',
      }]
    cy.mount(<ApplicationsSpreadsheet data={dummyData}/>);
  })

  it('Enter application button is clickable', () => {
     const dummyData = [
      {
        id: 2,
          clubName: 'Nest Strategies',
          appName: '2023 Application',
          status: 'Submitted',
          dueDate: '1/21/23',
      }]
    cy.mount(<ApplicationsSpreadsheet data={dummyData}/>);
    cy.get('a > .mantine-UnstyledButton-root').click();
  })

})