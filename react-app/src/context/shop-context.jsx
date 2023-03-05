import React, { createContext } from 'react';
export const ShopContext = createContext(null)

export default function shopContextProvider() {
  return (
    <ShopContext.Provider>shop-context</ShopContext.Provider>
  )
}
