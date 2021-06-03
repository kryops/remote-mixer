import './ui/global-styles'

import { StrictMode } from 'react'

import { MainContainer } from './ui/main/main-container'
import { ErrorBoundary } from './util/error-boundary'
import { SettingsWrapper } from './settings'
import { OverlayContainer } from './ui/overlays/overlay'
import { ApiWrapper } from './api/api-wrapper'

const App = () => (
  <StrictMode>
    <ErrorBoundary>
      <SettingsWrapper>
        <ApiWrapper>
          <OverlayContainer>
            <MainContainer />
          </OverlayContainer>
        </ApiWrapper>
      </SettingsWrapper>
    </ErrorBoundary>
  </StrictMode>
)

export default App
