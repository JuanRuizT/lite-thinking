import {v4 as uuid} from 'uuid';
import commonMiddleware from '../../lib/commonMiddleware';
import {createCompany} from '../../services/companyService';

const response = async (event) => {
	const {nit, name, address, phone} = event.body;

	const company = {
		id: uuid(),
		nit,
		name,
		address,
		phone
	};

	const createdCompany = await createCompany(company);

	return {
		statusCode: 201,
		body: JSON.stringify(createdCompany)
	};
};

export const handler = commonMiddleware(response);
