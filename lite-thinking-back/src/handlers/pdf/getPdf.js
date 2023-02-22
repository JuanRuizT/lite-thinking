import commonMiddleware from '../../lib/commonMiddleware';
import {generatePDF} from '../../services/pdfService';

const response = async (event) => {
	const {companyId} = event.queryStringParameters;

	const pdf = await generatePDF(companyId);

	const filename = `PDF${Date.now()}.pdf`;
	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment;filename=${filename}`
		},
		body: pdf.toString('base64'),
		isBase64Encoded: true
	};
};

export const handler = commonMiddleware(response);
