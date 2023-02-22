import commonMiddleware from '../../lib/commonMiddleware';
import {getArticlesByCompanyId} from '../../services/articleService';

const response = async (event, context) => {
	const {companyId} = event.queryStringParameters;

	const articles = await getArticlesByCompanyId(companyId);

	return {
		statusCode: 200,
		body: JSON.stringify(articles)
	};
};

export const handler = commonMiddleware(response);
