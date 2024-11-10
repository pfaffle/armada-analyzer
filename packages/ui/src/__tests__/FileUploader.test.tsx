import { describe, expect, it } from "vitest";
import { FileUploader } from "../FileUploader";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { mockServer } from "../mocks/node";
import { apiUrl } from "../mocks/utils";

describe("FileUploader", () => {
  it("renders correct content", () => {
    render(<FileUploader />);
    expect(
      screen.getByRole("form", { name: "Upload combat log" }),
    ).toHaveAttribute("enctype", "multipart/form-data");
    const fileSelectButton = screen.getByRole("button", {
      name: "Select a combat log to analyze",
    });
    expect(fileSelectButton).toHaveAttribute("type", "file");
    expect(fileSelectButton).toHaveAttribute("accept", "text/csv");
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

    render(<FileUploader />);
    const fakeFile = new File(["abcd"], "combat.csv", {
      type: "text/csv",
    });
    const fileSelectButton: HTMLInputElement = screen.getByRole("button", {
      name: "Select a combat log to analyze",
    });
    await user.upload(fileSelectButton, fakeFile);
    expect(fileSelectButton.files!.length).toBe(1);
    expect(fileSelectButton.files![0]).toBe(fakeFile);
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

    render(<FileUploader />);
    const fakeFile = new File(["abcd"], "combat.csv", {
      type: "text/csv",
    });
    const fileSelectButton: HTMLInputElement = screen.getByRole("button", {
      name: "Select a combat log to analyze",
    });
    await user.upload(fileSelectButton, fakeFile);
    expect(fileSelectButton.files!.length).toBe(1);
    expect(fileSelectButton.files![0]).toBe(fakeFile);
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

    render(<FileUploader />);
    const fakeFile = new File(["abcd"], "combat.csv", {
      type: "text/csv",
    });
    const fileSelectButton: HTMLInputElement = screen.getByRole("button", {
      name: "Select a combat log to analyze",
    });
    await user.upload(fileSelectButton, fakeFile);
    expect(fileSelectButton.files!.length).toBe(1);
    expect(fileSelectButton.files![0]).toBe(fakeFile);
    await user.click(screen.getByRole("button", { name: "Upload" }));
    expect(screen.getByRole("status", { name: "Status" })).toHaveTextContent(
      "Upload failed!",
    );
  });
});
