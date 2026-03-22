import { describe, it, expect, vi } from "vitest";
import { createNavbar } from "../navbar";

describe("createNavbar", () => {
  const mockItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "about", label: "About", href: "/about" },
    { id: "contact", label: "Contact", disabled: true },
  ];

  it("returns expected default state and methods", () => {
    const navbar = createNavbar();
    expect(navbar.state.activeItem).toBe("home"); // Defaults to 'home' if no items provided
    expect(navbar.state.mobileMenuOpen).toBe(false);
    expect(navbar.actions).toBeDefined();
    expect(navbar.queries).toBeDefined();
  });

  it("can initialize with config", () => {
    const navbar = createNavbar({
      items: mockItems,
      defaultActiveItem: "about",
      mobileMenuOpen: true,
    });
    expect(navbar.state.activeItem).toBe("about");
    expect(navbar.state.mobileMenuOpen).toBe(true);
    expect(navbar.state.itemIds).toEqual(["home", "about", "contact"]);
  });

  it("can set active item", () => {
    const navbar = createNavbar({ items: mockItems });
    navbar.actions.setActiveItem("about");
    expect(navbar.state.activeItem).toBe("about");
    expect(navbar.queries.isActive("about")).toBe(true);
  });

  it("does not set active item if disabled", () => {
    const navbar = createNavbar({ items: mockItems });
    navbar.actions.setActiveItem("contact");
    expect(navbar.state.activeItem).toBe("home"); // Remains default
  });

  it("calls onActiveItemChange when active item changes", () => {
    const onActiveItemChange = vi.fn();
    const navbar = createNavbar({ items: mockItems, onActiveItemChange });
    navbar.actions.setActiveItem("about");
    expect(onActiveItemChange).toHaveBeenCalledWith("about");
  });

  it("can toggle mobile menu", () => {
    const navbar = createNavbar();
    navbar.actions.toggleMobileMenu();
    expect(navbar.state.mobileMenuOpen).toBe(true);
    navbar.actions.toggleMobileMenu();
    expect(navbar.state.mobileMenuOpen).toBe(false);
  });

  it("can set and close mobile menu", () => {
    const navbar = createNavbar();
    navbar.actions.setMobileMenuOpen(true);
    expect(navbar.state.mobileMenuOpen).toBe(true);
    navbar.actions.closeMobileMenu();
    expect(navbar.state.mobileMenuOpen).toBe(false);
  });

  it("calls onMobileMenuChange when mobile menu state changes", () => {
    const onMobileMenuChange = vi.fn();
    const navbar = createNavbar({ onMobileMenuChange });
    navbar.actions.setMobileMenuOpen(true);
    expect(onMobileMenuChange).toHaveBeenCalledWith(true);
  });

  it("can update items dynamically", () => {
    const navbar = createNavbar();
    navbar.actions.setItems(mockItems);
    expect(navbar.state.itemIds).toEqual(["home", "about", "contact"]);
  });

  it("updates active item from exact route", () => {
    const navbar = createNavbar({
      items: [
        { id: "home", label: "Home", href: "/" },
        { id: "docs", label: "Docs", href: "/docs" },
      ],
    });

    navbar.actions.updateActiveFromRoute("/docs");
    expect(navbar.state.activeItem).toBe("docs");
  });

  it("prefers the longest prefix route match", () => {
    const navbar = createNavbar({
      items: [
        { id: "home", label: "Home", href: "/" },
        { id: "docs", label: "Docs", href: "/docs" },
        { id: "guides", label: "Guides", href: "/docs/guides" },
      ],
    });

    navbar.actions.updateActiveFromRoute("/docs/guides/getting-started");
    expect(navbar.state.activeItem).toBe("guides");
  });

  it("supports exact route mode without prefix fallback", () => {
    const navbar = createNavbar({
      items: [
        { id: "home", label: "Home", href: "/" },
        { id: "docs", label: "Docs", href: "/docs" },
      ],
      routeMatchMode: "exact",
    });

    navbar.actions.updateActiveFromRoute("/docs/getting-started", "exact");
    expect(navbar.state.activeItem).toBe("home");
  });

  it("provides correct container and nav list props", () => {
    const navbar = createNavbar({ ariaLabel: "Site Nav" });

    const containerProps = navbar.getContainerProps();
    expect(containerProps.role).toBe("navigation");
    expect(containerProps["aria-label"]).toBe("Site Nav");

    const navListProps = navbar.getNavListProps();
    expect(navListProps.role).toBe("menubar");
    expect(navListProps["aria-label"]).toBe("Site Nav");
  });

  it("provides correct item props", () => {
    const navbar = createNavbar({
      items: mockItems,
      defaultActiveItem: "home",
    });

    const activeProps = navbar.getItemProps("home");
    expect(activeProps.role).toBe("menuitem");
    expect(activeProps["aria-current"]).toBe("page");
    expect(activeProps["aria-disabled"]).toBeUndefined();
    expect(activeProps["data-active"]).toBe(true);
    expect(activeProps["data-state"]).toBe("active");
    expect(activeProps.tabindex).toBe(0);

    const inactiveProps = navbar.getItemProps("about");
    expect(inactiveProps["aria-current"]).toBeUndefined();
    expect(inactiveProps["data-active"]).toBe(false);
    expect(inactiveProps["data-state"]).toBe("inactive");
    expect(inactiveProps.tabindex).toBe(-1);

    const disabledProps = navbar.getItemProps("contact");
    expect(disabledProps["aria-disabled"]).toBe(true);

    const optionsProps = navbar.getItemProps("home", {
      href: "/",
      target: "_blank",
    });
    expect(optionsProps.href).toBe("/");
    expect(optionsProps.target).toBe("_blank");
  });

  it("provides correct toggle props", () => {
    const navbar = createNavbar();
    let props = navbar.getToggleProps();
    expect(props["aria-expanded"]).toBe(false);
    expect(props["aria-label"]).toBe("Open navigation menu");
    expect(props["data-state"]).toBe("closed");

    navbar.actions.setMobileMenuOpen(true);
    props = navbar.getToggleProps();
    expect(props["aria-expanded"]).toBe(true);
    expect(props["aria-label"]).toBe("Close navigation menu");
    expect(props["data-state"]).toBe("open");
  });

  it("provides correct mobile menu props", () => {
    const navbar = createNavbar();
    let props = navbar.getMobileMenuProps();
    expect(props.role).toBe("menu");
    expect(props["data-state"]).toBe("closed");
    expect(props.hidden).toBe(true);

    navbar.actions.setMobileMenuOpen(true);
    props = navbar.getMobileMenuProps();
    expect(props["data-state"]).toBe("open");
    expect(props.hidden).toBe(false);
  });

  it("handles keyboard navigation correctly", () => {
    const navbar = createNavbar({
      items: mockItems,
      defaultActiveItem: "home",
    });
    const preventDefault = vi.fn();

    // Initial state: 'home' is active

    // ArrowRight -> 'about' (skips 'contact' if we were at 'about' and went right, but from 'home' it goes to 'about')
    navbar.handleItemKeyDown(
      { key: "ArrowRight", preventDefault } as any,
      "home",
    );
    expect(preventDefault).toHaveBeenCalled();
    // In actual implementation, state updates. Let's verify our action gets called.
    // The factory sets activeItem internally. Let's check state.
    expect(navbar.state.activeItem).toBe("about");

    // ArrowLeft from 'about' -> 'home'
    navbar.handleItemKeyDown(
      { key: "ArrowLeft", preventDefault } as any,
      "about",
    );
    expect(navbar.state.activeItem).toBe("home");

    // ArrowLeft from 'home' -> 'about' (wraps around, skipping disabled 'contact')
    navbar.handleItemKeyDown(
      { key: "ArrowLeft", preventDefault } as any,
      "home",
    );
    expect(navbar.state.activeItem).toBe("about");

    // ArrowRight from 'about' -> 'home' (wraps around, skipping disabled 'contact')
    navbar.handleItemKeyDown(
      { key: "ArrowRight", preventDefault } as any,
      "about",
    );
    expect(navbar.state.activeItem).toBe("home");

    // End -> 'about' (last enabled)
    navbar.handleItemKeyDown({ key: "End", preventDefault } as any, "home");
    expect(navbar.state.activeItem).toBe("about");

    // Home -> 'home' (first enabled)
    navbar.handleItemKeyDown({ key: "Home", preventDefault } as any, "about");
    expect(navbar.state.activeItem).toBe("home");
  });

  it("handles Enter, Space, Escape keys", () => {
    const navbar = createNavbar({ items: mockItems, mobileMenuOpen: true });
    const preventDefault = vi.fn();

    // Enter sets active and closes menu
    navbar.handleItemKeyDown({ key: "Enter", preventDefault } as any, "about");
    expect(preventDefault).toHaveBeenCalled();
    expect(navbar.state.activeItem).toBe("about");
    expect(navbar.state.mobileMenuOpen).toBe(false);

    // Space sets active and closes menu
    navbar.actions.setMobileMenuOpen(true);
    navbar.handleItemKeyDown({ key: " ", preventDefault } as any, "home");
    expect(navbar.state.activeItem).toBe("home");
    expect(navbar.state.mobileMenuOpen).toBe(false);

    // Escape closes menu
    navbar.actions.setMobileMenuOpen(true);
    navbar.handleItemKeyDown({ key: "Escape", preventDefault } as any, "home");
    expect(navbar.state.mobileMenuOpen).toBe(false);
  });
});
