import 'dotenv/config';
import * as joi from 'joi';

/////validar datos con joi
const envVarsSchema = joi
  .object({
    PORT: joi.number().default(3002),
    HOST: joi.string().default(3002),
    DATABASE_URL: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),

    //PRODUCT_MS_HOST: joi.string().required(),
    //PRODUCT_MS_PORT: joi.number().required(),
  })
  .unknown(true);

const { error, value: envVars } = envVarsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

////valida variables de entorno
export const envs = {
  port: envVars.PORT,
  host: envVars.HOST,
  databaseUrl: envVars.DATABASE_URL,

  natsServers: envVars.NATS_SERVERS,
  //PRODUCT_MS_HOST: envVars.PRODUCT_MS_HOST,
  //PRODUCT_MS_PORT: envVars.PRODUCT_MS_PORT,
};
