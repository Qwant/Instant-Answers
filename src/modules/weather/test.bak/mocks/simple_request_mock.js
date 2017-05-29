const requestStore = {};
const url = require('url');

module.exports = {
	/**
	 * A quick mock for simple request matching the pathname
	 * @param urlObject the urlString or the simple request option
	 * @param the returned value by matching url
	 * @returns a simple request mock
	 */
	mock : (urlObject, value) => {
		if(urlObject.url) {
			requestStore[urlObject.url] = value;
		} else {
			requestStore[urlObject] = value;
		}
		return function (request, callback) {
			let value;
			if(request.url) {
				let urlObject = url.parse(request.url);
				let pathName = urlObject.pathname;
				value = requestStore[pathName]
			} else {
				let urlObject = url.parse(request);
				let pathName = urlObject.pathname;
				value = requestStore[pathName]
			}
			callback(null, {body : JSON.stringify(value)})
		}
	}
};