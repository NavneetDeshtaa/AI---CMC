import { useNavigate } from "react-router-dom";
import type { SearchResponse } from "../../types/search";

interface SearchResultsProps {
  result: SearchResponse;
}

export default function SearchResults({ result }: SearchResultsProps) {
  const navigate = useNavigate();

  return (
    <div className="mt-6 space-y-6">
      <div className="border border-slate-200 rounded-lg p-5 bg-slate-50">
        <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">
          Answer
        </p>
        <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
          {result.answer}
        </p>
      </div>

      {result.sources.length > 0 && (
        <div>
          <p className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wide">
            Sources
          </p>
          <div className="space-y-2">
            {result.sources.map((source) => (
              <div
                key={source.contract_id}
                onClick={() => navigate(`/contracts/${source.contract_id}`)}
                className="flex items-center justify-between border border-slate-100 rounded-lg px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <span className="text-sm font-medium text-slate-800">
                  {source.file_name}
                </span>
                {source.similarity !== null && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                    {Math.round(source.similarity * 100)}% match
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}