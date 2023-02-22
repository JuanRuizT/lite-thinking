import {backentApi} from './backendApi';

const endpoint = '/pdf';

export const downloadPDF = async (companyId) => {
	await backentApi
		.get(endpoint, {
			params: {
				companyId
			},
			responseType: 'arraybuffer',
			contentType: 'application/pdf'
		})
		.then((response) => {
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'pdf.pdf');
			document.body.appendChild(link);
			link.click();
		})
		.catch((error) => {
			console.log(error);
		});
};

export const sendPDF = async (companyId, email) => {
	const response = await backentApi
		.post(`${endpoint}/send`, null, {
			params: {
				companyId,
				email
			}
		})
		.catch((error) => {
			console.log(error);
		});
	return response;
};
