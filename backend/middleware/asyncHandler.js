const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;

//we have function with req,res,next and  it
//it resolves a promise and calls next piece of middleware so in this way we dont need to have try catch so we can wrap it in all our codes.
