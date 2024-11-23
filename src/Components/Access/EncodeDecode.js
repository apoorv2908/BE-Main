export const encodeId = (id) => {
    return btoa(id); // Base64 encode
  };
  
  export const decodeId = (encodedId) => {
    return atob(encodedId); // Base64 decode
};
  