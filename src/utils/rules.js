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
  if (current.value === 0 && neighbors.length === 3) {
    return { value: 1, user: user }
  }
  if (current.value === 1 && (neighbors.length < 2 || neighbors.length > 3)) {
    return { value: 0, user: 0 }
  }
  if (current.value === 2 && (neighbors.length < 2 || neighbors.length > 3)) {
    return { value: 0, user: 0 }
  }
  if (current.value === 3 && (neighbors.length < 2 || neighbors.length > 3)) {
    return { value: 0, user: 0 }
  }
  return current
}
