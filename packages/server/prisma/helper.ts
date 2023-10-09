/**
 * Fisher–Yates shuffle to shuffle an array
 *
 * @Note Modifies the array in place
 */
export const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
};

/**
 * Return a subset (# of count) of elements of array
 */
export const getSome = (array: any[], count: number) => {
  shuffle(array);
  return array.slice(0, count);
};

/**
 * The minimum is inclusive maximum is EXCLUSIVE
 *
 * @returns a random integer between the two numbers provided
 */
export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Simulate rolling a loaded die. It is more likly to roll a smaller number!
 * @returns a random number between 0 and 6
 */
export const loadedDie = () => {
  const r = Math.random();

  // integer in the range 1 to 6 with desired probabilities
  if (r < 2.0 / 64.0) {
    return 6;
  } else if (r < 4.0 / 64.0) {
    return 5;
  } else if (r < 8.0 / 64.0) {
    return 4;
  } else if (r < 16.0 / 64.0) {
    return 3;
  } else if (r < 32.0 / 64.0) {
    return 2;
  } else {
    return 1;
  }
};

/**
 * Returns a random item from the array provided
 */
export const selectItemAtRandom = (items: any[]) => {
  return items[getRandomInt(0, items.length)];
};

/**
 * Returns a random date between the two dates provided
 *
 * @Note use the date constructor to create a date object when using this function
 */
export const randomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};
