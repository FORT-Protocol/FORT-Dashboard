import React from "react"
import ReactDOM from "react-dom"
import App from "./pages/App"
import reportWebVitals from "./reportWebVitals"
import {ChakraProvider} from "@chakra-ui/react"
import {RecoilRoot} from "recoil"
import {HashRouter} from "react-router-dom"
import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  colors: {
    hedge: "#0047BB",
  },
})

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <HashRouter>
        <ChakraProvider theme={theme}>
          <App/>
        </ChakraProvider>
      </HashRouter>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
