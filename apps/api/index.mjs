/* apps/api/index.mjs
   Back-end Live-Translate-Chat
   — Fastify v4  •  Google Cloud Translate v2
*/

import Fastify from 'fastify';
import cors from '@fastify/cors';

// 📦 @google-cloud/translate este CommonJS → import default-ul
import translatePkg from '@google-cloud/translate';
// extragem clasa Translate din pachet
const { v2 } = translatePkg;           // namespace v2
const translateClient = new v2.Translate();   // client autenticat via JSON env

const fastify = Fastify({ logger: true });
await fastify.register(cors);

/* POST /translate
   body: { text, src, tgt }
   return: { translated }
*/
fastify.post('/translate', async (req, reply) => {
  const { text = '', src = 'ro', tgt = 'en' } = req.body ?? {};

  try {
    const [result] = await translateClient.translate(text, { from: src, to: tgt });
    return { translated: result };
  } catch (err) {
    req.log.error(err);
    reply.code(500);
    return { error: 'translate_failed' };
  }
});

// ▶️  start server
const port = Number(process.env.PORT) || 8080;      // Railway injectează PORT
fastify
  .listen({ port, host: '0.0.0.0' })
  .catch(err => {
    fastify.log.error(err);
    process.exit(1);
  });
