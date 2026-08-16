import DraftGenerationForm from "../components/drafts/DraftGenerationForm";

export default function DraftGenerationPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="mb-1 text-xl font-semibold text-ink">New Contract Draft</h1>
      <p className="mb-6 text-sm text-ink-soft">
        Fill in the details below and let AI generate a complete first draft.
      </p>
      <DraftGenerationForm />
    </div>
  );
}