/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  let answers = question.answers;
  for (const choice of answers) {
    choice.isRight = false;
  }
  question.answers = answers;
  return {
    id: question.id,
    type: question.type,
    question: question.question,
    point: question.pint,
    source: question.source,
    time: question.time,
    anwers: answers,
  };
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  let answer = [];
  for (const choice of question.answers) {
    if (choice.isRight) {
      answer.push(choice.answer);
    }
  }
  return answer;
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  let answer = [];
  for (const choice of question.answers) {
    answer.push(choice.answer);
  }
  return answer;
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return question.time;
};
