import {deleteArticle} from '../../services/articleService';
import commonMiddleware from '../../lib/commonMiddleware';

const response = async (event) => {
	const {id} = event.pathParameters;

	const deletedArticle = await deleteArticle(id);

	return {
		statusCode: 200,
		body: JSON.stringify(deletedArticle)
	};
};

export const handler = commonMiddleware(response);
