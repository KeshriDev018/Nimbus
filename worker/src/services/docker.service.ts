//This file is the ONLY place that talks to Docker

import Docker from "dockerode";

const docker = new Docker({
  socketPath:
    process.platform === "win32"
      ? "//./pipe/docker_engine"
      : "/var/run/docker.sock",
});

export class DockerService {
  async runContainer(image: string, name: string) {
    const container = await docker.createContainer({
      Image: image,
      name: name,
      Tty: true,
    });

    await container.start();

    return {
      containerId: container.id,
      status: "running",
    };
  }

  async stopContainer(id: string) {
    const container = docker.getContainer(id);
    await container.stop();
    return { status: "stopped" };
  }

  async listContainers() {
    return await docker.listContainers({ all: true });
  }

  async restartContainer(id: string) {
    const container = docker.getContainer(id);

    await container.restart();

    return {
      containerId: id,
      status: "restarted",
    };
  }

  async removeContainer(id: string) {
    const container = docker.getContainer(id);

    await container.stop().catch(() => {});
    await container.remove({ force: true });

    return {
      containerId: id,
      status: "removed",
    };
  }

  async inspectContainer(id: string) {
    const container = docker.getContainer(id);

    const data = await container.inspect();

    return {
      id: data.Id,
      name: data.Name,
      state: data.State,
      image: data.Config.Image,
      startedAt: data.State.StartedAt,
    };
  }
}

export const dockerService = new DockerService();