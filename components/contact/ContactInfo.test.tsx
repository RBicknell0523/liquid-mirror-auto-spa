import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ContactInfo } from "./ContactInfo"
import { contactInfo } from "@/data/contactInfo"

describe("ContactInfo", () => {
  it("renders phone, email, service area, and hours", () => {
    render(<ContactInfo />)
    expect(screen.getByText(contactInfo.phone)).toBeInTheDocument()
    expect(screen.getByText(contactInfo.email)).toBeInTheDocument()
    expect(screen.getByText(contactInfo.serviceArea)).toBeInTheDocument()
    expect(screen.getByText(contactInfo.hours)).toBeInTheDocument()
  })

  it("renders a social link for each configured social", () => {
    render(<ContactInfo />)
    contactInfo.socials.forEach((social) => {
      expect(screen.getByRole("link", { name: social.label })).toBeInTheDocument()
    })
  })
})
