export type Usecase<Params, Dependencies, Result> = (
  params: Params,
  dependencies: Dependencies
) => Promise<Result>;
