import NavigationBar from "./NavigationBar";

describe("<NavigationBar />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<NavigationBar />);
  });
});
