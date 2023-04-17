"use strict";

const { SSMClient, GetParametersCommand } = require("@aws-sdk/client-ssm"); // CommonJS import

const config = { region: process.env.AWS_DEFAULT_REGION };
const input = {
  Names: [process.env.DB_URL, process.env.DB_PASSWORD],
  WithDecryption: true,
};

const client = new SSMClient(config);
const command = new GetParametersCommand(input);

exports.handler = async (event) => {
  const response = await client.send(command);

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(response),
  };
};
