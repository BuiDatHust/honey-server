export const getPhoneWithCountryCode = (phone: string, country_code: string): string =>
  `+(${country_code})${phone}`
