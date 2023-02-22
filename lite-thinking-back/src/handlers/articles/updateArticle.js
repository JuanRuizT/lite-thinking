import commonMiddleware from '../../lib/commonMiddleware';
import {updateArticle} from '../../services/articleService';

const response = async (event) => {
	const {companyId, code, name, amount} = event.body;
	const {id} = event.pathParameters;

	const article = {
		id,
		companyId,
		code,
		name,
		amount
	};

	const updatedArticle = await updateArticle(id, article);

	return {
		statusCode: 201,
		body: JSON.stringify(updatedArticle)
	};
};

export const handler = commonMiddleware(response);
