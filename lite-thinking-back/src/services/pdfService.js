import AWS from 'aws-sdk';
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

export const sendPdf = async (companyId, email) => {
	console.log('Send PDF Called');
	const pdfFile = await generatePDF(companyId);

	const ses = new AWS.SES();

	const params = {
		Destinations: [email],
		RawMessage: {
			Data: null
		}
	};

	const attachment = {
		filename: 'my_file.pdf',
		contentType: 'application/pdf',
		content: pdfFile
	};

	const boundary = `----${new Date().getTime()}`;
	const messageParts = [
		`From: juanruizt89@gmail.com\r\n`,
		`Subject: My PDF\r\n`,
		`MIME-Version: 1.0\r\n`,
		`Content-Type: multipart/mixed; boundary="${boundary}"\r\n`,
		`\r\n`,
		`--${boundary}\r\n`,
		`Content-Type: text/plain; charset=UTF-8\r\n`,
		`Content-Transfer-Encoding: 7bit\r\n`,
		`\r\n`,
		'Please see the attached PDF file\r\n',
		`\r\n`,
		`--${boundary}\r\n`,
		`Content-Type: ${attachment.contentType}; name="${attachment.filename}"\r\n`,
		`Content-Transfer-Encoding: base64\r\n`,
		`Content-Disposition: attachment; filename="${attachment.filename}"\r\n`,
		`\r\n`,
		attachment.content.toString('base64'),
		`\r\n`,
		`--${boundary}--\r\n`
	];
	const message = messageParts.join('');

	params.RawMessage.Data = message;

	const response = await ses.sendRawEmail(params).promise();
	return response;
};
