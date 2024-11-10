import "./App.css";
import { FileUploader } from "./FileUploader";

export function App() {
  return (
    <>
      <h1>Armada Analyzer</h1>
      <p>
        by <a href="https://github.com/pfaffle">pfaffle</a>
      </p>
      <p aria-label="Intro" className="intro">
        Export your Star Trek Fleet Command combat logs and upload them here to
        get an analysis of how your ship and crew performed in battle!
      </p>
      <FileUploader />
      <div className="footer">
        <a href="http://github.com/pfaffle/armada-analyzer">Source</a>
      </div>
    </>
  );
}
