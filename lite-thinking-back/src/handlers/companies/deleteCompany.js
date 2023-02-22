import commonMiddleware from '../../lib/commonMiddleware';
import {deleteCompany} from '../../services/companyService';

const response = async (event) => {
	const {id} = event.pathParameters;

	const deletedCompany = await deleteCompany(id);

	return {
		statusCode: 200,
		body: JSON.stringify(deletedCompany)
	};
};

export const handler = commonMiddleware(response);
