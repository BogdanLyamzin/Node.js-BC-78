import {HttpError} from "http-errors";

const errorHandler = (error, req, res, next)=> {
  const {status = 500, message} = error;
  if(error instanceof HttpError) {
    return res.status(status).json({
      message,
    });
  }

  const isProd = process.env.NODE_ENV === "production";

  res.status(500).json({
    message: isProd ? "Something went wrong" : message,
  });
};

export default errorHandler;
