import * as Joi from '@hapi/joi'

export const configSchema = Joi.object({
    HOST: Joi.string().required(),
    PORT: Joi.number().required(),
    DB_USERNAME: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_NAME: Joi.string().required(),
    DATABASE_SYNCHRONIZE: Joi.boolean().required(),
    DATABASE_SCHEMA: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
})