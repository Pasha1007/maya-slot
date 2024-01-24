export function backout(amount: number): (time: number) => number {
    return function (time) {
      const decrementTime = time - 1;
  
      return Math.pow(decrementTime, 2) * ((amount + 1) * decrementTime + amount) + 1;
    };
  }