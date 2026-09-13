import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Tabs } from "./tabs"

const tabs = [
  { id: "exterior", label: "Exterior" },
  { id: "interior", label: "Interior" },
  { id: "addon", label: "Add-On Services" },
]

describe("Tabs", () => {
  it("renders a tab for each entry", () => {
    render(<Tabs tabs={tabs} activeTab="exterior" onTabChange={() => {}} />)
    tabs.forEach((tab) => {
      expect(screen.getByRole("tab", { name: tab.label })).toBeInTheDocument()
    })
  })

  it("marks the tab matching activeTab as selected", () => {
    render(<Tabs tabs={tabs} activeTab="interior" onTabChange={() => {}} />)
    expect(screen.getByRole("tab", { name: "Interior" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
    expect(screen.getByRole("tab", { name: "Exterior" })).toHaveAttribute(
      "aria-selected",
      "false",
    )
  })

  it("calls onTabChange with the clicked tab's id", async () => {
    const onTabChange = vi.fn()
    render(<Tabs tabs={tabs} activeTab="exterior" onTabChange={onTabChange} />)
    await userEvent.click(screen.getByRole("tab", { name: "Add-On Services" }))
    expect(onTabChange).toHaveBeenCalledWith("addon")
  })

  it("does not change which tab is selected on its own (controlled component)", async () => {
    const onTabChange = vi.fn()
    render(<Tabs tabs={tabs} activeTab="exterior" onTabChange={onTabChange} />)
    await userEvent.click(screen.getByRole("tab", { name: "Interior" }))
    // Parent owns activeTab; without it changing the prop, selection stays put.
    expect(screen.getByRole("tab", { name: "Exterior" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
  })
})
