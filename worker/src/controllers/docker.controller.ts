import { Request, Response } from "express";
import { dockerService } from "../services/docker.service.js";



export const deployContainer = async (req: Request, res: Response) => {
  try {
    const { image, name } = req.body;

    if (!image || !name) {
      return res.status(400).json({
        success: false,
        message: "image and name are required",
      });
    }

    const result = await dockerService.runContainer(image, name);

    return res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const stopContainer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await dockerService.stopContainer(id as string);

    return res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const restartContainer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await dockerService.restartContainer(id as string);

    return res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const removeContainer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await dockerService.removeContainer(id as string);

    return res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const listContainers = async (req: Request, res: Response) => {
  try {
    const result = await dockerService.listContainers();

    return res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const inspectContainer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await dockerService.inspectContainer(id as string);

    return res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};