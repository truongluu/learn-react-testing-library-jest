import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SWRConfig } from "swr";
import { createServer } from "../../test/server";
import AuthButtons from "./AuthButtons";

async function renderComponent() {
  render(
    /* Reset cache*/
    <SWRConfig value={{ provider: () => new Map() }}>
      <MemoryRouter>
        <AuthButtons />
      </MemoryRouter>
    </SWRConfig>
  );
  return await screen.findAllByRole("link");
}

describe("when user is not signed in", () => {
  // createServer() -->  GET '/api/user' --> {user: null}
  createServer([
    {
      path: "/api/user",
      res: (req, res, ctx) => {
        return { user: null };
      },
    },
  ]);
  test("sign in and sign up are visible", async () => {
    await renderComponent();
    const signInButton = await screen.findByRole("link", { name: /sign in/i });
    const signUpButton = await screen.findByRole("link", { name: /sign up/i });
    expect(signInButton).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute("href", "/signin");
    expect(signUpButton).toHaveAttribute("href", "/signup");
  });

  test("sign out button is not visible", async () => {
    await renderComponent();
    const signOutButton = await screen.queryByRole("link", {
      name: /sign out/i,
    });
    expect(signOutButton).not.toBeInTheDocument();
  });
});

describe("when user is signed in", () => {
  // createServer() -->  GET '/api/user' --> {user: {id: 3, email: 'dev@gmail.com'}}
  createServer([
    {
      path: "/api/user",
      res: (req, res, ctx) => {
        return { user: { id: 1, email: "dev@gmail.com" } };
      },
    },
  ]);
  test("sign in and sign up are not visible", async () => {
    await renderComponent();
    const signInButton = screen.queryByRole("link", { name: /sign in/i });
    const signUpButton = screen.queryByRole("link", { name: /sign up/i });

    expect(signInButton).not.toBeInTheDocument();
    expect(signUpButton).not.toBeInTheDocument();
  });

  test("sign out button is visible", async () => {
    await renderComponent();
    const signOutButton = screen.queryByRole("link", { name: /sign out/i });
    expect(signOutButton).toBeInTheDocument();
  });
});
