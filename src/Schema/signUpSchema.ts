import {z} from 'zod'

export const Uservalidation=z.
    string()
    .min(3, { message: 'Username must be at least 3 characters long'})
    .max(20, { message: 'Username must be at most 20 characters long'})
    .regex(/^[a-zA-Z0-9]+$/, { message: 'Username must only'})


export const signUpSchmea=z.object({
    username: Uservalidation,
    email: z.string().email({ message: 'Invalid email address'}),
    password: z.string().min(8, { message: 'Password must be of at least 8 characters'})

})