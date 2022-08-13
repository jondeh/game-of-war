import React from 'react'
import './App.css'
import styled from 'styled-components'
import { ruleMap } from './utils/rules'

const HEIGHT = 60
const WIDTH = 60
const SIZE = 15
const TIME = 100
let RULES = 'standard'

export const gridMap = {}

const createMap = () => {
  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < HEIGHT; j++) {
      gridMap[`${i}-${j}`] = 0
    }
  }
}
createMap()

function App () {
  const [intervalId, setIntervalId] = React.useState(null)
  const [timer, setTimer] = React.useState(0)
  const [grid, setGrid] = React.useState(gridMap)

  const handleClick = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
      return
    }
    setIntervalId(
      setInterval(() => {
        const updates = findUpdates()
        updates.forEach(update => {
          gridMap[update.location] = update.value
        })
        if (!updates.length) {
          clearInterval(intervalId)
          setIntervalId(null)
          return
        }
        setTimer(timer => timer + 1)
      }, TIME)
    )
  }

  const handleReset = () => {
    createMap()
    clearInterval(intervalId)
    setIntervalId(null)
    setTimer(0)
  }

  return (
    <div className='App'>
      <GridContainer>
        <Grid timer={timer} gridMap={grid} />
      </GridContainer>
      <StyledButtonBox>
        <StyledButton onClick={handleClick}>
          {intervalId ? 'Stop' : 'Start'}
        </StyledButton>
        <StyledButton onClick={handleReset}>Reset</StyledButton>
        <select onChange={e => (RULES = e.target.value)}>
          {Object.keys(ruleMap).map(rule => {
            return (
              <option key={rule} value={rule}>
                {rule}
              </option>
            )
          })}
        </select>
      </StyledButtonBox>
    </div>
  )
}
const MemoGrid = React.memo(Grid)

export default App

const GridContainer = styled.div`
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`

const StyledButton = styled.button`
  padding: 8px;
  font-size: 16px;
  width: 100px;
  font-weight: 500;
  margin: 5px 0px;
`

const StyledButtonBox = styled.div`
  position: fixed;
  top: 50%;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  padding: 10px;
`

function findUpdates () {
  const updates = []
  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < HEIGHT; j++) {
      const neighbors = getNeighbors(i, j)
      const current = gridMap[`${i}-${j}`]
      const next = getNextState(current, neighbors)
      if (next !== current) {
        updates.push({
          location: `${i}-${j}`,
          value: next
        })
      }
    }
  }
  return updates
}

function getNeighbors (i, j) {
  const neighbors = []
  for (let x = i - 1; x <= i + 1; x++) {
    for (let y = j - 1; y <= j + 1; y++) {
      if (x === i && y === j) continue
      const location = `${x}-${y}`
      if (gridMap[location]) {
        neighbors.push(location)
      }
    }
  }
  return neighbors
}

const getNextState = (current, neighbors) => ruleMap[RULES](current, neighbors)

export function Grid ({ timer, gridMap = {} }) {
  // const { current: thisGrid } = React.useRef(gridMap)
  // const [grid, setGrid] = React.useState(gridMap)
  const reloads = React.useRef(0)
  const [height, setHeight] = React.useState(HEIGHT)
  const [width, setWidth] = React.useState(WIDTH)

  const mappedGrid = Object.keys(gridMap).map(location => {
    return (
      <MemoSquare
        value={gridMap[location]}
        key={location}
        location={location}
        className='grid-cell'
      ></MemoSquare>
    )
  })

  return (
    <>
      <StyledGrid height={height} width={width} className='grid'>
        {mappedGrid}
      </StyledGrid>
      <span>{reloads.current++}</span>
    </>
  )
}

const Square = ({ location, value }) => {
  const ref = React.useRef(0)
  const [color, setColor] = React.useState()
  const makeAlive = location => {
    gridMap[location] = 1
    setColor(1)
  }

  React.useEffect(() => {
    if (ref.current < 2) return
    setColor(value)
  }, [value])

  const myCurrent = ref.current++
  return (
    <StyledSquare color={color} onClick={() => makeAlive(location)}>
      {/* {ref.current++} */}
    </StyledSquare>
  )
}

const MemoSquare = React.memo(Square)

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.width}, ${SIZE}px);
  grid-template-rows: repeat(${props => props.height}, ${SIZE}px);
  /* grid-gap: 2px; */
`

const borderMap = {
  0: '#dcdcdc',
  undefined: '#dcdcdc',
  false: '#dcdcdc',
  1: '#000',
  2: '#f00',
  3: '#0f0'
}

const backgroundMap = {
  0: '#fff',
  undefined: '#fff',
  false: '#fff',
  1: '#fff',
  2: '#f00',
  3: '#0ff'
}

const StyledSquare = styled.div`
  background-color: ${({ color }) => backgroundMap[color]};
  border: 1px solid ${({ color }) => borderMap[color]};
  border-radius: 50%;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`
