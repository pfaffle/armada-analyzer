import { ChangeEventHandler, MouseEventHandler, useState } from "react";

type UploadStatus = "waiting" | "uploading" | "success" | "error";

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

  const handleSubmit: MouseEventHandler<HTMLInputElement> = (e) => {
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
  const handleFileSelect: ChangeEventHandler<HTMLInputElement> = (e) => {
    setStatus("waiting");
    setFile(e.currentTarget.files?.item(0) || undefined);
  };
  return (
    <form aria-label="Upload combat log" encType="multipart/form-data">
      <div className="segment">
        <label htmlFor="file">Select a combat log to analyze</label>
      </div>
      <div className="segment">
        <input
          role="button"
          type="file"
          id="file"
          accept="text/csv"
          onChange={handleFileSelect}
        />
        <input type="submit" onClick={handleSubmit} value="Upload" />
      </div>
      <div role="status" aria-label="Status">
        {statusToMessage(status)}
      </div>
    </form>
  );
};
