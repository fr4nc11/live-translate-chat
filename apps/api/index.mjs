import Fastify from 'fastify';
import cors from '@fastify/cors';

const fastify = Fastify({ logger: true });
await fastify.register(cors);

// TEMP: răspunde cu „Echo” (vom integra Google după ce rulează)
fastify.post('/translate', async (req, reply) => {
  const { text = '' } = req.body ?? {};
  return { translated: `Echo: ${text}` };
});

// pornește pe PORT pus de Railway
const port = process.env.PORT ?? 4000;
fastify.listen({ port, host: '0.0.0.0' }).catch(err => {
  fastify.log.error(err);
  process.exit(1);
});
