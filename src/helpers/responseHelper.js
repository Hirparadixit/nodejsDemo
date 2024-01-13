
/*--------------- | SUCCESS RESPONSE HELPER | ---------------*/
export const successResponse = (code, message, response) => {
  const data = {
    statusCode: code,
    status: true,
    message: message,
    response: response,
  };
  return data;
}


/*--------------- | ALERT RESPONSE HELPER | ---------------*/
export const alertResponse = (code, message, response) => {
  const data = {
    statusCode: code,
    status: false,
    message: message,
    response: response,
  };

  return data;
};

/*--------------- | ERROR RESPONSE HELPER | ---------------*/
export const errorResponse = (code, message, response) => {
  const data = {
    statusCode: code,
    status: false,
    message: message,
    response: response,
  };
  return data;
};
