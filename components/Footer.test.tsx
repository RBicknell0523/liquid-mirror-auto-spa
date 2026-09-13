import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Footer } from "./Footer"
import { contactInfo } from "@/data/contactInfo"

describe("Footer", () => {
  it("renders the brand logo", () => {
    render(<Footer />)
    expect(screen.getByAltText(/liquid mirror auto spa/i)).toBeInTheDocument()
  })

  it("renders links to every section", () => {
    render(<Footer />)
    ;[
      ["Home", "#home"],
      ["About", "#about"],
      ["Services", "#services"],
      ["Contact", "#contact"],
    ].forEach(([label, href]) => {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", href)
    })
  })

  it("renders a social link for each configured social", () => {
    render(<Footer />)
    contactInfo.socials.forEach((social) => {
      expect(screen.getByRole("link", { name: social.label })).toBeInTheDocument()
    })
  })

  it("renders the copyright line with the current year and business name", () => {
    render(<Footer />)
    const year = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(`${year}.*Liquid Mirror Auto Spa`, "i"))).toBeInTheDocument()
  })
})
