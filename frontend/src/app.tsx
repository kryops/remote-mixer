import './ui/global-styles'

import { StrictMode } from 'react'

import { MainContainer } from './ui/main/main-container'
import { ErrorBoundary } from './util/error-boundary'
import { SettingsWrapper } from './settings'
import { OverlayContainer } from './ui/overlays/overlay'

const App = () => (
  <StrictMode>
    <ErrorBoundary>
      <SettingsWrapper>
        <OverlayContainer>
          <MainContainer />
        </OverlayContainer>
      </SettingsWrapper>
    </ErrorBoundary>
  </StrictMode>
)

export default App
