"use strict";
const { faker } = require("@faker-js/faker");

const mode = "basic";

module.exports = {
  up: (queryInterface, Sequelize) => {
    if (mode === "basic") {
      const seedReviews = () => {
        let reviews = [];
        const positiveArr = [
          "Awesome Game!",
          "My favorite Game of all time!",
          "Unbelievably Good!",
          "First!",
          "Best. Game. Ever!",
          "This is the best trailer I've ever seen!",
          "I wish more games were like this.",
          "They don't make games like these anymore",
          "What an awesome game",
          "Thank you!",
          "Agreed!",
          "This is the best trailer of all time! Hands down!",
          "I play this game all the time!",
          "I haven't played this game in awhile!",
          "I've never tried this game before, I'm going to now!",
        ];
        const negativeArr = [
          "Not that good of a game.",
          "This trailer is pretty bad, isn't it?",
          "I wish they had spent more money on making this trailer",
          "I don't like this game at all.",
          "This is a really bad game.",
          "This trailer should have been better.",
          "I wish this game had been better",
          "Major disappointment",
          "At least the other trailers are good!",
          "Let's watch a different trailer instead",
        ];
        for (let i = 1; i <= 20; i++) {
          let max = Math.floor(Math.random() * (40 - 20) + 20);
          for (let j = 1; j <= max; j++) {
            let userId = i;
            let score = Math.round(Math.random());
            let date = faker.date.recent();
            reviews.push({
              score,
              recommended: score === 1,
              userId,
              body:
                score === 1
                  ? positiveArr[Math.floor(Math.random() * 15)]
                  : negativeArr[Math.floor(Math.random() * 10)],
              videoId: Math.ceil(Math.random() * 55),
              createdAt: date,
              updatedAt: date,
            });
          }
        }
        return reviews;
      };
      let reviews = seedReviews();
      return queryInterface.bulkInsert("Reviews", reviews);
    } else {
      const genThisTime = 1000; // 10 or 100 or 1000
      const buildReview = () => {
        return {
            score : faker.datatype.number({min: 0, max: 1}),
            recommended : faker.datatype.boolean(),
            userId : faker.datatype.number({min: 1, max: 20}),
            videoId : 6,
            body : faker.lorem.lines(1),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
      };

      return queryInterface.bulkInsert("Reviews", [...Array(genThisTime)].map(buildReview));
    }
  
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Reviews", null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  },
};
