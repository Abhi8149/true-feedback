import {z} from 'zod'

export const messagesSchema=z.object({
     content:z.string()
     .min(3,'atlest of 3 characters')
     .max(400,'Not more than 400 charactes')
})