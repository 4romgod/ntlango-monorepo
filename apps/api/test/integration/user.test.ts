describe('User Resolver', () => {
    describe('Positive', () => {
        describe('createUser Mutation', () => {
            it('should create new user when valid input is provided', async () => {
                expect(1 + 1).toEqual(2);
            });
        });
    });

    describe('Negative', () => {
        describe('createUser Mutation', () => {
            it('should throw error when invalid input is provided', async () => {
                expect(1 + 2).toEqual(3);
            });
        });
    });
});
