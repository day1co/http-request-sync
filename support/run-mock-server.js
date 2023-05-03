const { startMockServer } = require('./server');

const mkcert = require('mkcert');
(async () => {
  // create a certificate authority
  const ca = await mkcert.createCA({
    organization: 'Hello CA',
    countryCode: 'NP',
    state: 'Bagmati',
    locality: 'Kathmandu',
    validityDays: 365,
  });
  // then create a tls certificate
  const cert = await mkcert.createCert({
    domains: ['127.0.0.1', 'localhost', '::1'],
    validityDays: 365,
    caKey: ca.key,
    caCert: ca.cert,
  });

  const options = {
    key: cert.key,
    cert: cert.cert,
  };

  startMockServer(options);
})();
