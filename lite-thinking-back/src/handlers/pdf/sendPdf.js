import commonMiddleware from '../../lib/commonMiddleware';
import {sendPdf} from '../../services/pdfService';

const response = async (event) => {
	const {companyId, email} = event.queryStringParameters;

	const res = await sendPdf(companyId, email);
	console.log(res);

	return {
		statusCode: 200,
		body: 'OK'
	};
};

export const handler = commonMiddleware(response);
