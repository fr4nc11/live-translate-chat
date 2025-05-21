import Fastify from 'fastify';
import cors from '@fastify/cors';
import { v2 as Translate } from '@google-cloud/translate';

const fastify = Fastify({ logger: true });
await fastify.register(cors);

const translateClient = new Translate();

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

const port = Number(process.env.PORT) || 8080;
fastify.listen({ port, host: '0.0.0.0' }).catch(err => {
  fastify.log.error(err);
  process.exit(1);
});
