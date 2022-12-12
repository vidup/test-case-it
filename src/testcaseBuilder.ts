import { Usecase } from "./types";

export class TestcaseBuilder<Params, Dependencies, Result> {
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

  withParams(params: Params): TestcaseBuilder<Params, Dependencies, Result> {
    return new TestcaseBuilder(this.usecase, params, this.dependencies);
  }

  withPartialParams(
    params: Partial<Params>
  ): TestcaseBuilder<Params, Dependencies, Result> {
    return new TestcaseBuilder(
      this.usecase,
      params as Params,
      this.dependencies
    );
  }

  withInvalidParams(
    params: Partial<Record<keyof Params, any>>
  ): TestcaseBuilder<Params, Dependencies, Result> {
    return new TestcaseBuilder(
      this.usecase,
      params as Params,
      this.dependencies
    );
  }

  withDependencies(
    dependencies: Dependencies
  ): TestcaseBuilder<Params, Dependencies, Result> {
    return new TestcaseBuilder(this.usecase, this.params, dependencies);
  }

  withPartialDependencies(
    dependencies: Partial<Dependencies>
  ): TestcaseBuilder<Params, Dependencies, Result> {
    return new TestcaseBuilder(
      this.usecase,
      this.params,
      dependencies as Dependencies
    );
  }

  withInvalidDependencies(
    dependencies: Partial<Record<keyof Dependencies, any>>
  ): TestcaseBuilder<Params, Dependencies, Result> {
    return new TestcaseBuilder(
      this.usecase,
      this.params,
      dependencies as Dependencies
    );
  }

  async execute(): Promise<Result> {
    return this.usecase(this.params, this.dependencies);
  }

  getParams(): Params {
    return this.params;
  }

  getDependencies(): Dependencies {
    return this.dependencies;
  }

  logParams() {
    console.log(this.params);
  }

  logDependencies() {
    console.log(this.dependencies);
  }
}
