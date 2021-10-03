
const { getReports } = require('kruk');


function prependHttp(url, {https = true} = {}) {
	if (typeof url !== 'string') {
		throw new TypeError(`Expected \`url\` to be of type \`string\`, got \`${typeof url}\``);
	}

	url = url.trim();

	if (/^\.*\/|^(?!localhost)\w+?:/.test(url)) {
		return url;
	}

	return url.replace(/^(?!(?:\w+?:)?\/\/)/, https ? 'https://' : 'http://');
}



exports.handler = async (event) => {

const params = new URLSearchParams(event.body);
const urls = params.getAll('url').filter(item => !!item).map(url => prependHttp(url));

  const API_KEY = process.env.PSIKUS;

  
  const queryParams = {
    effectiveConnectionType: '',
    formFactor: 'PHONE',
    checkOrigin: true
  }
  
  const cruxData = await getReports(urls, API_KEY, queryParams);
  


  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cruxData),
  };

};










