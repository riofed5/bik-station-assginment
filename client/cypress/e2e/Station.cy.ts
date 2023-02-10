import { URL } from "../../src/utility";
import { ResponseType } from "../../src/types";
describe("StationContainer component", () => {
  beforeEach(() => {
    cy.visit("/stations");
  });

  context("Loading /stations page", () => {
    it("renders the header with the title 'Station data'", () => {
      cy.contains("h1", "Station data");
    });

    it("renders a search input field with placeholder 'Name of Station. Ex: 'Han''", () => {
      cy.get(".input-search").should(
        "have.attr",
        "placeholder",
        "Name of Station. Ex: 'Han'"
      );
    });

    it("renders a 'Add new station' button", () => {
      cy.get("button").contains("Add new station");
    });

    it("renders a loading message while loading data", () => {
      cy.get("p").contains("Data is loading...").should("be.visible");
    });

    it("check has 2 columns Station name and Station ID", () => {
      cy.get("table")
        .find("tr")
        .find("th")
        .should("have.length", 2)
        .and("contain", "Station Name")
        .and("contain", "Station ID");
    });
  });

  context("Testing behavior with /stations page", () => {
    it("Check /searchStationByName api will be called if typing 'Han' in search input", () => {
      cy.intercept(`${URL}/searchStationByName?searchKey=Han`).as(
        "searchInput"
      );

      cy.get(".input-search")
        .type("Han")
        .then(() => {
          cy.wait("@searchInput").then(({ response }) => {
            const { statusCode } = response as ResponseType;
            expect(statusCode).to.equal(200);
          });
        });
    });

    it("Verify that the name of each station in the table is clickable", () => {
      cy.get("table tr:nth-child(2) td:first-child a").then(($a) => {
        const text = $a.text();

        cy.get("table tr:nth-child(2) td:first-child a")
          .should("be.visible")
          .click()
          .then(() => {
            cy.url().should("include", `/singleStation/${text}`);
          });
      });
    });
  });
});
