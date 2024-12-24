
function splitStringUsingRegex(inputstring) {
  const characters = [];
  const regex = /[\s\S]/gu;

  let match;
  while((match = regex.exec(inputstring)) != null)
  {
    characters.push(match[0]);
  }
  
  return characters;
}

export default splitStringUsingRegex;