const fetch = require('node-fetch');
const OPENTDB_API_URL = `https://opentdb.com/api.php`;

const parseAnswerBool = string =>
  string.toLowerCase() === 'true' ? true : false;

const transformResponse = data => {
  if (!data && data.results && data.results.length) return [];

  return data.results.map(
    ({ category, difficulty, question, correct_answer }) => {
      return {
        category,
        difficulty,
        prompt: question,
        answer: parseAnswerBool(correct_answer),
      };
    }
  );
};

module.exports = {
  Query: {
    questions: async (_, args, context, info) => {
      const { category, limit = 10, difficulty } = args;
      const categoryParams = category ? `&category=${category}` : ``;
      const difficultyParams = difficulty ? `&difficulty=${difficulty}` : ``;
      const token = context.token ? `&token=${context.token}` : ``;

      const data = await fetch(
        `${OPENTDB_API_URL}?type=boolean&amount=${limit}${categoryParams}${difficultyParams}${token}`
      ).then(res => res.json());
      const response = transformResponse(data);
      return response;
    },
  },
};
