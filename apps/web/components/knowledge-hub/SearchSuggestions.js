const [showSuggestions, setShowSuggestions] = useState(false);

<button
  onClick={() =>
    setShowSuggestions(!showSuggestions)
  }
>
  Suggestions ▼
</button>

{showSuggestions && (
  <SearchSuggestions />
)}