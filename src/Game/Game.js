import React from 'react'
import styled from 'styled-components'
import { ruleMap } from '../utils/rules'

const HEIGHT = 20
const WIDTH = 20
const SIZE = 15
const TIME = 100
let RULES = 'battle'
let USER = 1

export const gridMap = {}

const createMap = () => {
  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < HEIGHT; j++) {
      gridMap[`${i}-${j}`] = {
        value: 0,
        user: 0
      }
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
          grid[update.location] = {
            value: update.value,
            user: update.user
          }
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
        <select defaultValue={RULES} onChange={e => (RULES = e.target.value)}>
          {Object.keys(ruleMap).map(rule => {
            return (
              <option key={rule} value={rule}>
                {rule}
              </option>
            )
          })}
        </select>
        <select defaultValue={USER} onChange={e => (USER = e.target.value)}>
          <option value={1}>1</option>
          <option value={2}>2</option>
        </select>
      </StyledButtonBox>
    </div>
  )
}
const MemoGrid = React.memo(Grid)

export default App

function findUpdates () {
  const updates = []
  for (let i = 0; i < WIDTH; i++) {
    for (let j = 0; j < HEIGHT; j++) {
      const neighbors = getNeighbors(i, j)
      //   console.log('neighbors', neighbors)
      const current = gridMap[`${i}-${j}`]
      const next = getNextState(current, neighbors, USER)
      if (next.value !== current.value) {
        updates.push({
          location: `${i}-${j}`,
          value: next.value,
          user: next.user
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
      if (gridMap[location]?.value) {
        neighbors.push(gridMap[location].user)
      }
    }
  }
  return neighbors
}

const getNextState = (current, neighbors, user) =>
  ruleMap[RULES](current, neighbors, user)

export function Grid ({ timer, gridMap = {} }) {
  // const { current: thisGrid } = React.useRef(gridMap)
  // const [grid, setGrid] = React.useState(gridMap)
  const reloads = React.useRef(0)
  const [height, setHeight] = React.useState(HEIGHT)
  const [width, setWidth] = React.useState(WIDTH)

  const mappedGrid = Object.keys(gridMap).map(location => {
    return (
      <MemoSquare
        user={gridMap[location].user}
        value={gridMap[location].value}
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
    </>
  )
}

const Square = ({ location, value, user }) => {
  const ref = React.useRef(0)
  const [color, setColor] = React.useState(0)
  const makeAlive = location => {
    gridMap[location] = {
      value: 1,
      user: user
    }
    setColor({ value: 1, user: USER })
  }

  //   console.log(USER)
  React.useEffect(() => {
    if (ref.current < 2) return
    setColor({ value, user })
  }, [value, user])

  const myCurrent = ref.current++
  return (
    <StyledSquare
      user={color.user}
      value={color.value}
      onClick={() => makeAlive(location)}
    >
      {/* {ref.current++} */}
    </StyledSquare>
  )
}

const MemoSquare = React.memo(Square)

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

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.width}, ${SIZE}px);
  grid-template-rows: repeat(${props => props.height}, ${SIZE}px);
  /* grid-gap: 2px; */
`
const playerColorMap = {
  defaultFill: '#fff',
  defaultBorder: '#dcdcdc',

  playerOneBorder: 'darkblue',
  playerOneFill: 'blue',

  playerTwoBorder: 'darkred',
  playerTwoFill: 'red'
}

const {
  defaultFill,
  defaultBorder,
  playerOneBorder,
  playerOneFill,
  playerTwoBorder,
  playerTwoFill
} = playerColorMap

const borderMap = {
  undefined: {
    0: defaultBorder,
    undefined: defaultBorder,
    false: defaultBorder
  },
  0: {
    0: defaultBorder,
    undefined: defaultBorder,
    false: defaultBorder
  },
  1: {
    0: defaultBorder,
    undefined: defaultBorder,
    false: defaultBorder,
    1: playerOneBorder,
    2: '#f00',
    3: '#0f0'
  },
  2: {
    0: defaultBorder,
    undefined: defaultBorder,
    false: defaultBorder,
    1: playerTwoBorder,
    2: '#f00',
    3: '#0f0'
  }
}

const backgroundMap = {
  undefined: {
    0: defaultFill,
    undefined: defaultFill,
    false: defaultFill
  },
  0: {
    0: defaultFill,
    undefined: defaultFill,
    false: defaultFill
  },
  1: {
    0: defaultFill,
    undefined: defaultFill,
    false: defaultFill,
    1: playerOneFill,
    2: '#f00',
    3: '#0ff'
  },
  2: {
    0: defaultFill,
    undefined: defaultFill,
    false: defaultFill,
    1: playerTwoFill,
    2: '#f00',
    3: '#0ff'
  }
}

const StyledSquare = styled.div`
  background-color: ${({ value, user }) => backgroundMap[user]?.[value]};
  border: 1px solid ${({ value, user }) => borderMap[user]?.[value]};
  border-radius: 50%;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`
