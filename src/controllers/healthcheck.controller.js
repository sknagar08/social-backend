import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const healthcheck = asyncHandler(async (_, res) => {
  const uptimeInSeconds = Math.floor(process.uptime());
  const hours = Math.floor(uptimeInSeconds / 3600);
  const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
  const seconds = uptimeInSeconds % 60;

  res.status(200).json(
    new ApiResponse(200, {
      status: "Ok",
      uptime: { hours, minutes, seconds },
      timestamp: new Date().toISOString(),
    })
  );
});
