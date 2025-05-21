/* apps/api/index.mjs */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import translatePkg from '@google-cloud/translate';

const { v2 } = translatePkg;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  const credPath = path.join(tmpdir(), 'gcp-translate-key.json');
  await fs.writeFile(credPath, process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;
}

const fastify = Fastify({ logger: true });
await fastify.register(cors);

const translateClient = new v2.Translate();

fastify.post('/translate', async (req, reply) => {
  const { text = '', src = 'ro', tgt = 'en' } = req.body ?? {};
  try {
    const [result] = await translateClient.translate(text, { from: src, to: tgt });
    return reply.send({ translated: result });
  } catch (err) {
    req.log.error(err);
    return reply.code(500).send({ error: 'translate_failed' });
  }
});

const port = Number(process.env.PORT) || 8080;
fastify
  .listen({ port, host: '0.0.0.0' })
  .catch(err => {
    fastify.log.error(err);
    process.exit(1);
  });
