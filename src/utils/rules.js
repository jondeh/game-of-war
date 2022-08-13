import { partition } from 'lodash'

export const ruleMap = {
  standard: (current, neighbors) => {
    if (current === 0 && neighbors.length === 3) {
      return 1
    }
    if (current === 1 && (neighbors.length < 2 || neighbors.length > 3)) {
      return 0
    }
    return current
  },

  enhanced: (current, neighbors) => {
    if (!current && neighbors.length === 3) {
      return 1
    }

    if (current && neighbors.length < 2) {
      return 0
    }

    if (current && neighbors.length > 3 && neighbors.length < 5) {
      return 0
    }
    if (current && neighbors.length === 5) {
      return 2
    }

    if (current && neighbors.length > 5 && neighbors.length < 8) {
      return 0
    }

    if (current && neighbors.length === 8) {
      return 3
    }

    return current
  },

  aggressiveStandard: (current, neighbors) => {
    if (current === 0 && neighbors.length === 3) {
      return 1
    }
    if (current === 1 && (neighbors.length < 2 || neighbors.length > 3)) {
      return 0
    }
    if (current === 2 && (neighbors.length < 2 || neighbors.length > 3)) {
      return 0
    }
    if (current === 3 && (neighbors.length < 2 || neighbors.length > 3)) {
      return 0
    }
    return current
  },

  battle: (current, neighbors, user) => battle(current, neighbors, user)
}

const battle = (current, neighbors, user) => {
  const playerOne = neighbors.filter(n => n === +1).length
  const playerTwo = neighbors.filter(n => n === +2).length

  if (![2, 3].includes(playerOne) && ![2, 3].includes(playerTwo)) {
    return { value: 0, user: 0 }
  }

  if (current.value === 0) {
    if (playerOne === 3 && playerOne > playerTwo) {
      return { value: 1, user: 1 }
    } else if (playerTwo === 3 && playerTwo > playerOne) {
      return { value: 1, user: 2 }
    } else {
      return { value: 0, user: 0 }
    }
  }

  if (current.value === 1) {
    if ([2, 3].includes(playerOne) && playerOne > playerTwo) {
      return { value: 1, user: 1 }
    }
    if ([2, 3].includes(playerTwo) && playerTwo > playerOne) {
      return { value: 1, user: 2 }
    }

    if (playerOne === 3 && playerOne === playerTwo) {
      return { value: 0, user: 0 }
    }
  }

  return current
}
