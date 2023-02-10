import { URL } from "../../src/utility";

interface FileUploadResponse {
  status: number;
  success: boolean;
  // other properties
}

describe("File Upload Form", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("Loading sucessfully / page", () => {
    // Check input and button to upload for journey file
    cy.get('input[name="journey"]').should("exist");
    cy.get('button[name="journey"]').should("exist");

    // Check input and button to upload for station file
    cy.get('input[name="station"]').should("exist");
    cy.get('button[name="station"]').should("exist");
  });

  it("uploads a journey file successfully", () => {
    cy.get('input[name="journey"]').should("exist");
    cy.get('input[name="journey"]').selectFile("csv/test/journey.csv");

    cy.get('button[name="journey"]').should("exist");
    cy.get('button[name="journey"]').click();

    cy.intercept(`${URL}/uploadJourney`).as("uploadJourney");

    cy.wait("@uploadJourney").then((xhr: any) => {
      expect(xhr.status).to.equal(200);
    });
  });

  // it("uploads a station file", () => {
  //   cy.visit("/");

  //   // Select station file
  //   cy.get('input[name="station"]').attachFile("station.csv");

  //   // Submit station file
  //   cy.get('button[type="submit"]').contains("Upload Station").click();

  //   // Check if the loading state is set to true
  //   cy.get("[data-testid='loading']").should("exist");
  // });

  // it("downloads the not valid data file", () => {
  //   cy.visit("/");

  //   // Upload a not valid journey file
  //   cy.get('input[name="journey"]').attachFile("journey-not-valid.csv");

  //   // Submit journey file
  //   cy.get('button[type="submit"]').contains("Upload Journey").click();

  //   // Check if the not valid data file is displayed
  //   cy.get("[data-testid='not-valid-file-name']").should("contain", "journey-not-valid.csv");

  //   // Download the not valid data file
  //   cy.get("[data-testid='download-button']").click();
  // });
});
