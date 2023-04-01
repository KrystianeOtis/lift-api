const exercises = require('../controllers/exercises');

describe("Exercise retrieval tests", () => {
    test("Should get a single exercise", () => {
        let result = exercises.getSingle;
        expect(result).toBeTruthy();
    })

    test("Should get all exercises", () => {
        
    })
})