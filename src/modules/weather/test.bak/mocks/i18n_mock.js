module.exports = {
	_ : (messageId) => {
		return messageId
	},
	_n : (messageId1, messageId2, arrite) => {
		return arrite == 1 ? messageId1 : messageId2
	}
}