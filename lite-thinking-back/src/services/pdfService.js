import PDFKit from 'pdfkit-construct';
import {getArticlesByCompanyId} from './articleService';
import {getCompany} from './companyService';

export const generatePDF = async (companyId) => {
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

	doc.render();

	const buffers = [];

	await new Promise((resolve) => {
		doc.on('data', buffers.push.bind(buffers));
		doc.on('end', () => {
			resolve();
		});

		doc.end();
	});

	const pdf = Buffer.concat(buffers);
	return pdf;
};
