import commonMiddleware from '../../lib/commonMiddleware';
import {getCompanies} from '../../services/companyService';

const response = async (event, context) => {
	const companies = await getCompanies();

	return {
		statusCode: 200,
		body: JSON.stringify(companies)
	};
};

export const handler = commonMiddleware(response);
