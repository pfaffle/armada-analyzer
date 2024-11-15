import { describe, expect, it } from "vitest";
import { FileUploader } from "../FileUploader";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { mockServer } from "../mocks/node";
import { apiUrl } from "../mocks/utils";
import { renderWithTheme } from "@/__tests__/__utils__/utils";

// This is a janky way of finding the hidden input element which
// holds the files selected by the chakra ui file upload button.
// It assumes the id of the elements have the form:
// file::r1::trigger and file::r1::input
function findRelatedInput(e: HTMLElement): HTMLInputElement {
  return document.getElementById(
    `${e.id.split("::").slice(0, 2).join("::")}::input`,
  ) as HTMLInputElement;
}

describe("FileUploader", () => {
  it("renders correct content", () => {
    renderWithTheme(<FileUploader />);
    expect(
      screen.getByRole("form", { name: "Upload combat log" }),
    ).toHaveAttribute("enctype", "multipart/form-data");
    const fileUploadButton = screen.getByRole("button", {
      name: "Select a file",
    });
    expect(fileUploadButton).toHaveAttribute("type", "button");
    const input = findRelatedInput(fileUploadButton);
    expect(input).toHaveAttribute("type", "file");
    expect(input).toHaveAttribute("accept", "text/csv");
    expect(screen.getByRole("button", { name: "Upload" })).toHaveAttribute(
      "type",
      "submit",
    );
    expect(
      screen.getByRole("status", { name: "Status" }),
    ).toBeEmptyDOMElement();
  });

  it("displays success after uploading a valid file", async () => {
    const user = userEvent.setup();
    mockServer.use(
      ...[
        http.post(apiUrl("/armada/upload"), () =>
          HttpResponse.json({ status: "success" }),
        ),
      ],
    );

    renderWithTheme(<FileUploader />);
    const fakeFile = new File(["abcd"], "combat.csv", {
      type: "text/csv",
    });
    const fileInput: HTMLInputElement = screen.getByTestId("file-input");
    await user.upload(fileInput, fakeFile);
    expect(fileInput.files!.length).toBe(1);
    expect(fileInput.files![0]).toBe(fakeFile);
    await user.click(screen.getByRole("button", { name: "Upload" }));
    expect(screen.getByRole("status", { name: "Status" })).toHaveTextContent(
      "Upload successful!",
    );
  });

  it("displays error after uploading an invalid file", async () => {
    const user = userEvent.setup();
    mockServer.use(
      ...[
        http.post(apiUrl("/armada/upload"), () =>
          HttpResponse.json({ status: "error" }, { status: 400 }),
        ),
      ],
    );

    renderWithTheme(<FileUploader />);
    const fakeFile = new File(["abcd"], "combat.csv", {
      type: "text/csv",
    });
    const fileInput: HTMLInputElement = screen.getByTestId("file-input");
    await user.upload(fileInput, fakeFile);
    expect(fileInput.files!.length).toBe(1);
    expect(fileInput.files![0]).toBe(fakeFile);
    await user.click(screen.getByRole("button", { name: "Upload" }));
    expect(screen.getByRole("status", { name: "Status" })).toHaveTextContent(
      "Upload failed!",
    );
  });

  it("displays error after uploading a file to a broken backend", async () => {
    const user = userEvent.setup();
    mockServer.use(
      ...[http.post(apiUrl("/armada/upload"), () => HttpResponse.error())],
    );

    renderWithTheme(<FileUploader />);
    const fakeFile = new File(["abcd"], "combat.csv", {
      type: "text/csv",
    });
    const fileInput: HTMLInputElement = screen.getByTestId("file-input");
    await user.upload(fileInput, fakeFile);
    expect(fileInput.files!.length).toBe(1);
    expect(fileInput.files![0]).toBe(fakeFile);
    await user.click(screen.getByRole("button", { name: "Upload" }));
    expect(screen.getByRole("status", { name: "Status" })).toHaveTextContent(
      "Upload failed!",
    );
  });
});
