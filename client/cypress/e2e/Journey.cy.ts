import { URL } from "../../src/utility";

describe("File Upload Form", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  context("Rendering", () => {
    it("Loading sucessfully / page", () => {
      // Check input and button to upload for journey file
      cy.get("h3").should("contain", "Select .csv file for journey:");

      cy.get('input[name="journey"]').should("exist");
      cy.get('button[name="journey"]').should("exist");

      // Check input and button to upload for station file
      cy.get("h3").should("contain", "Select .csv file for station:");

      cy.get('input[name="station"]').should("exist");
      cy.get('button[name="station"]').should("exist");
    });
  });

  context("Upload file", () => {
    it("no journey file select, alert pops up", () => {
      const stub = cy.stub();
      cy.on("window:alert", stub);

      cy.get('button[name="journey"]').should("exist");
      cy.get('button[name="journey"]')
        .click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith("No journey file!");
        });
    });

    it("no station file select, alert pops up", () => {
      const stub = cy.stub();
      cy.on("window:alert", stub);

      cy.get('button[name="station"]').should("exist");
      cy.get('button[name="station"]')
        .click()
        .then(() => {
          expect(stub.getCall(0)).to.be.calledWith("No station file!");
        });
    });

    it("uploads a journey file successfully", () => {
      cy.intercept(`${URL}/uploadJourney`).as("uploadJourney");

      cy.get('input[name="journey"]').should("exist");
      cy.get('input[name="journey"]').selectFile("csv/test/journey.csv");

      cy.get('button[name="journey"]').should("exist");
      cy.get('button[name="journey"]').click();

      cy.wait("@uploadJourney").then((xhr: any) => {
        const { statusCode, body } = xhr.response;
        expect(statusCode).to.equal(200);
        expect(body).to.have.property("message", "Sucessfully!");
      });
    });

    it("uploads a station file successfully", () => {
      cy.intercept(`${URL}/uploadStation`).as("uploadStation");

      cy.get('input[name="station"]').should("exist");
      cy.get('input[name="station"]').selectFile("csv/test/station.csv");

      cy.get('button[name="station"]').should("exist");
      cy.get('button[name="station"]').click();

      cy.wait("@uploadStation").then((xhr: any) => {
        const { statusCode, body } = xhr.response;
        expect(statusCode).to.equal(200);
        expect(body).to.have.property("message", "Sucessfully!");
      });
    });
  });
});
