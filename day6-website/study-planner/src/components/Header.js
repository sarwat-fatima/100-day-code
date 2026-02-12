export default function Header({ dark, setDark }) {
  return (
    <header>
      <h1>📚 Study Planner</h1>
      <button onClick={() => setDark(!dark)}>
        {dark ? "Light" : "Dark"}
      </button>
    </header>
  );
}
