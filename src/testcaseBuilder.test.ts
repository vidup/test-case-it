import { TestcaseBuilder } from "./TestcaseBuilder";

type Params = {
  name: string;
  age: number;
  uuid: string;
};

type Dependencies = {
  logger: {
    log: (message: string) => void;
  };
  emailer: {
    send: (message: string) => void;
  };
};

type Either<Error, Response> = {
  left: () => Error;
  isLeft: () => boolean;
  right: () => Response;
  isRight: () => boolean;
};

namespace Either {
  export const Left = <Error, Response>(
    error: Error
  ): Either<Error, Response> => ({
    left: () => error,
    isLeft: () => true,
    right: () => {
      throw new Error("Either is Left");
    },
    isRight: () => false,
  });

  export const Right = <Error, Response>(
    response: Response
  ): Either<Error, Response> => ({
    left: () => {
      throw new Error("Either is Right");
    },
    isLeft: () => false,
    right: () => response,
    isRight: () => true,
  });
}

type Result = Either<string, string>;

const usecase = async (
  params: Params,
  dependencies: Dependencies
): Promise<Result> => {
  const { name, age, uuid } = params;
  const { logger, emailer } = dependencies;

  if (!Number.isNaN(age) && age < 18) {
    return Either.Left("Too young");
  }

  logger.log("usecase called");
  emailer.send("usecase called");

  return Either.Right(`Hello ${name} with uuid ${uuid}`);
};

describe("Usecase test builder", () => {
  it("should execute usecase with valid params and dependencies", async () => {
    const result = await new TestcaseBuilder(
      usecase,
      { name: "John", age: 18, uuid: "123" },
      { logger: { log: jest.fn() }, emailer: { send: jest.fn() } }
    ).execute();

    expect(result.isRight()).toBe(true);
    expect(result.right()).toBe("Hello John with uuid 123");
  });

  it("should execute with valid params passed as with functions", async () => {
    const result = await new TestcaseBuilder(usecase)
      .withParams({ name: "John", age: 18, uuid: "123" })
      .withDependencies({
        logger: { log: jest.fn() },
        emailer: { send: jest.fn() },
      })
      .execute();

    expect(result.isRight()).toBe(true);
    expect(result.right()).toBe("Hello John with uuid 123");
  });

  it("should execute with partial params", async () => {
    const result = await new TestcaseBuilder(usecase)
      .withPartialParams({ age: 2 })
      .withDependencies({
        logger: { log: jest.fn() },
        emailer: { send: jest.fn() },
      })
      .execute();

    expect(result.isLeft()).toBe(true);
    expect(result.left()).toBe("Too young");
  });

  it("should execute with partial dependencies", async () => {
    const testcase = new TestcaseBuilder(usecase, {
      name: "John",
      age: 18,
      uuid: "123",
    }).withPartialDependencies({ logger: { log: jest.fn() } });

    expect(() => testcase.execute()).rejects.toThrow();
  });

  it("should execute with invalid params", async () => {
    const testcase = await new TestcaseBuilder(usecase)
      .withDependencies({
        logger: { log: jest.fn() },
        emailer: { send: jest.fn() },
      })
      .withInvalidParams({ age: [] })
      .execute();

    expect(testcase.isLeft()).toBe(true);
    expect(testcase.left()).toBe("Too young");
  });

  it("should execute with invalid dependencies", async () => {
    const testcase = await new TestcaseBuilder(usecase, {
      name: "John",
      age: 18,
      uuid: "123",
    }).withInvalidDependencies({ logger: { log: "not a function" } });

    expect(() => testcase.execute()).rejects.toThrow();
  });

  it("should allow to get currently set params", () => {
    const params = { name: "John", age: 18, uuid: "123" };
    const testcase = new TestcaseBuilder(usecase, params);

    expect(testcase.getParams()).toEqual(params);
  });

  it("should allow to get currently set dependencies", () => {
    const dependencies = {
      logger: { log: jest.fn() },
      emailer: { send: jest.fn() },
    };
    const testcase = new TestcaseBuilder(
      usecase,
      { name: "John", age: 18, uuid: "123" },
      dependencies
    );

    expect(testcase.getDependencies()).toEqual(dependencies);
  });
});
