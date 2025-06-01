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
      question: "In the experiment, which circuit is responsible for attenuating the boosted high-frequency signals?",  ///// Write the question inside double quotes
      answers: {
        a: "Amplifier",                 ///// Write the option 1 inside double quotes
        b: "Pre-emphasis circuit",                  ///// Write the option 2 inside double quotes
        c: "Modulator",                  ///// Write the option 3 inside double quotes
        d: "De-emphasis circuit"                   ///// Write the option 4 inside double quotes
      },
      correctAnswer: "d"                ///// Write the correct option inside double quotes
    },

    {
      question: "If the RC values in pre-emphasis and de-emphasis circuits are not matched, what is likely to occur?",  ///// Write the question inside double quotes
      answers: {
        a: "Improved signal recovery",                  ///// Write the option 1 inside double quotes
        b: "No effect",                  ///// Write the option 2 inside double quotes
        c: "Signal distortion or mismatch",                  ///// Write the option 3 inside double quotes
        d: "Infinite gain"                   ///// Write the option 4 inside double quotes
      },
      correctAnswer: "c"                ///// Write the correct option inside double quotes
    },
    
    {
      question: "What does the oscilloscope typically show after pre-emphasis is applied?",  ///// Write the question inside double quotes
      answers: {
        a: "High frequencies reduced",                  ///// Write the option 1 inside double quotes
        b: "All frequencies attenuated",                  ///// Write the option 2 inside double quotes
        c: "High-frequency components amplified",                  ///// Write the option 3 inside double quotes
        d: "No change in waveform"                   ///// Write the option 4 inside double quotes
      },
      correctAnswer: "c"                ///// Write the correct option inside double quotes
    },
    
    {
      question: "Why is pre-emphasis especially important in FM communication?",  ///// Write the question inside double quotes
      answers: {
        a: "It reduces bandwidth",                  ///// Write the option 1 inside double quotes
        b: "It suppresses carrier frequency",                  ///// Write the option 2 inside double quotes
        c: "It increases the power of the signal",                  ///// Write the option 3 inside double quotes
        d: "It improves SNR for high frequency components"                   ///// Write the option 4 inside double quotes
      },
      correctAnswer: "d"                ///// Write the correct option inside double quotes
    },
    
    {
      question: "Which of the following components are typically used in a simple pre-emphasis or de-emphasis circuit?",  ///// Write the question inside double quotes
      answers: {
        a: "Resistors and diodes",                  ///// Write the option 1 inside double quotes
        b: "Capacitors and inductors",                  ///// Write the option 2 inside double quotes
        c: "Resistors and capacitors",                  ///// Write the option 3 inside double quotes
        d: "Transistors and relays"                   ///// Write the option 4 inside double quotes
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