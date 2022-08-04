import {useEffect, useState} from "react";
import BlueCandy from './images/blue-candy.png'
import GreenCandy from './images/green-candy.png'
import OrangeCandy from './images/orange-candy.png'
import PurpleCandy from './images/purple-candy.png'
import RedCandy from './images/red-candy.png'
import YellowCandy from './images/yellow-candy.png'
import Blank from './images/blank.png'
import ScoreBoard from "./components/ScoreBoard";

const width = 8
const candyColors = [
    BlueCandy,
    GreenCandy,
    OrangeCandy,
    PurpleCandy,
    RedCandy,
    YellowCandy
]

const App = () => {
  const [currentColorArray, setCurrentColorArray] = useState([])
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
  const [squareBeingDragged, setSquareBeingDragged] = useState(null)
  const [scoreDisplay, setScoreDisplay] = useState(0)

    const checkForColumnOfFour = () =>{
        for (let i = 0; i <= 39; i++){
            const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
            const decidedColor = currentColorArray[i]
            const isBlank = currentColorArray[i] === Blank

            if (columnOfFour.every(square => currentColorArray[square] === decidedColor) && !isBlank){
                setScoreDisplay((score) => score + 4)
                columnOfFour.forEach(square => currentColorArray[square] = Blank)
                return true
            }
        }
    }

  const checkForColumnOfThree = () =>{
      for (let i = 0; i <= 47; i++){
          const columnOfThree = [i, i + width, i + width * 2]
          const decidedColor = currentColorArray[i]
          const isBlank = currentColorArray[i] === Blank

          if (columnOfThree.every(square => currentColorArray[square] === decidedColor) && !isBlank){
              setScoreDisplay((score) => score + 3)
              columnOfThree.forEach(square => currentColorArray[square] = Blank)
              return true
          }
      }
  }

    const checkForRowOfThree = () =>{
        for (let i = 0; i < 64; i++){
            const rowOfThree = [i, i + 1, i + 2]
            const decidedColor = currentColorArray[i]
            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
            const isBlank = currentColorArray[i] === Blank

            if (notValid.includes(i)) continue

            if (rowOfThree.every(square => currentColorArray[square] === decidedColor) && !isBlank){
                setScoreDisplay((score) => score + 3)
                rowOfThree.forEach(square => currentColorArray[square] = Blank)
                return true
            }
        }
    }

    const checkForRowOfFour = () =>{
        for (let i = 0; i < 64; i++){
            const rowOfFour = [i, i + 1, i + 2, i + 3]
            const decidedColor = currentColorArray[i]
            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
            const isBlank = currentColorArray[i] === Blank

            if (notValid.includes(i)) continue

            if (rowOfFour.every(square => currentColorArray[square] === decidedColor) && !isBlank){
                setScoreDisplay((score) => score + 4)
                rowOfFour.forEach(square => currentColorArray[square] = Blank)
                return true
            }
        }

    }

    const moveIntoSquareBelow = () =>{
      for (let i = 0; i <= 55; i++){
          const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
          const isFirstRow = firstRow.includes(i)

          if (isFirstRow && currentColorArray[i] === Blank){
              let randomNumber = Math.floor(Math.random() * candyColors.length)
              currentColorArray[i] = candyColors[randomNumber]
          }

          if ((currentColorArray[i + width]) === Blank){
              currentColorArray[i + width] = currentColorArray[i]
              currentColorArray[i] = Blank
          }
      }
    }


  const createBoard = () =>{
      const randomColorArray = []
      for (let i = 0; i < width * width; i++){
          const randomNumberFrom0to5 = Math.floor(Math.random() * candyColors.length)
          const randomColor = candyColors[randomNumberFrom0to5]
          randomColorArray.push(randomColor)
      }
      setCurrentColorArray(randomColorArray)
  }

  const dragStart = (e) =>{
      console.log(e.target)
      console.log('drag start')
      setSquareBeingDragged(e.target)
  }

    const dragDrop = (e) =>{
        console.log(e.target)
        console.log('drag drop')
        setSquareBeingReplaced(e.target)
    }

    const dragEnd = () =>{
        console.log('drag end')
        const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
        const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))
        currentColorArray[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
        currentColorArray[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

        const validMoves = [
            squareBeingDraggedId - 1,
            squareBeingDraggedId - width,
            squareBeingDraggedId + 1,
            squareBeingDraggedId + width
        ]

        const validMove = validMoves.includes(squareBeingReplacedId)
        console.log(validMove)

        const isColumnOfFour = checkForColumnOfFour()
        const isRowOfFour = checkForRowOfFour()
        const isRowOfThree = checkForRowOfThree()
        const isColumnOfThree = checkForColumnOfThree()

        if (squareBeingReplacedId &&
            validMove &&
            (isRowOfThree || isRowOfFour || isColumnOfFour || isColumnOfThree)){
            setSquareBeingDragged(null)
            setSquareBeingReplaced(null)
        }else {
            currentColorArray[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
            currentColorArray[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
            setCurrentColorArray([...currentColorArray])
        }

    }

  useEffect(()=>{
      createBoard()
  },[])

  useEffect(()=>{
      const timer = setInterval(() =>{
          checkForColumnOfFour()
          checkForRowOfFour()
          checkForColumnOfThree()
          checkForRowOfThree()
          moveIntoSquareBelow()
          setCurrentColorArray([...currentColorArray])
      }, 100)

      return () => clearInterval(timer)

  }, [checkForColumnOfThree, checkForColumnOfFour, checkForRowOfFour, checkForRowOfThree, moveIntoSquareBelow, currentColorArray])

  return (
    <div className='app'>
        <div className="game">
            {
                currentColorArray.map((item, index)=>(
                    <img
                        key={index}
                        src={item}
                        alt={item}
                        draggable={true}
                        data-id={index}
                        onDragStart={dragStart}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.preventDefault()}
                        onDragLeave={(e) => e.preventDefault()}
                        onDrop={dragDrop}
                        onDragEnd={dragEnd}
                    />
                ))
            }
        </div>
        <ScoreBoard score={scoreDisplay}/>
    </div>
  );
}

export default App;
