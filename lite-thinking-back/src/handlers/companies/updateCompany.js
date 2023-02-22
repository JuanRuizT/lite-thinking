import commonMiddleware from '../../lib/commonMiddleware';
import {updateCompany} from '../../services/companyService';

const response = async (event) => {
	const {nit, name, address, phone} = event.body;

	const {id} = event.pathParameters;

	const company = {
		id,
		nit,
		name,
		address,
		phone
	};

	const updatedCompany = await updateCompany(id, company);

	return {
		statusCode: 201,
		body: JSON.stringify(updatedCompany)
	};
};

export const handler = commonMiddleware(response);
