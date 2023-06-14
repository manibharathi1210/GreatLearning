const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = require('./models');
// const User = require('./models/User');
// const Course = require('./models/Course');
// const Enrollment = require('./models/Enrollment');
// const Skill = require('./models/Skill');
// const Quiz = require('./models/Quiz');


app.use(express.json());

app.listen(PORT, () => {
    // sequelize.sync() // This will sync all models with the database
    //     .then(() => {
    //         console.log('All models synced');
    //     })
    //     .catch(err => {
    //         console.error('Error syncing models:', err);
    //     });

  console.log(`Server is running on port ${PORT}`);
});

app.post('/get-matching-candidates', async (req, res) => {
    const {mandatorySkills, goodToHaveSkills} = req.body;
    try {
        const matchingCandidates = await sequelize.query(`
        select "Users".id, "Users"."firstName", "Users"."lastName", "Users".city, SUM("Quizzes".score) as score from "Users" 
				inner join 
					"Enrollments" on "Users".id = "Enrollments"."userId" 
				inner join 
					"Quizzes" on "Enrollments".id = "Quizzes"."enrollmentId" 
				inner join "Skills" on "Quizzes"."skillId" = "Skills".id
				where "Skills"."name" in (${mandatorySkills.map((skill) => {return `'${skill}'`}).join(',')})
                group by "Users".id having COUNT("Users".id) = ${mandatorySkills.length}
                order by SUM("Quizzes".score) desc
        `);
        const candidatesWithGoodToHaveSkills = await sequelize.query(`
        select "Users".id, "Users"."firstName", "Users"."lastName", "Users".city, SUM("Quizzes".score) as score from "Users" 
				inner join 
					"Enrollments" on "Users".id = "Enrollments"."userId" 
				inner join 
					"Quizzes" on "Enrollments".id = "Quizzes"."enrollmentId" 
				inner join "Skills" on "Quizzes"."skillId" = "Skills".id
				where "Skills"."name" in (${goodToHaveSkills.map((skill) => {return `'${skill}'`}).join(',')})
                group by "Users".id
                order by SUM("Quizzes".score) desc
        `);
        const goodToHaveSkillsScore = {};
        candidatesWithGoodToHaveSkills.forEach((candidate, index) => {
            goodToHaveSkillsScore[candidate.userId] = candidate.score;
        });
        for (let i=0; i<matchingCandidates.length; i++) {
            if (matchingCandidates[i].userId in goodToHaveSkillsScore) {
                matchingCandidates[i].goodToHaveSkillsScore = goodToHaveSkillsScore[matchingCandidates[i].userId];
            } else {
                matchingCandidates[i].goodToHaveSkillsScore = 0;
            }
        }
        matchingCandidates.sort((a, b) => {
            if (a.score === b.score) {
                return b.goodToHaveSkillsScore - a.goodToHaveSkillsScore;
            } else {
                return b.score - a.score;
            }
        });
        res.json(matchingCandidates);
    } catch (e) {
        console.error('Error fetching data:', e);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
  });
