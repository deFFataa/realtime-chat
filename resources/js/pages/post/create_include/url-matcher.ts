// url-matcher.ts
export const URL_MATCHER = (text: string) => {
  const urlRegex = /https?:\/\/[^\s]+/g; // Regex to match URLs
  const match = text.match(urlRegex);
  
  if (match) {
    const matchedText = match[0];
    const index = text.indexOf(matchedText); // The index of the match in the string
    const length = matchedText.length; // Length of the matched string
    const urlts = Date.now(); // Just use the current timestamp for the sake of this example

    // Return the LinkMatcherResult object with 'url' instead of 'href'
    return {
      type: 'link', // The type of node
      url: matchedText, // The URL to link (correct property name here)
      index, // Index of the match in the text
      length, // Length of the matched URL
      text: matchedText, // The matched URL text
      urlts, // Timestamp for when the link was found (you can adjust this as necessary)
    };
  }
  
  return null; // No match found
};
