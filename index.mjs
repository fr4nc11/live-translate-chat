@"
import Fastify from 'fastify';
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true });
await fastify.register(cors);

// endpoint-test: întoarce doar „Echo: …”
fastify.post('/translate', async (req, reply) => {
  const { text = '' } = req.body ?? {};
  return { translated: `Echo: ${text}` };
});

const port = process.env.PORT ?? 4000;
fastify.listen({ port, host: '0.0.0.0' })
  .catch(err => { fastify.log.error(err); process.exit(1); });
"@ | Set-Content index.mjs
