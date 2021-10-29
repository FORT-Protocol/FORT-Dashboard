import React from "react"
import { render, screen } from "@testing-library/react"
import Data from "./Data"

test("renders learn react link", () => {
  render(<Data />)
  const linkElement = screen.getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})
