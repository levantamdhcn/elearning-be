const twoSum = function (nums: number[], target: number) {
  if (nums == null || nums.length < 2) {
    return [0, 0];
  }
  const ret = [];
  const exist = {};
  for (let i = 0; i < nums.length; i++) {
    if (typeof exist[target - nums[i]] !== 'undefined') {
      ret.push(exist[target - nums[i]]);
      ret.push(i);
    }

    exist[nums[i]] = i;
  }

  return ret;
};

export default twoSum;
