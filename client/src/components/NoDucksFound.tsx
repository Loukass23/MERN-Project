interface NoDucksFoundProps {
  hasFilters: boolean;
}

export function NoDucksFound({ hasFilters }: NoDucksFoundProps) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🦆</div>
      <h3 className="text-xl font-bold text-blue-800 mb-2">No ducks found!</h3>
      <p className="text-blue-600">
        {hasFilters ? "Try adjusting your filters" : "The pond is empty"}
      </p>
    </div>
  );
}
