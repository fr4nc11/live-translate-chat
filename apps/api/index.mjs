import Fastify from 'fastify';
import cors from '@fastify/cors';
import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import translatePkg from '@google-cloud/translate';
const { v2 } = translatePkg;

// 1. scriem cheia pe disc dacă vine din env
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  const credPath = path.join(tmpdir(), 'gcp-translate-key.json');
  await fs.writeFile(credPath, process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;
}

const fastify = Fastify({ logger: true });
await fastify.register(cors);

const translateClient = new v2.Translate();

fastify.post('/translate', async (req, reply) => { /* …same body… */ });

const port = Number(process.env.PORT) || 8080;
fastify.listen({ port, host: '0.0.0.0' }).catch(err => { fastify.log.error(err); process.exit(1); });
