import {createContext} from 'react';

export const assertionDefaults = {
  fullText: true,
  nameType: true
};

function setter() {
  console.error('A setter should have been set');
}

export const AssertionsContext = createContext({
  assertions: assertionDefaults,
  setAssertions: setter
});
