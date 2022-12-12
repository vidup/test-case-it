import { UsecaseBuilder } from "./usecaseBuilder";

const getDataUseCase = jest.fn();

describe("UsecaseBuilder", () => {
  afterEach(() => {
    getDataUseCase.mockClear();
  });

  it("should call with nothing by default", async () => {
    const usecase = new UsecaseBuilder(getDataUseCase);
    usecase.execute();
    expect(getDataUseCase).toHaveBeenCalledWith(undefined, undefined);
  });

  it("should call with params", () => {
    const usecase = new UsecaseBuilder(getDataUseCase)
      .withParams({ id: 1 })
      .execute();
    expect(getDataUseCase).toHaveBeenCalledWith({ id: 1 }, undefined);
  });

  it("should call with dependencies", () => {
    const usecase = new UsecaseBuilder(getDataUseCase)
      .withDependencies({ data: "data" })
      .execute();
    expect(getDataUseCase).toHaveBeenCalledWith(undefined, { data: "data" });
  });

  it("should call with params and dependencies", () => {
    const usecase = new UsecaseBuilder(getDataUseCase)
      .withParams({ id: 1 })
      .withDependencies({ data: "data" })
      .execute();
    expect(getDataUseCase).toHaveBeenCalledWith({ id: 1 }, { data: "data" });
  });
});
