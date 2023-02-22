import PDFKit from 'pdfkit-construct';
import commonMiddleware from '../../lib/commonMiddleware';
import {getArticlesByCompanyId} from '../../services/articleService';
import {getCompany} from '../../services/companyService';

const response = async (event) => {
	const {companyId} = event.queryStringParameters;
	const articles = await getArticlesByCompanyId(companyId);
	const company = await getCompany(companyId);

	const doc = new PDFKit();

	doc.setDocumentHeader({height: '16'}, () => {
		doc.fontSize(15).text(`Inventory of Company ${company.name}`, {width: 420, align: 'center'});
	});

	doc.addTable(
		[
			{key: 'code', label: 'Code', align: 'left'},
			{key: 'name', label: 'Name', align: 'left'},
			{key: 'amount', label: 'Amount', align: 'left'}
		],
		articles,
		{
			border: null,
			width: 'fill_body',
			striped: true,
			stripedColors: ['#f6f6f6', '#d6c4dd'],
			cellsPadding: 10,
			marginLeft: 45,
			marginRight: 45,
			headAlign: 'center'
		}
	);

	// render tables
	doc.render();

	const buffers = [];

	await new Promise<void>((resolve) => {
		doc.on('data', buffers.push.bind(buffers));
		doc.on('end', () => {
			resolve();
		});

		doc.end();
	});

	const pdf = Buffer.concat(buffers);

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
