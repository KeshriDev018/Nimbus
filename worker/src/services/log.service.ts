import Docker from "dockerode";
import axios from "axios";
import { config } from "../config/env.js";
import { PassThrough } from "stream";



const docker = new Docker();

export function streamContainerLogs(containerId: string) {
  const container = docker.getContainer(containerId);

  const logStream = new PassThrough();

  container.logs(
    {
      follow: true,
      stdout: true,
      stderr: true,
    },
    (err, stream) => {
      if (err || !stream) return;

      container.modem.demuxStream(stream, logStream, logStream);

      logStream.on("data", async (chunk: Buffer) => {
        const log = chunk.toString("utf-8");

        try {
          await axios.post(`${config.masterUrl}/api/logs/ingest`, {
            containerId,
            log,
          });
        } catch (e) {
          console.error("Log send failed");
        }
      });
    },
  );
}
