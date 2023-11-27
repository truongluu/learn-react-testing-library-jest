import { render, screen } from "@testing-library/react";
import HomeRoute from "./HomeRoute";

import { MemoryRouter } from "react-router-dom";
import { createServer } from "../test/server";

createServer([
  {
    path: "/api/repositories",
    res: (req, res, ctx) => {
      const query = req.url.searchParams.get("q");

      const language = query.split("language:")[1] ?? "";
      return {
        items: [
          { id: 1, full_name: `${language}_one` },
          { id: 2, full_name: `${language}_two` },
        ],
      };
    },
  },
]);

test("renders two links for each table", async () => {
  render(
    <MemoryRouter>
      <HomeRoute />
    </MemoryRouter>
  );

  //   await pause();
  //   screen.debug();

  // Loop over each language
  const languages = [
    "javascript",
    "typescript",
    "rust",
    "go",
    "python",
    "java",
  ];

  // For each language, make sure we see two links
  for (let language of languages) {
    const links = await screen.findAllByRole("link", {
      name: new RegExp(`${language}_`),
    });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent(`${language}_one`);
    expect(links[1]).toHaveTextContent(`${language}_two`);
    expect(links[0]).toHaveAttribute("href", `/repositories/${language}_one`);
    expect(links[1]).toHaveAttribute("href", `/repositories/${language}_two`);
  }
  // Assert that links have the appropritate full_name
});

const pause = () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, 100)
  );
};
