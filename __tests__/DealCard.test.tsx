import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DealCard from "@/components/weekend-deals/DealCard";
import { Rating } from "@/common/types";

// Mock external modules
jest.mock('jose', () => ({
  jwtVerify: jest.fn().mockResolvedValue({ payload: { user: { access_token: 'mock-token' } } }),
}));

jest.mock('lenis', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({ start: jest.fn(), stop: jest.fn() })),
}));

jest.mock('lenis/react', () => ({
  useLenis: () => ({ lenis: { start: jest.fn(), stop: jest.fn() } }),
}));

// Mock window.open
beforeAll(() => {
  global.open = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("DealCard Component", () => {
  const defaultProps = {
    option1: "https://example.com/image1.jpg",
    option2: "https://example.com/image2.jpg",
    name: "Amazing Hotel Stay",
    id: 1,
    slug: "amazing-hotel",
    address: "123 Main Street, Colombo, Sri Lanka",
    favorite: false,
    rating: 4 as Rating,
    type: "Hotel",
    offer: 10,
  };

  it("renders the DealCard with offer badge", () => {
    render(<DealCard {...defaultProps} />);
    expect(screen.getByText(/10% Off/i)).toBeInTheDocument();
    expect(screen.getByText(/Amazing Hotel Stay/i)).toBeInTheDocument();
    expect(screen.getByText(/123 Main Street/i)).toBeInTheDocument();
  });

  it("displays rating stars when rating > 0", () => {
    render(
      <DealCard
        {...defaultProps}
        rating={3}
        name="Test Deal"
        address="123 Long Address Street, City"
      />
    );
    const stars = screen.getAllByTestId("rating-star");
    expect(stars).toHaveLength(3);
  });

  it("displays 'Not rated yet' when rating is 0", () => {
    render(<DealCard {...defaultProps} rating={0 as Rating} />);
    expect(screen.getByText(/Not rated yet/i)).toBeInTheDocument();
  });


  it("calls window.open with correct URL on svg click", async () => {
    const user = userEvent.setup();
    render(<DealCard {...defaultProps} />);

    const svgElement = screen.getByTestId("deal-svg");
    await user.click(svgElement);

    expect(global.open).toHaveBeenCalled();
    const calledUrl = (global.open as jest.Mock).mock.calls[0][0];
    expect(calledUrl).toContain("/hotel/amazing-hotel");
    expect(calledUrl).toContain("checkin=");
    expect(calledUrl).toContain("checkout=");
  });

  it("renders tooltip button and triggers navigation on click", async () => {
    const user = userEvent.setup();
    render(<DealCard {...defaultProps} />);

    const button = screen.getByRole("button", { name: /Move up right/i });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(global.open).toHaveBeenCalled();
  });
});
