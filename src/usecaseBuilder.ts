import { Usecase } from "./types";

export class UsecaseBuilder<Params, Dependencies, Result> {
  private params!: Params;
  private dependencies!: Dependencies;

  constructor(
    private usecase: Usecase<Params, Dependencies, Result>,
    params?: Params,
    dependencies?: Dependencies
  ) {
    if (params) this.params = params;
    if (dependencies) this.dependencies = dependencies;
  }

  withParams(params: Params): UsecaseBuilder<Params, Dependencies, Result> {
    return new UsecaseBuilder(this.usecase, params, this.dependencies);
  }

  withDependencies(
    dependencies: Dependencies
  ): UsecaseBuilder<Params, Dependencies, Result> {
    return new UsecaseBuilder(this.usecase, this.params, dependencies);
  }

  async execute(): Promise<Result> {
    return this.usecase(this.params, this.dependencies);
  }
}
