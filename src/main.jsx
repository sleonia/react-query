import React from "react"
import ReactDOM from "react-dom/client"
import { ErrorBoundary } from "react-error-boundary"

import { App } from "./view/App"

import "./index.css"

const FallbackComponent = () => {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <img src="src/corgi.webp" width="500px" alt="cute corgi" />
    </div>
  )
}

const root = document.getElementById("root")

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
