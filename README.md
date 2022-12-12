# test-case-it

A simple, tiny library with no dependencies, to help me build test cases with use case functions that are in the following form

```ts
type Usecase<Params, Dependencies, Result> = (
  params: Params,
  dependencies: Dependencies
) => Promise<Result>;
```

As long as you respect this signature, the TestcaseBuilder class will automatically infer types and allow you to build test cases with full, partial or invalid parameters
and dependencies without forcing you to write any `@ts-ignore` or `@ts-expect-error`.

Testcase instances are immutable: each `withXXX` function returns a new instance of the Testcasebuilder class. This will allow you to start from a partially setup test case
(for example, in an early before hook), and make small, different adjustments for each test case.

```ts
// Simplistic usecase
function getUserEmail (params: { userUuid: string }, deps: { userService: AbstractUserService }) => Result<"not-found" | "invalid-params", { userEmail: string }> {
   if (params.userUuid == null) {
     return Err("invalid-params");
   }
   
   const { userUuid } = params;
   const userData = await userService.getData({ userUuid });
   
   if (!userData) return Err("not-found");
   
   return OK({ userEmail: userData.email });
}

// Now the tests
describe("Get use emails", () => {
  const testcase = new TestcaseBuilder(getUserEmail);
  
  test("it should return an error if uuid not provided", async () => {
    const result = await testCase.execute();
    expect(result.err).toEqual("invalid-params");
  });
  
  test("it should return an error if uuid is invalid", async () => {
    const result = await testCase
      .withInvalidParams({ uuid: null })
      .execute();
      
    expect(result.err).toEqual("invalid-params");
  });
  
  describe("Given valid parameters", () => {
    // note how we re-use the previous testcase, and will use this new one in each
    // of the following tests, with slight adjustment in the dependency behaviour
    // for each case.
    const validParamsTestcase = testcase
      .withParams({ userUuid: "azeaze-azaaz-ndsf-qdqqdsqsd" });
      
    test("it should return an error if the user is not found", async () => {
      const result = await validParamsTestcase
        .withDependencies({ userService: { getUserData: async () => null } })
        .execute();
        
      expect(result.err).toEqual("not-found");
    });
    
    test("it should return the email of the user if it is found", async () => {
      const result = await validParamsTestcase
        .withDependencies({ userService: { getUserData: async () => ({ email: "user@hellaw.com" }) } })
        .execute();
        
       expect(result.ok).toEqual("user@hellaw.com");
    });
  });
});
```
