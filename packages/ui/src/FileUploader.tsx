import { Button } from "@/components/ui/button";
import { CloseButton } from "@/components/ui/close-button";
import {
  FileInput,
  FileUploadClearTrigger,
  FileUploadRoot,
} from "@/components/ui/file-button";
import { InputGroup } from "@/components/ui/input-group";
import { FileUploadFileChangeDetails } from "@chakra-ui/react";
import { MouseEventHandler, useState } from "react";
import { LuFileUp } from "react-icons/lu";
import { chakra } from "@chakra-ui/react";

type UploadStatus = "waiting" | "uploading" | "success" | "error";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5mb
const Flexbox = chakra("div", { base: { display: "flex" } });

function statusToMessage(status: UploadStatus) {
  switch (status) {
    case "waiting":
      return "";
    case "uploading":
      return "Uploading...";
    case "success":
      return "Upload successful!";
    case "error":
      return "Upload failed!";
  }
}

export const FileUploader = () => {
  const [status, setStatus] = useState<UploadStatus>("waiting");
  const [file, setFile] = useState<File>();

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (file) {
      setStatus("uploading");
      const formData = new FormData();
      formData.set("file", file);
      fetch(new URL("/armada/upload", import.meta.env.VITE_API_URL), {
        method: "POST",
        body: formData,
      })
        .then((resp) => {
          if (resp.ok) {
            setStatus("success");
          } else {
            setStatus("error");
          }
        })
        .catch((err) => {
          console.error(err);
          setStatus("error");
        });
    }
  };
  const handleFileSelect = (details: FileUploadFileChangeDetails) => {
    setStatus("waiting");
    if (
      details.acceptedFiles.length === 0 &&
      details.rejectedFiles.length === 0
    ) {
      setFile(undefined);
    } else if (details.acceptedFiles.length > 0) {
      setFile(details.acceptedFiles[0]);
    }
    // TODO handle invalid file case
  };
  return (
    <form aria-label="Upload combat log" encType="multipart/form-data">
      <Flexbox
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <FileUploadRoot
          gap="1"
          maxWidth="300px"
          onFileChange={handleFileSelect}
          alignItems="center"
          name="file"
          accept={["text/csv"]}
          maxFileSize={MAX_FILE_SIZE}
          inputProps={
            {
              "data-testid": "file-input",
            } as React.InputHTMLAttributes<HTMLInputElement>
          }
        >
          <InputGroup
            w="full"
            startElement={<LuFileUp />}
            endElement={
              <FileUploadClearTrigger asChild>
                <CloseButton
                  me="-1"
                  size="xs"
                  variant="plain"
                  focusVisibleRing="inside"
                  pointerEvents="auto"
                  color="fg.subtle"
                  disabled={status === "uploading"}
                />
              </FileUploadClearTrigger>
            }
          >
            <FileInput
              css={{
                "& span": {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "inline-block",
                  width: "inherit",
                },
              }}
              placeholder="Select a file"
              disabled={status === "uploading"}
            />
          </InputGroup>
          <Button
            variant="outline"
            size="sm"
            type="submit"
            onClick={handleSubmit}
            loading={status === "uploading"}
          >
            Upload
          </Button>
        </FileUploadRoot>
      </Flexbox>
      <div role="status" aria-label="Status">
        {statusToMessage(status)}
      </div>
    </form>
  );
};
