import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../utils";
import Button from "../../src/components/button/Button";

describe("Button Component", () => {
  it("renders with children text", () => {
    render(<Button>Click me</Button>);

    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it("applies fullWidth class when fullWidth prop is true", () => {
    render(<Button fullWidth>Full width button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("w-full", "block");
  });

  it("renders prepend icon when provided", () => {
    const prependIcon = <span data-testid="prepend-icon">📧</span>;
    render(<Button prependIcon={prependIcon}>Email</Button>);

    expect(screen.getByTestId("prepend-icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /email/i })).toBeInTheDocument();
  });

  it("renders append icon when provided", () => {
    const appendIcon = <span data-testid="append-icon">→</span>;
    render(<Button appendIcon={appendIcon}>Next</Button>);

    expect(screen.getByTestId("append-icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom button</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
    // También debe mantener las clases por defecto
    expect(button).toHaveClass("bg-slate-900", "text-white", "px-4", "py-2");
  });

  it("passes through HTML button attributes", () => {
    render(
      <Button disabled type="submit" aria-label="Submit form">
        Submit
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("aria-label", "Submit form");
  });

  it("renders both prepend and append icons", () => {
    const prependIcon = <span data-testid="prepend-icon">📧</span>;
    const appendIcon = <span data-testid="append-icon">→</span>;

    render(
      <Button prependIcon={prependIcon} appendIcon={appendIcon}>
        Send Email
      </Button>,
    );

    expect(screen.getByTestId("prepend-icon")).toBeInTheDocument();
    expect(screen.getByTestId("append-icon")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send email/i }),
    ).toBeInTheDocument();
  });

  it("should be loading state", () => {
    render(<Button isLoading>Loading...</Button>);

    expect(
      screen.getByRole("button", { name: /loading/i }),
    ).toBeInTheDocument();
  });
});
