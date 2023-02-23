/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// at it's simplest, access control returns yes or no value

import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

export const permissions = {
  ...generatedPermissions,
};

// rule based functions
// rules can return boolean or a filter for crud operations
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) return false;
    // 1. can they manage products
    console.log('perms', permissions);
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. if not, do they own the product?
    return { user: { id: session.itemId } }; // where filter
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) return false;
    if (permissions.canManageProducts({ session })) {
      return true; // most probably admin user
    }
    return { status: 'AVAILABLE' };
  },
  canOrder({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) return false;
    // 1. can they manage products
    console.log('perms', permissions);
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. if not, do they own the product?
    return { user: { id: session.itemId } }; // where filter
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) return false;
    // 1. can they manage products
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. if not, do they own the order?
    return { order: { user: { id: session.itemId } } }; // where filter
  },
  canManageUsers({ session }: ListAccessArgs) {
    if (!isSignedIn({ session })) return false;
    // 1. can they manage products
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // 2. if not, do they own the product?
    return { id: session.itemId }; // where filter
  },
};
