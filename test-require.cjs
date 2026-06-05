try {
  require('express-rate-limit');
  console.log('express-rate-limit OK');
} catch(e) {
  console.error(e);
}
try {
  require('helmet');
  console.log('helmet OK');
} catch(e) {
  console.error(e);
}
try {
  const claude = require('@google/genai');
  console.log('@google/genai', !!claude);
} catch(e) {
  console.error(e);
}
