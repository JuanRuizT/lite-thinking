import commonMiddleware from "../../lib/commonMiddleware";
import { getCompanyById } from "../../lib/getCompanyById";

const getCompany = async (event, context) => {
  const { id } = event.pathParameters;
  const company = await getCompanyById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(company),
  };
};

export const handler = commonMiddleware(getCompany);
