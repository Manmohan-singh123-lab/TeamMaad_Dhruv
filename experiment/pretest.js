/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the below code ////////////////////////

/////////////////////////////////////////////////////////////////////////////

(function() {
  function buildQuiz() {
    // we'll need a place to store the HTML output
    const output = [];

    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // we'll want to store the list of answer choices
      const answers = [];

      // and for each available answer...
      for (letter in currentQuestion.answers) {
        // ...add an HTML radio button
        answers.push(
          `<label>
            <input type="radio" name="question${questionNumber}" value="${letter}">
            ${letter} :
            ${currentQuestion.answers[letter]}
          </label>`
        );
      }

      // add this question and its answers to the output
      output.push(
        `<div class="question"> ${currentQuestion.question} </div>
        <div class="answers"> ${answers.join("")} </div>`
      );
    });

    // finally combine our output list into one string of HTML and put it on the page
    quizContainer.innerHTML = output.join("");
  }

  function showResults() {
    // gather answer containers from our quiz
    const answerContainers = quizContainer.querySelectorAll(".answers");

    // keep track of user's answers
    let numCorrect = 0;

    // for each question...
    myQuestions.forEach((currentQuestion, questionNumber) => {
      // find selected answer
      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      // if answer is correct
      if (userAnswer === currentQuestion.correctAnswer) {
        // add to the number of correct answers
        numCorrect++;

        // color the answers green
        //answerContainers[questionNumber].style.color = "lightgreen";
      } else {
        // if answer is wrong or blank
        // color the answers red
        answerContainers[questionNumber].style.color = "red";
      }
    });

    // show number of correct answers out of total
    resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
  }

  const quizContainer = document.getElementById("quiz");
  const resultsContainer = document.getElementById("results");
  const submitButton = document.getElementById("submit");
 

/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the above code ////////////////////////

/////////////////////////////////////////////////////////////////////////////






/////////////// Write the MCQ below in the exactly same described format ///////////////


  const myQuestions = [
    {
      question: "1. What is the main purpose of a pre-emphasis circuit in communication systems?",  ///// Write the question inside double quotes
      answers: {
        a: "To amplify low-frequency signals",                  ///// Write the option 1 inside double quotes
        b: "To suppress noise completely",                  ///// Write the option 2 inside double quotes
        c: "To boost high-frequency components before transmission",                  ///// Write the option 3 inside double quotes
        d: "To detect amplitude variations"                   ///// Write the option 4 inside double quotes
      },
      correctAnswer: "c"                ///// Write the correct option inside double quotes
    },

    {
     question: "2. What type of filter is typically used in a pre-emphasis circuit?",  ///// Write the question inside double quotes
      answers: {
        a: "Low-pass filter",                  ///// Write the option 1 inside double quotes
        b: "Band-stop filter",                  ///// Write the option 2 inside double quotes
        c: "High-pass filter",                  ///// Write the option 3 inside double quotes
        d: "Band-pass filter"                   ///// Write the option 4 inside double quotes
      },
      correctAnswer: "c"                ///// Write the correct option inside double quotes
    },     
    {
      question: "3. The de-emphasis circuit is used at which end of the communication system?",  ///// Write the question inside double quotes
       answers: {
         a: "Transmitter",                  ///// Write the option 1 inside double quotes
         b: "Receiver",                  ///// Write the option 2 inside double quotes
         c: "Both Transmitter and Receiver",                  ///// Write the option 3 inside double quotes
         d: "Ground"                   ///// Write the option 4 inside double quotes
       },
       correctAnswer: "b"                ///// Write the correct option inside double quotes
     }, 
     {
      question: "4. What is the result when a de-emphasis circuit is applied after a pre-emphasis circuit?",  ///// Write the question inside double quotes
       answers: {
         a: "Signal is distorted",                  ///// Write the option 1 inside double quotes
         b: "Noise increases",                  ///// Write the option 2 inside double quotes
         c: "Original signal is restored",                  ///// Write the option 3 inside double quotes
         d: "Frequency becomes zero"                   ///// Write the option 4 inside double quotes
       },
       correctAnswer: "c"                ///// Write the correct option inside double quotes
     },
     {
      question: "5. Which parameter is improved by using pre-emphasis and de-emphasis techniques?",  ///// Write the question inside double quotes
       answers: {
         a: "Bandwidth",                  ///// Write the option 1 inside double quotes
         b: "Power",                  ///// Write the option 2 inside double quotes
         c: "Signal-to-noise ratio (SNR)",                  ///// Write the option 3 inside double quotes
         d: "Phase"                   ///// Write the option 4 inside double quotes
       },
       correctAnswer: "c"                ///// Write the correct option inside double quotes
     }
     

     ///// To add more questions, copy the section below 
    									                  ///// this line


    /* To add more MCQ's, copy the below section, starting from open curly braces ( { )
        till closing curly braces comma ( }, )

        and paste it below the curly braces comma ( below correct answer }, ) of above 
        question

    Copy below section

    {
      question: "This is question n?",
      answers: {
        a: "Option 1",
        b: "Option 2",
        c: "Option 3",
        d: "Option 4"
      },
      correctAnswer: "c"
    },

    Copy above section

    */




  ];




/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the below code ////////////////////////

/////////////////////////////////////////////////////////////////////////////


  // display quiz right away
  buildQuiz();

  // on submit, show results
  submitButton.addEventListener("click", showResults);
})();


/////////////////////////////////////////////////////////////////////////////

/////////////////////// Do not modify the above code ////////////////////////

/////////////////////////////////////////////////////////////////////////////