import {v4 as uuid} from 'uuid';
import commonMiddleware from '../../lib/commonMiddleware';
import {getCompany} from '../../services/companyService';
import {createArticle} from '../../services/articleService';

const response = async (event) => {
	const {companyId, code, name, amount} = event.body;

	await getCompany(companyId);

	const article = {
		id: uuid(),
		companyId,
		code,
		name,
		amount
	};

	const createdArticle = await createArticle(article);

	return {
		statusCode: 201,
		body: JSON.stringify(createdArticle)
	};
};

export const handler = commonMiddleware(response);
