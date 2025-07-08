export const idRegex     = /^(?=.*[a-z])[a-z0-9]{4,20}$/;
export const pwRegex     = /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*\d){1,})(?=(.*[!@#$%^&*()_+=-]){1,}).{8,20}$/;
export const nameRegex   = /^[가-힣a-zA-Z]{2,20}$/;
export const nickRegex   = /^[가-힣a-zA-Z0-9._]{2,20}$/;
export const emailRegex  = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;
export const phoneRegex  = /^\d{2,3}-\d{3,4}-\d{4}$/;     // ex: 010-1234-5678
export const ssnRegex    = /^\d{6}-\d{7}$/;               // ex: 123456-1234567
