exports.getAllProblems = (req, res) => {
  const problems = req.app.locals.problems;
  if (!problems.length) return res.status(404).json({ error: "No problems available" });
  res.json(problems);
};

exports.getProblemById = (req, res) => {
  const problem = req.app.locals.problems.find(p => p.id == req.params.id);
  if (!problem) return res.status(404).json({ error: "Problem not found" });
  res.json(problem);
};
