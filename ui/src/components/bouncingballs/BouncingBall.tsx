import { useEffect, useRef, useState } from 'react';
import { Ball } from '../../interfaces';
import '../../css/BouncingBall.css';
const MAX_BALLS = 10;
const MIN_GAP_FOR_NEW_BALL = 150;
const DAMPING_FACTOR = 0.99; // energy preserved

const initialBalls: Ball[] = [
  {
    id: 1,
    x: 50,
    y: 50,
    speedX: 1,
    speedY: 2,
  },
  {
    id: 2,
    x: 55,
    y: 55,
    speedX: 2,
    speedY: 1,
  },
];

export const BouncingBalls = () => {
  const [balls, setBalls] = useState<Ball[]>(initialBalls);
  const [ballCount, setBallCount] = useState<number>(initialBalls.length);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const boxRef = useRef<HTMLDivElement | null>(null);

  // method that tell if new ball is good - not merged with existing balls
  const isCurrentBallGood = (x: number, y: number): boolean => {
    return balls.every((ball) => {
      const dx = ball.x - x;
      const dy = ball.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance >= MIN_GAP_FOR_NEW_BALL;
    });
  };

  const updateBalls = () => {
    setBalls((prevBalls) => {
      const newBalls = prevBalls.map((ball) => {
        let newSpeedX = ball.speedX;
        let newSpeedY = ball.speedY;

        // Check for collisions with the horizontal borders
        if (
          ball.x + newSpeedX < 0 ||
          ball.x + newSpeedX > boxRef.current!.offsetWidth - 20
        ) {
          newSpeedX = -newSpeedX;
        }

        // Check for collisions with the vertical borders
        if (
          ball.y + newSpeedY < 0 ||
          ball.y + newSpeedY > boxRef.current!.offsetHeight - 20
        ) {
          newSpeedY = -newSpeedY;
        }

        return {
          ...ball,
          x: ball.x + newSpeedX,
          y: ball.y + newSpeedY,
          speedX: newSpeedX,
          speedY: newSpeedY,
        };
      });
      return newBalls;
    });
  };

  const checkCollisions = () => {
    setBalls((prevBalls) => {
      if (prevBalls.length >= MAX_BALLS) {
        return prevBalls;
      }
      let collisionOccurred = false;

      const newBalls = [...prevBalls];
      for (let i = 0; i < newBalls.length; ++i) {
        for (let j = i + 1; j < newBalls.length; ++j) {
          const dx = newBalls[j].x - newBalls[i].x;
          const dy = newBalls[j].y - newBalls[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 2 && !collisionOccurred) {
            collisionOccurred = true;
            // Generate a new ball at the point of collision
            const collisionX = (newBalls[i].x + newBalls[j].x) / 2;
            const collisionY = (newBalls[i].y + newBalls[j].y) / 2;
            const id = newBalls.length + 1;
            const speedX = 1 * DAMPING_FACTOR;
            const speedY = 1.5 * DAMPING_FACTOR;

            // check if new ball is too near to any balls

            if (
              newBalls.length < MAX_BALLS &&
              isCurrentBallGood(collisionX, collisionY)
            ) {
              newBalls.push({
                id,
                x: collisionX,
                y: collisionY,
                speedX,
                speedY,
              });
              setBallCount((prevCount) => prevCount + 1);

              // Reverse the directions of colliding balls
              newBalls[i].speedX *= -1;
              newBalls[i].speedY *= -1;
              newBalls[j].speedX *= -1;
              newBalls[j].speedY *= -1;
            }
            break;
          }
        }
        if (collisionOccurred) break;
      }

      return newBalls;
    });
  };

  const animationFrame = () => {
    if (isAnimating && ballCount < 30) {
      updateBalls();
      checkCollisions();
      requestAnimationFrame(animationFrame);
    } else if (ballCount >= 30) {
      // Reset animation after 30 balls
      setBalls(initialBalls);
      setBallCount(initialBalls.length);
    } else {
      setIsAnimating(false);
    }
  };

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(animationFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAnimating, ballCount]);

  return (
    <div ref={boxRef} id="box" className="box">
      {balls.map((ball) => (
        <div
          key={ball.id}
          className="ball"
          style={{ left: ball.x, top: ball.y }}
        ></div>
      ))}
    </div>
  );
};
