//@ts-nocheck
import { truncate } from 'cypress/types/lodash';
import React from 'react';

import PreviewApplication from './previewApplication';

const sampleData = {
  name: 'A-Level Application',
  description: 'Hi! Apply to us',
  questions: [
    {
      id: '1',
      value: 'How are you?',
      type: 'TEXT_IN',
      isRequired: false,
    },
    {
      id: '2',
      value: 'Wyd?',
      type: 'TEXT_IN',
      isRequired: true,
    },
    {
      id: '3',
      value: 'Why us?',
      type: 'TEXT_IN',
      isRequired: true,
    },
  ],
  publishDate: new Date(),
  deadlineDate: new Date(),
};

describe('<PreviewApplication />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<PreviewApplication doesExist={true} modalInfo={sampleData} />);
  }),
    it('retrieves name', () => {
      cy.mount(<PreviewApplication doesExist={true} modalInfo={sampleData} />);
      cy.get('.mantine-iojab0').should('have.text', sampleData.name);
    }),
    it('retrieves descirption', () => {
      cy.mount(<PreviewApplication doesExist={true} modalInfo={sampleData} />);
      cy.contains(sampleData.description).should('have.length', 1);
    }),
    it('has 3 questions', () => {
      cy.mount(<PreviewApplication doesExist={true} modalInfo={sampleData} />);
      cy.get('[data-cy=q]').should('have.length', sampleData.questions.length);
    });
  it('retrieves publish date', () => {
    cy.mount(<PreviewApplication doesExist={true} modalInfo={sampleData} />);
    cy.get('.mantine-tt2qxo').should('contain', 'Application Opened');
  });
  it('retrieves deadline date', () => {
    cy.mount(<PreviewApplication doesExist={true} modalInfo={sampleData} />);
    cy.get('.mantine-1y6z788').should('contain', 'Application Closes' );
  });
});
