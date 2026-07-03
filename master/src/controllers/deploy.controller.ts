import { Request, Response } from "express";
import deploymentService from "../services/deployment.service.js";

export const deploy = async (req: Request, res: Response) => {
  try {
    const { image, name } = req.body;

    if (!image || !name) {
      return res.status(400).json({
        success: false,
        message: "image and name required",
      });
    }

    const result = await deploymentService.deploy(image, name);

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
