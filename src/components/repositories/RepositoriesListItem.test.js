import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RepositoriesListItem from "./RepositoriesListItem";

// jest.mock("../tree/FileIcon", () => {
//   // Content of FileIcon.js
//   return () => {
//     return "File Icon component";
//   };
// });

function renderComponent() {
  const repository = {
    full_name: "facebook/react",
    language: "Javascript",
    description: "Description",
    owner: {
      login: "facebook",
    },
    name: "react",
    html_url: "https://github.com/facebook/react",
  };
  render(
    <MemoryRouter>
      <RepositoriesListItem repository={repository} />
    </MemoryRouter>
  );
  return {
    repository,
  };
}
test("shows the link to github homepage", async () => {
  const { repository } = renderComponent();
  await screen.findByRole("img", { name: "Javascript" });
  const link = screen.getByRole("link", { name: /github reponsitory/i });

  expect(link).toHaveAttribute("href", repository.html_url);
});

test("shows fileicon with an appropriate icon", async () => {
  renderComponent();

  const icon = await screen.findByRole("img", { name: "Javascript" });
  expect(icon).toHaveClass("js-icon");
});

test("shows a link to the code editor page", async () => {
  const { repository } = renderComponent();
  await screen.findByRole("img", { name: "Javascript" });

  const link = await screen.findByRole("link", {
    name: new RegExp(repository.owner.login),
  });
  expect(link).toHaveAttribute("href", `/repositories/${repository.full_name}`);
});

const pause = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
};
