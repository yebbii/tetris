import React, { memo, useEffect, useRef, useState } from 'react';
import { useBoard } from "./useBoard";
import '../index.css';
import tetrisMusic from './tetris.mp3';
import { SHAPES } from './shapeFactory';

const Board = () => {
    const [display, score, onKeyDown, resetGame, gameOver, level, paused, setPaused, startGame] = useBoard();
    const [musicLoaded, setMusicLoaded] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const eBoard = useRef();
    const audioRef = useRef();

    useEffect(focusBoard, []);
    useEffect(() => {
        if (musicLoaded && !paused) {
            playMusic();
        } else {
            stopMusic();
        }
    }, [musicLoaded, paused]);

    function focusBoard() {
        eBoard.current.focus();
    }

    function loadMusic() {
        setMusicLoaded(true);
    }

    function playMusic() {
        audioRef.current.play();
    }

    function stopMusic() {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }

    function handleGameStart() {
        startGame();
        loadMusic();
    }

    const togglePause = () => {
        setPaused(!paused);
        if (paused) {
            stopMusic();
        } else {
            playMusic();
        }
    };

    const GameOver = ({ resetGame }) => {
        useEffect(() => {
            stopMusic();
        }, []);

        return (
            <div className="game-over">
                <span>Game Over</span>
                <button onClick={resetGame}>Restart</button>
            </div>
        );
    };

    const InstructionsModal = () => {
        const closeModal = () => {
            setShowInstructions(false);
        };

        return (
            <div className={`modal ${showInstructions ? 'show' : ''}`}>
                <div className="modal-content">
                    <h2>게임방법</h2>
                    <p>테트리스는 블록의 행을 제거하여 가능한 많은 점수를 얻는 게임입니다.</p>
                    <p>10줄을 제거할 때마다 레벨이 1씩 오르며, 블록의 속도가 빨라집니다.</p>
                    <p>위쪽 방향키 : 블록의 모양이 바뀝니다.</p>
                    <p>아래쪽 방향키 : 블록이 빠르게 내려갑니다.</p>
                    <p>스페이스바 : 블록이 한번에 맨 아래로 내려갑니다.</p>
                    <p>'p' : 게임이 일시정지됩니다.</p>
                    <button onClick={closeModal}>닫기</button>
                </div>
            </div>
        );
    };

    return (
        <div className='container'>
            <div className="top">
                <div className="circle"></div>
                <div className="title">테트리스</div>
            </div>
            <div className='wrap'>
                <button onClick={() => setShowInstructions(true)} className="info-button"></button>
                <div className={'t-board'} tabIndex={0} onKeyDown={onKeyDown} ref={eBoard}>
                    <div className='t-score'>
                        <span className="t-score-label">SCORE :</span>
                        <span className="t-score-label">{score.toLocaleString()}</span>
                        <span className="t-score-label"> LEVEL : {level}</span>
                    </div>
                    {display.map((row, index) => <Row row={row} key={index} />)}
                    {gameOver ? (
                        <GameOver resetGame={resetGame} />
                    ) : (
                        'null'
                    )}
                    <div className='button'>
                        <button onClick={handleGameStart} className="start-button">START
                        </button>
                        <button onClick={togglePause} className="pause-button">
                            {paused ? 'RESUME' : 'PAUSE'}
                        </button>
                    </div>
                </div>
            </div>
            {showInstructions && <InstructionsModal />}
            <audio ref={audioRef} src={tetrisMusic} loop />
            <div class="button-cross">
                        <div class="horizontal-line"></div>
                        <div class="vertical-line"></div>
                    </div>
                    <div class="button-circle"></div>
        </div>
    );
};

const Row = memo(props => {
    return (
        <span className='t-row'>
            {props.row.map((cell, index) => <Cell cell={cell} key={index} />)}
        </span>
    );
});

const shapeColors = {
    0: 't-cell-0',
    1: 't-cell-1',
    2: 't-cell-2',
    3: 't-cell-3',
    4: 't-cell-4',
    5: 't-cell-5',
    6: 't-cell-6',
    7: 't-cell-7'
  };
  
const Cell = memo((props) => {
    const count = useRef(0);
    count.current++;
    const value = props.cell ? props.cell : 0;
    const colorClass = `t-cell ${shapeColors[value]}`;
    
    return <span className={colorClass}></span>;
});

export default memo(Board);