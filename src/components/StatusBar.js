export default function StatusBar({ language }) {
  const position = "Ln 1, Col 1";
  
  // Handle various cases where language might not be a string
  let languageText = 'Unknown';
  if (typeof language === 'string') {
    languageText = language;
  } else if (typeof language === 'object' && language !== null) {
    // If language is an object, try to get a string representation
    languageText = language.toString();
  }
  
  return (
    <div className="status-bar">
      <div className="status-left">{position}</div>
      <div className="status-right">{languageText.toUpperCase()}</div>
    </div>
  );
}