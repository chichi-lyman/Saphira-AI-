try {
  require('bullmq');
  console.log('bullmq OK');
} catch(e) { console.error(e); }
try {
  require('ioredis');
  console.log('ioredis OK');
} catch(e) { console.error(e); }
try {
  require('stripe');
  console.log('stripe OK');
} catch(e) { console.error(e); }
