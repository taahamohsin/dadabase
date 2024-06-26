import {BASE_URL, API_KEY} from '@env';

const headers = new Headers({
  'X-Api-Key': API_KEY,
});

export const api = {
  getRandomDadJoke: async (setIsLoading, setShowError) => {
    try {
      setIsLoading(true);
      const data = await fetch(`${BASE_URL}/dadjokes`, {
        headers,
        credentials: 'include',
      });
      const parsedResponse = await data.json();
      return parsedResponse;
    } catch (e) {
      setShowError(true);
      return [];
    } finally {
      setIsLoading(false);
    }
  },
};
