import './App.css';
import React, { useState, useEffect } from "react";
import paperImg from "./paper-emoji.png";
import scissorsImg from "./scissors-emoji.png"
import rockImg from "./rock-emoji.png"

const RockPaperScissors = () => {
  const [score, setScore] = useState(
    JSON.parse(localStorage.getItem("score")) || {
      wins: 0,
      losses: 0,
      ties: 0,
    }
  );
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [result, setResult] = useState("");
  const [playerMove, setPlayerMove] = useState("");
  const [computerMove, setComputerMove] = useState("");


  useEffect(() => {
    updateScoreElement();
    document.body.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("score", JSON.stringify(score));
    updateScoreElement();
  }, [score]);

  const handleKeyDown = (event) => {
    if (event.key === "r") {
      playGame("rock");
    } else if (event.key === "p") {
      playGame("paper");
    } else if (event.key === "s") {
      playGame("scissors");
    }
  };

  const autoPlay = () => {
    if (!isAutoPlaying) {
      setIntervalId(
        setInterval(() => {
          const playerMove = pickComputerMove();
          playGame(playerMove);
        }, 1000)
      );
      setIsAutoPlaying(true);
    } else {
      clearInterval(intervalId);
      setIsAutoPlaying(false);
    }
  };

  const playGame = (playerMove) => {
    setPlayerMove(playerMove);
    const computerMove = pickComputerMove();
    setComputerMove(computerMove);

    let result = "";

    if (playerMove === "scissors") {
      if (computerMove === "rock") {
        result = "You lose.";
      } else if (computerMove === "paper") {
        result = "You win.";
      } else if (computerMove === "scissors") {
        result = "Tie.";
      }
    } else if (playerMove === "paper") {
      if (computerMove === "rock") {
        result = "You win.";
      } else if (computerMove === "paper") {
        result = "Tie.";
      } else if (computerMove === "scissors") {
        result = "You lose.";
      }
    } else if (playerMove === "rock") {
      if (computerMove === "rock") {
        result = "Tie.";
      } else if (computerMove === "paper") {
        result = "You lose.";
      } else if (computerMove === "scissors") {
        result = "You win.";
      }
    }

    setResult(result);

    if (result === "You win.") {
      setScore((prevScore) => ({ ...prevScore, wins: prevScore.wins + 1 }));
    } else if (result === "You lose.") {
      setScore((prevScore) => ({ ...prevScore, losses: prevScore.losses + 1 }));
    } else if (result === "Tie.") {
      setScore((prevScore) => ({ ...prevScore, ties: prevScore.ties + 1 }));
    }
  };

  const updateScoreElement = () => { };

  const pickComputerMove = () => {
    const randomNumber = Math.random();

    let computerMove = "";

    if (randomNumber >= 0 && randomNumber < 1 / 3) {
      computerMove = "rock";
    } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
      computerMove = "paper";
    } else if (randomNumber >= 2 / 3 && randomNumber < 1) {
      computerMove = "scissors";
    }

    return computerMove;
  };

  return (
    <>
    <h1>Rock Paper Scissors</h1>
      <div className='move-button-list'>
        <MoveButton move="rock" onClick={() => playGame("rock")} />
        <MoveButton move="paper" onClick={() => playGame("paper")} />
        <MoveButton move="scissors" onClick={() => playGame("scissors")} />
      </div>
      <Result result={result} />
      <Moves playerMove={playerMove} computerMove={computerMove} />
      <Score score={score} />

      <ResetScoreButton
        onClick={() => {
          setScore({ wins: 0, losses: 0, ties: 0 });
          localStorage.removeItem("score");
          updateScoreElement();
        }}
      />

      <AutoPlayButton onClick={() => autoPlay()} />
    </>
  );
};

const MoveButton = ({ move, onClick }) => (
  <button className={`move-button js-${move}-button`} onClick={onClick}>
    <img src={move === 'rock' ? rockImg : move === 'paper' ? paperImg : scissorsImg} className="move-icon" />
  </button>
);

const Result = ({ result }) => <p className="js-result result">{result}</p>;

const Moves = ({ playerMove, computerMove }) => (
  <p className="js-moves">
    Your Move 
    <img src={playerMove === 'rock' ? rockImg : playerMove === 'paper' ? paperImg : scissorsImg} className="move-icon" />
     VS 
    <img src={computerMove === 'rock' ? rockImg : computerMove === 'paper' ? paperImg : scissorsImg} className="move-icon" />
    Computers Move
  </p>
);

const Score = ({ score }) => (
  <p className="js-score score">
    Wins: {score.wins}, Losses: {score.losses}, Ties: {score.ties}
  </p>
);

const ResetScoreButton = ({ onClick }) => (
  <button onClick={onClick} className="reset-score-button js-reset-score-button">
    Reset Score
  </button>
);

const AutoPlayButton = ({ onClick }) => (
  <button className="auto-play-button" onClick={onClick}>
    Auto Play
  </button>
);

export default RockPaperScissors;