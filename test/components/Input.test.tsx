import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "../utils";
import { FormProvider, useForm } from "react-hook-form";
import Input from "../../src/components/input/Input";
import type { Link } from "../../src/types/link.type";

vi.mock("../../src/helpers/utils", () => ({
  cn: (...classes: (string | undefined | null | boolean | object)[]) => {
    return classes
      .filter(Boolean)
      .map((cls) => {
        if (typeof cls === "string") return cls;
        if (typeof cls === "object" && cls !== null) {
          // Handle conditional classes object
          return Object.entries(cls)
            .filter(([, condition]) => condition)
            .map(([className]) => className)
            .join(" ");
        }
        return "";
      })
      .join(" ");
  },
}));

const FormWrapper = ({
  children,
  defaultValues = {},
}: {
  children: React.ReactNode;
  defaultValues?: Record<string, unknown>;
}) => {
  const methods = useForm({ defaultValues });
  return (
    <FormProvider {...methods}>
      <form>{children}</form>
    </FormProvider>
  );
};

describe("Input Component", () => {
  const mockDatalist: Link[] = [
    {
      id: "1",
      slug: "test-slug-1",
      url: "https://example.com",
      shortLink: "https://brever.link/abc",
      qrCode: null,
      clickCount: 5,
      createdAt: new Date(),
    },
    {
      id: "2",
      slug: "test-slug-2",
      url: "https://google.com",
      shortLink: "https://brever.link/def",
      qrCode: null,
      clickCount: 10,
      createdAt: new Date(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render without crashing", () => {
      render(
        <FormWrapper>
          <Input name="test" />
        </FormWrapper>,
      );

      const input = screen.getByDisplayValue("");
      expect(input).toBeInTheDocument();
    });

    it("should render with label", () => {
      const labelText = "Test Label";
      render(
        <FormWrapper>
          <Input name="test" label={labelText} />
        </FormWrapper>,
      );

      expect(screen.getByText(labelText)).toBeInTheDocument();
      expect(screen.getByLabelText(labelText)).toBeInTheDocument();
    });

    it("should render with placeholder", () => {
      const placeholderText = "Enter text here";
      render(
        <FormWrapper>
          <Input name="test" placeholder={placeholderText} />
        </FormWrapper>,
      );

      expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
    });

    it("should apply required attribute and show asterisk", () => {
      render(
        <FormWrapper>
          <Input name="test" label="Required Field" required />
        </FormWrapper>,
      );

      const input = screen.getByDisplayValue("") as HTMLInputElement;
      expect(input).toBeRequired();
      expect(screen.getByText("*")).toBeInTheDocument();
      expect(screen.getByText("Required Field")).toBeInTheDocument();
    });

    it("should not show asterisk when not required", () => {
      render(
        <FormWrapper>
          <Input name="test" label="Optional Field" />
        </FormWrapper>,
      );

      expect(screen.getByText("Optional Field")).toBeInTheDocument();
      expect(screen.queryByText("*")).not.toBeInTheDocument();
    });

    it("should render asterisk with red color for required fields", () => {
      render(
        <FormWrapper>
          <Input name="test" label="Required Field" required />
        </FormWrapper>,
      );

      const asterisk = screen.getByText("*");
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveClass("text-red-500");
    });

    it("should apply disabled state", () => {
      render(
        <FormWrapper>
          <Input name="test" disabled />
        </FormWrapper>,
      );

      const input = screen.getByDisplayValue("");
      expect(input).toBeDisabled();
    });
  });

  describe("Datalist Functionality", () => {
    it("should render datalist when provided", () => {
      render(
        <FormWrapper>
          <Input name="test" datalist={mockDatalist} />
        </FormWrapper>,
      );

      const input = screen.getByDisplayValue("");
      const listId = input.getAttribute("list");
      expect(listId).toBeTruthy();

      const datalist = document.getElementById(listId!);
      expect(datalist).toBeInTheDocument();
      expect(datalist?.tagName).toBe("DATALIST");
    });

    it("should not render datalist when empty array", () => {
      render(
        <FormWrapper>
          <Input name="test" datalist={[]} />
        </FormWrapper>,
      );

      const datalists = document.querySelectorAll("datalist");
      expect(datalists).toHaveLength(0);
    });

    it("should render correct options in datalist", () => {
      render(
        <FormWrapper>
          <Input name="test" datalist={mockDatalist} />
        </FormWrapper>,
      );

      const input = screen.getByDisplayValue("");
      const listId = input.getAttribute("list");
      const datalist = document.getElementById(listId!);

      const options = datalist?.querySelectorAll("option");
      expect(options).toHaveLength(mockDatalist.length);

      expect(options?.[0]).toHaveAttribute("value", "test-slug-1");
      expect(options?.[1]).toHaveAttribute("value", "test-slug-2");
    });
  });

  describe("User Interactions", () => {
    it("should handle input changes", () => {
      render(
        <FormWrapper>
          <Input name="test" />
        </FormWrapper>,
      );

      const input = screen.getByDisplayValue("") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "test value" } });

      expect(input.value).toBe("test value");
    });

    it("should handle focus and blur events", () => {
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();

      render(
        <FormWrapper>
          <Input name="test" onFocus={handleFocus} onBlur={handleBlur} />
        </FormWrapper>,
      );

      const input = screen.getByDisplayValue("");

      fireEvent.focus(input);
      expect(handleFocus).toHaveBeenCalledTimes(1);

      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe("Props and Attributes", () => {
    it("should use custom id when provided", () => {
      const customId = "custom-input-id";
      render(
        <FormWrapper>
          <Input name="test" id={customId} label="Test Label" />
        </FormWrapper>,
      );

      const input = screen.getByLabelText("Test Label");
      expect(input).toHaveAttribute("id", customId);
    });

    it("should apply custom className", () => {
      const customClass = "custom-input-class";
      render(
        <FormWrapper>
          <Input name="test" className={customClass} />
        </FormWrapper>,
      );

      const input = screen.getByDisplayValue("");
      expect(input).toHaveClass(customClass);
    });

    it("should pass through HTML input attributes", () => {
      render(
        <FormWrapper>
          <Input
            name="test"
            type="email"
            maxLength={50}
            aria-describedby="help-text"
          />
        </FormWrapper>,
      );

      const input = screen.getByDisplayValue("");
      expect(input).toHaveAttribute("type", "email");
      expect(input).toHaveAttribute("maxlength", "50");
      expect(input).toHaveAttribute("aria-describedby", "help-text");
    });

    it("should have proper name attribute", () => {
      render(
        <FormWrapper>
          <Input name="test-field" />
        </FormWrapper>,
      );

      const input = screen.getByDisplayValue("");
      expect(input).toHaveAttribute("name", "test-field");
    });
  });

  describe("Error Handling", () => {
    it("should show error message when validation fails", () => {
      const FormWithErrors = () => {
        const methods = useForm();
        methods.setError("test", { message: "This field is required" });

        return (
          <FormProvider {...methods}>
            <form>
              <Input name="test" />
            </form>
          </FormProvider>
        );
      };

      render(<FormWithErrors />);

      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("should show fallback error message when error toString returns empty", () => {
      const FormWithSpecialError = () => {
        const methods = useForm();

        // Create an error object with a message that has a toString method returning empty string
        const errorWithEmptyToString = {
          toString: () => "",
        };

        methods.setError("test", {
          message: errorWithEmptyToString as unknown as string,
        });

        return (
          <FormProvider {...methods}>
            <form>
              <Input name="test" />
            </form>
          </FormProvider>
        );
      };

      render(<FormWithSpecialError />);

      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("should apply error styling when there is an error", () => {
      const FormWithErrors = () => {
        const methods = useForm();
        methods.setError("test", { message: "Error message" });

        return (
          <FormProvider {...methods}>
            <form>
              <Input name="test" />
            </form>
          </FormProvider>
        );
      };

      render(<FormWithErrors />);

      const input = screen.getByDisplayValue("");
      // Since cn is mocked, we need to check differently
      // The mock should join the classes including the error class
      expect(input.className).toContain("!outline-red-500");
    });
  });

  describe("Accessibility", () => {
    it("should associate label with input correctly", () => {
      render(
        <FormWrapper>
          <Input name="test" label="Accessible Label" />
        </FormWrapper>,
      );

      const input = screen.getByLabelText("Accessible Label");
      expect(input).toBeInTheDocument();
    });

    it("should support ARIA attributes", () => {
      render(
        <FormWrapper>
          <Input
            name="test"
            aria-label="Custom label"
            aria-describedby="help-text"
          />
        </FormWrapper>,
      );

      const input = screen.getByDisplayValue("");
      expect(input).toHaveAttribute("aria-label", "Custom label");
      expect(input).toHaveAttribute("aria-describedby", "help-text");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty datalist gracefully", () => {
      render(
        <FormWrapper>
          <Input name="test" datalist={[]} />
        </FormWrapper>,
      );

      const input = screen.getByDisplayValue("");
      expect(input).toBeInTheDocument();

      const datalists = document.querySelectorAll("datalist");
      expect(datalists).toHaveLength(0);
    });

    it("should handle long label text", () => {
      const longLabel =
        "This is a very long label that might wrap to multiple lines and should still work correctly";
      render(
        <FormWrapper>
          <Input name="test" label={longLabel} />
        </FormWrapper>,
      );

      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it("should handle input without label", () => {
      render(
        <FormWrapper>
          <Input name="test" />
        </FormWrapper>,
      );

      const input = screen.getByDisplayValue("");
      expect(input).toBeInTheDocument();
      // Should not have any label text
      expect(screen.queryByText("*")).not.toBeInTheDocument();
    });
  });
});
