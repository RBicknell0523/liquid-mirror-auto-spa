import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ContactSection } from "./ContactSection"
import { contactInfo } from "@/data/contactInfo"

describe("ContactSection", () => {
  it("renders the section heading", () => {
    render(<ContactSection />)
    expect(screen.getByText(/let's make it shine/i)).toBeInTheDocument()
  })

  it("renders the contact form fields", () => {
    render(<ContactSection />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /send inquiry/i })).toBeInTheDocument()
  })

  it("renders the direct contact info", () => {
    render(<ContactSection />)
    expect(screen.getByText(contactInfo.phone)).toBeInTheDocument()
  })
})
