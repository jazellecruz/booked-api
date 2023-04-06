
const sanitizeDataType = (input) => {
  if (!input) return null;
  if (typeof input === "string") {
    return `"${input.toString()}"`;
  } else if (typeof input === "number") {
    return input;
  }
}

const formatFields = (tableName, query, joinFieldsWith) => {
  let fieldNames = Object.keys(query);
  let formattedField = [];

  if (fieldNames.length === 1) {
    formattedField = `${tableName}.${fieldNames[0]} = ${sanitizeDataType(query[fieldNames[0]])}`;
  } else {
    for(let i = 0; i < fieldNames.length; i++) {
      formattedField.push(`${tableName}.${fieldNames[i]} = ${sanitizeDataType(query[fieldNames[i]])}`);
    };

    formattedField = formattedField.join(joinFieldsWith);
  }

  return formattedField;
}

module.exports = {sanitizeDataType , formatFields}