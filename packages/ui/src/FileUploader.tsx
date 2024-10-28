import { MouseEventHandler, useState } from "react";

export const FileUploader = () => {
  const [fileName, setFileName] = useState<string>();
  const handleSubmit: MouseEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    if (fileName) {
      const formData = new FormData();
      formData.set("file", fileName);
      console.log("submitting", fileName);
      fetch("http://localhost:3000/armada/upload", {
        method: "POST",
        body: formData,
      })
        .then(() => {
          console.log("submit successful!");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  return (
    <form encType="multipart/form-data">
      <div>
        <label htmlFor="file">Select a combat log to upload</label>
      </div>
      <input
        type="file"
        id="file"
        accept="text/csv"
        onChange={(e) => setFileName(e.currentTarget.value)}
      ></input>
      <input type="submit" onClick={handleSubmit}></input>
    </form>
  );
};
