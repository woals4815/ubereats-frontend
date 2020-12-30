import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'my-ui-lib'
import { TranslationProvider } from 'my-i18n-lib'
import defaultStrings from 'i18n/en-x-default'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter as Router } from 'react-router-dom'

const AllTheProviders: React.FC = ({ children }) => {
  return (
    <HelmetProvider>
      <Router>
          {children}
      </Router>
    </HelmetProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }