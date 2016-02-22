export const presence = (value) => {
  if (typeof value === "undefined" || (typeof value === "string" && !value)) {
    return "can't be blank";
  }
  return "";
};

export const confirmation = (value, values, field) => {
  const confirmVal = values[`${field}_confirmation`];
  if (value !== confirmVal) {
    return "must match confirmation";
  }
  return "";
};

const minLength = 6;
export const length = (value) => {
  if (typeof value === "string" && value.length < minLength) {
    return `must be at least ${minLength} characters`;
  }
  return "";
};
