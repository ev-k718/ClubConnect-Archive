import React from 'react';
import EditableField from '@/components/clubProfile/editableField';

describe('EditableField', () => {

  it('mounts', () => {
    const fieldName = 'Field Name';
    const placeholder = 'Placeholder';
    const originalValue = 'Original Value';
    const inputType = 'textinput';
    const saveFunction = () => {};
    cy.mount(
      <EditableField
        fieldName={fieldName}
        placeholder={placeholder}
        originalValue={originalValue}
        inputType={inputType}
        saveFunction={saveFunction}
      />
    );
  })



  it('edit button clickable', () => {
    const fieldName = 'Field Name';
    const placeholder = 'Placeholder';
    const originalValue = 'Original Value';
    const inputType = 'textinput';
    const saveFunction = () => {};
    cy.mount(
      <EditableField
        fieldName={fieldName}
        placeholder={placeholder}
        originalValue={originalValue}
        inputType={inputType}
        saveFunction={saveFunction}
      />
    );
    cy.get('.mantine-UnstyledButton-root').click()
  })

});
