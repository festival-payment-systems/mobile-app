import type {Role} from "../types/common.ts";
import type {IEventMember} from "../types/Event.ts";

export function getRoleProps(role: Role): { color: "warning" | "error" | "success" | "default" | "primary" | "secondary" | "info" } {
  if (role === 'OWNER') return { color: 'error' }
  else if (role === 'ORGANIZER') return { color: 'primary' }
  else if (role === 'VENDOR') return { color: 'success' }
  else if (role === 'VENDOR_CASHIER') return { color: 'warning' }
  else if (role === 'EVENT_CASHIER') return { color: 'info' }
  else return { color: 'default' }
}


const sortedRoles: Role[] = ['OWNER', 'ORGANIZER', 'EVENT_CASHIER', 'VENDOR', 'VENDOR_CASHIER']

export function sortByRole(a: Role, b: Role) {
  return sortedRoles.indexOf(a) - sortedRoles.indexOf(b)
}


export function isCustomer(member: IEventMember) {
  if (member.roles.length === 0) return true
  return member.roles.includes('GUEST') && member.roles.length === 1
}