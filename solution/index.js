module.exports = function (Homework) {
  function promisify(f) {
    return function (...args) {
      return new Promise((resolve) => {
        function callback(result) {
          resolve(result);
        }

        args.push(callback);
        f.call(this, ...args);
      });
    };
  }

  async function reduce(asyncArray, fn, initialValue, cb) {
    const getLength = promisify(asyncArray.length);
    const getItem = promisify(asyncArray.get);
    const getSum = promisify(add);
    const compare = promisify(less);
    const fnPromisse = promisify(fn);

    let result = initialValue;
    let i = 0;
    let check = true;
    const length = await getLength().then((res) => res);

    while (check) {
      const current = await getItem(i).then((res) => res);

      result = await fnPromisse(result, current, i, asyncArray).then(
        (res) => res
      );

      i = await getSum(i, 1).then((res) => res);
      check = await compare(i, length).then((res) => res);
    }

    return cb(result);
  }

  return (array, fn, initialValue, cb) => {
    reduce(array, fn, initialValue, cb);
  };
};
