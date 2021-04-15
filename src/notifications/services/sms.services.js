const sendMessageToMobile = async ({ mobile, message }) => {
  console.log(`Sending "${message}" to "${mobile}".`);
};

const smsServices = { sendMessageToMobile };

module.exports = smsServices;
