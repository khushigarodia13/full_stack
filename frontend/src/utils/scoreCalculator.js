// Productivity Score Calculator
// Formula: (taskCompletionRate * 0.4 + resumeProgressRate * 0.3 + jobPrepRate * 0.3) * 100

export const calculateProductivityScore = (userData, userYear) => {
  const {
    dailyTaskCompletion = 0,
    resumeActions = 0,
    jobPrepProgress = 0
  } = userData;

  // Calculate individual rates (0-1 scale)
  const taskCompletionRate = Math.min(dailyTaskCompletion / 100, 1);
  const resumeProgressRate = Math.min(resumeActions / 10, 1); // Assuming 10 resume actions is 100%
  const jobPrepRate = Math.min(jobPrepProgress / 100, 1);

  // Year-specific weights
  const year = parseInt(userYear, 10);
  let score = 0;
  if (year === 1) {
    score = taskCompletionRate * 100;
  } else if (year === 2) {
    score = (taskCompletionRate * 0.7 + resumeProgressRate * 0.3) * 100;
  } else if (year >= 3) {
    score = (taskCompletionRate * 0.4 + resumeProgressRate * 0.3 + jobPrepRate * 0.3) * 100;
  } else {
    score = taskCompletionRate * 100;
  }

  return Math.round(score);
};

export const getScoreLevel = (score) => {
  if (score >= 90) return { level: 'Elite', color: 'text-purple-400', bg: 'bg-purple-900' };
  if (score >= 80) return { level: 'Excellent', color: 'text-green-400', bg: 'bg-green-900' };
  if (score >= 70) return { level: 'Good', color: 'text-blue-400', bg: 'bg-blue-900' };
  if (score >= 60) return { level: 'Average', color: 'text-yellow-400', bg: 'bg-yellow-900' };
  if (score >= 40) return { level: 'Needs Improvement', color: 'text-orange-400', bg: 'bg-orange-900' };
  return { level: 'Beginner', color: 'text-red-400', bg: 'bg-red-900' };
};

export const getScoreGroup = (score) => {
  if (score >= 80) return '80-100';
  if (score >= 70) return '70-79';
  if (score >= 60) return '60-69';
  if (score >= 40) return '40-59';
  return '0-39';
}; 