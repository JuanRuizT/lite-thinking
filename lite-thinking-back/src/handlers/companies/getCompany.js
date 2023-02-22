import commonMiddleware from '../../lib/commonMiddleware';
import {getCompany} from '../../services/companyService';

const response = async (event) => {
	const {id} = event.pathParameters;
	const company = await getCompany(id);

	return {
		statusCode: 200,
		body: JSON.stringify(company)
	};
};

export const handler = commonMiddleware(response);
