import { render, screen } from "@testing-library/react";
import RepositoriesSummary from "./RepositoriesSummary";

test("displays information about the responsitory", () => {
  const repository = {
    language: "Javascript",
    stargazers_count: 4,
    open_issues: 1,
    forks: 30,
  };
  render(<RepositoriesSummary repository={repository} />);

  for (let key in repository) {
    const value = repository[key];
    const element = screen.getByText(new RegExp(value));
    expect(element).toBeInTheDocument();
  }
});
