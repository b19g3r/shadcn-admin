import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal(0),
  z.literal(1),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  z.literal('superadmin'),
  z.literal('admin'),
  z.literal('cashier'),
  z.literal('manager'),
])

const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  nickname: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  avatar: z.string(),
  status: userStatusSchema,
  createTime: z.coerce.date(),
  updateTime: z.coerce.date(),
  roles: z.array(z.string()).nullable(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
