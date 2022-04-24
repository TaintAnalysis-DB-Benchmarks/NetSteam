const Sequelize = require("sequelize");

const express = require("express");

const asyncHandler = require("express-async-handler");

const {
  User,
  Video,
  Review,
  Genre,
  ProfilePicture
} = require("../../db/models");

const { performance } = require('perf_hooks');


const router = express.Router();
router.get("/video/:videoId", asyncHandler(async (req, res, next) => {
  console.log('==================== getReviewsForVideo // start ====================');
  const fnStart = performance.now();
  let reviews = await Review.findAll({
    where: {
      videoId: req.params.videoId
    },
    include: [{
      model: User,
      include: ProfilePicture
    }],
    order: [["createdAt", "DESC"]]
  });
  const review_counts_n4wo = await Review.findAll({
    where: {
      userId: reviews.map(data => data.dataValues.userId)
    },
    group: ["Review.userId"],
    attributes: ["userId", [Sequelize.fn("COUNT", Sequelize.col("Review.userId")), "aggregateCount"]]
  });
  let reviewCounts = await Promise.all(reviews.map(async review => {
    const review_counts_n4wo_tmp = review_counts_n4wo.find(x => x.userId === review.dataValues.userId);
    const total = review_counts_n4wo_tmp === undefined ? 0 : review_counts_n4wo_tmp.dataValues.aggregateCount;
    return await total;
  }));
  let reviewObj = await {};
  reviews = await reviews.map(async (review, i) => {
    review.dataValues["totalCount"] = reviewCounts[i];
    reviewObj[review.dataValues.id] = review.dataValues;
  });
  const fnEnd = performance.now();
  console.log('====================  getReviewsForVideo // end  ====================');
  console.log(fnEnd - fnStart);
  return await res.json({
    reviewObj
  });
}));
router.post("/video/:videoId", async (req, res) => {
  console.log('==================== postVideoReview // start ====================');
  const fnStart = performance.now();
  const videoId = req.params.videoId;
  const {
    recommend,
    score,
    commentText,
    userId
  } = req.body;
  const review = await Review.create({
    score,
    recommended: recommend,
    userId,
    body: commentText,
    videoId
  });

  if (review) {
    let reviews = await Review.findAll({
      where: {
        videoId
      },
      include: [{
        model: User,
        include: ProfilePicture
      }],
      order: [["createdAt", "DESC"]]
    });
    const review_counts_9thz = await Review.findAll({
      where: {
        userId: reviews.map(data => data.dataValues.userId)
      },
      group: ["Review.userId"],
      attributes: ["userId", [Sequelize.fn("COUNT", Sequelize.col("Review.userId")), "aggregateCount"]]
    });
    let reviewCounts = await Promise.all(reviews.map(async review => {
      const review_counts_9thz_tmp = review_counts_9thz.find(x => x.userId === review.dataValues.userId);
      const total = review_counts_9thz_tmp === undefined ? 0 : review_counts_9thz_tmp.dataValues.aggregateCount;
      return await total;
    }));
    let reviewObj = await {};
    reviews = await reviews.map(async (review, i) => {
      review.dataValues["totalCount"] = reviewCounts[i];
      reviewObj[review.dataValues.id] = review.dataValues;
    });
    const fnEnd = performance.now();
    console.log('====================  postVideoReview // end  ====================');
    console.log(fnEnd - fnStart);
    return await res.json({
      reviewObj
    });
  }
});
router.post("/:reviewId", asyncHandler(async (req, res, next) => {
  console.log('==================== postReview // start ====================');
  const fnStart = performance.now();
  const reviewId = req.params.reviewId;
  const {
    recommend,
    score,
    commentText,
    userId
  } = req.body;
  const review = await Review.findByPk(reviewId);
  if (userId !== review.userId) return;
  const videoId = review.videoId;
  review.score = score;
  review.recommended = recommend;
  review.body = commentText;
  await review.save();
  let reviews = await Review.findAll({
    where: {
      videoId
    },
    include: [{
      model: User,
      include: ProfilePicture
    }],
    order: [["createdAt", "DESC"]]
  });
  const review_counts_vz52 = await Review.findAll({
    where: {
      userId: reviews.map(data => data.dataValues.userId)
    },
    group: ["Review.userId"],
    attributes: ["userId", [Sequelize.fn("COUNT", Sequelize.col("Review.userId")), "aggregateCount"]]
  });
  let reviewCounts = await Promise.all(reviews.map(async review => {
    const review_counts_vz52_tmp = review_counts_vz52.find(x => x.userId === review.dataValues.userId);
    const total = review_counts_vz52_tmp === undefined ? 0 : review_counts_vz52_tmp.dataValues.aggregateCount;
    return await total;
  }));
  let reviewObj = await {};
  reviews = await reviews.map(async (review, i) => {
    review.dataValues["totalCount"] = reviewCounts[i];
    reviewObj[review.dataValues.id] = review.dataValues;
  });
  const fnEnd = performance.now();
  console.log('====================  postReview // end  ====================');
  console.log(fnEnd - fnStart);
  return await res.json({
    reviewObj
  });
}));
router.delete("/:reviewId", asyncHandler(async (req, res, next) => {
  console.log('==================== deleteReview // start ====================');
  const fnStart = performance.now();
  const reviewId = req.params.reviewId;
  const {
    userId
  } = req.body;
  const review = await Review.findByPk(reviewId);
  const videoId = review.videoId;
  if (userId !== review.userId) return;
  await review.destroy();
  let reviews = await Review.findAll({
    where: {
      videoId
    },
    include: [{
      model: User,
      include: ProfilePicture
    }],
    order: [["createdAt", "DESC"]]
  });
  const review_counts_1fg5 = await Review.findAll({
    where: {
      userId: reviews.map(data => data.dataValues.userId)
    },
    group: ["Review.userId"],
    attributes: ["userId", [Sequelize.fn("COUNT", Sequelize.col("Review.userId")), "aggregateCount"]]
  });
  let reviewCounts = await Promise.all(reviews.map(async review => {
    const review_counts_1fg5_tmp = review_counts_1fg5.find(x => x.userId === review.dataValues.userId);
    const total = review_counts_1fg5_tmp === undefined ? 0 : review_counts_1fg5_tmp.dataValues.aggregateCount;
    return await total;
  }));
  let reviewObj = await {};
  reviews = await reviews.map(async (review, i) => {
    review.dataValues["totalCount"] = reviewCounts[i];
    reviewObj[review.dataValues.id] = review.dataValues;
  });
  const fnEnd = performance.now();
  console.log('====================  deleteReview // end  ====================');
  console.log(fnEnd - fnStart);
  return await res.json({
    reviewObj,
    reviewId
  });
}));
module.exports = router;