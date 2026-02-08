import QuoteBuilder from "../components/QuoteBuilder.jsx";

export default function QuoteBuilderPage() {
  return (
    <main className="page">
      <header className="page__header">
        <div>
          <p className="page__eyebrow">Sales Quotes</p>
          <h1>Software Team Quote Builder</h1>
          <p className="page__subhead">
            Compare team structures by editing rates and hours in-line. Use onshore/offshore
            pricing to model blended delivery teams.
          </p>
        </div>
        <div className="page__badge">Draft</div>
      </header>
      <QuoteBuilder />
    </main>
  );
}
