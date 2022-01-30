import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'styled-components'
import { theme, Loader, Title } from '@gnosis.pm/safe-react-components'
import SafeProvider from '@gnosis.pm/safe-apps-react-sdk'
import { createClient, Provider as URQLProvider } from 'urql'

import GlobalStyle from './GlobalStyle'
import App from './App'
console.log(process.env.NODE_ENV, ' envorinment')
const client = createClient({
  url:
    process.env.NODE_ENV === 'production'
      ? 'https://api.thegraph.com/subgraphs/name/janmajayamall/meme-curator-subgraphs'
      : 'https://api.thegraph.com/subgraphs/name/janmajayamall/pm-content-test',
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <URQLProvider value={client}>
        <SafeProvider
          loader={
            <>
              <Title size="md">Waiting for Safe...</Title>
              <Loader size="md" />
            </>
          }
        >
          <App />
        </SafeProvider>
      </URQLProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
