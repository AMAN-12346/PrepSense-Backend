function mapKnowledgeLevel(answer) {
  const mapping = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };
  return mapping[answer] || 'Beginner';
}

function mapStudyTime(answer) {
  const mapping = {
    '1hour': '1 hour',
    '3hours': '3 hours',
    '5hours': '5 hours',
    flexible: 'Flexible',
  };
  return mapping[answer] || 'Not decided';
}

function mapPreferredTime(answer) {
  const mapping = {
    morning: 'Morning',
    day: 'Afternoon',
    evening: 'Evening',
    night: 'Night',
  };
  return mapping[answer] || 'Flexible';
}

function mapStressLevel(answer) {
  const mapping = {
    low: 3,
    medium: 5,
    high: 7,
    need_help: 9,
  };
  return mapping[answer] || 5;
}

function mapWeaknessArea(answer) {
  const mapping = {
    math: 'Mathematics',
    english: 'English',
    gk: 'General Knowledge',
    current_affairs: 'General Knowledge',
  };
  return mapping[answer] || 'None';
}

// Helper mapping functions for User schema (matching your User schema enums)
function mapKnowledgeLevelForUser(answer) {
  const mapping = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };
  return mapping[answer] || 'Beginner';
}

function mapStudyTimeForUser(answer) {
  const mapping = {
    '1hour': '1 hour',
    '3hours': '3 hours',
    '5hours': '5 hours',
    flexible: 'Flexible',
  };
  return mapping[answer] || 'Flexible';
}

function mapPreferredTimeForUser(answer) {
  const mapping = {
    morning: 'Morning',
    day: 'Afternoon',
    evening: 'Evening',
    night: 'Night',
  };
  return mapping[answer] || 'Morning';
}

function mapWeaknessAreaForUser(answer) {
  const mapping = {
    math: 'Mathematics',
    english: 'English',
    gk: 'General Knowledge',
    current_affairs: 'Reasoning',
  };
  return mapping[answer] || 'None';
}

function generatePersonalizedPlan(assessment) {
  const plan = [];
  const studyTime = assessment.studyHabits.dailyStudyTime;
  const knowledgeLevel = assessment.educationDetails.currentKnowledgeLevel;
  const weakArea = assessment.weakAreas.subjectsStruggling;

  // Base plan based on study time
  if (studyTime === '1 hour') {
    plan.push('Focus on high-priority topics first');
    plan.push('Use micro-learning sessions of 20-30 minutes');
  } else if (studyTime === '3 hours') {
    plan.push('Divide time: 40% weak areas, 35% revision, 25% new topics');
  } else if (studyTime === '5 hours') {
    plan.push(
      'Comprehensive study: 50% weak areas, 30% practice, 20% revision'
    );
  }

  // Knowledge level adjustments
  if (knowledgeLevel === 'Beginner') {
    plan.push('Start with fundamentals and basic concepts');
    plan.push('Use visual learning materials and practice tests');
  } else if (knowledgeLevel === 'Advanced') {
    plan.push('Focus on advanced problem-solving and speed');
    plan.push('Practice previous year questions extensively');
  }

  // Weak area focus
  if (weakArea && weakArea !== 'None') {
    plan.push(`Dedicate 60% of study time to ${weakArea}`);
    plan.push(`Take specialized tests for ${weakArea}`);
  }

  return plan;
}

function identifyStrengths(answers) {
  const strengths = [];

  if (answers.knowledge_level === 'advanced') {
    strengths.push('Strong foundational knowledge');
  }
  if (answers.study_time === '5hours') {
    strengths.push('Excellent time commitment');
  }
  if (answers.stress_level === 'low') {
    strengths.push('Good stress management');
  }
  if (answers.preferred_time === 'morning') {
    strengths.push('Productive morning routine');
  }

  return strengths.length > 0 ? strengths : ['Determined to improve'];
}

function identifyImprovements(answers) {
  const improvements = [];

  if (answers.knowledge_level === 'beginner') {
    improvements.push('Build stronger fundamentals');
  }
  if (answers.study_time === '1hour') {
    improvements.push('Gradually increase study hours');
  }
  if (answers.stress_level === 'high' || answers.stress_level === 'need_help') {
    improvements.push('Develop stress management techniques');
  }
  if (answers.weakness_area) {
    improvements.push(
      `Focus more on ${answers.weakness_area.replace('_', ' ')}`
    );
  }

  return improvements;
}
function calculateDailyProgress(user, assessment) {
  // Mock calculation - you can make this more sophisticated
  const baseProgress = Math.floor(Math.random() * 40) + 40; // 40-80%
  
  return {
    percentage: baseProgress,
    completed: Math.floor(baseProgress * 1.5),
    target: 100,
    tasksCompleted: Math.floor(baseProgress / 20),
    totalTasks: 5
  };
}

function getRecentActivities(userId) {
  // Mock data - replace with real activity tracking
  return [
    {
      id: 1,
      type: 'test',
      title: 'Modern History Mock Test',
      description: 'Completed practice test',
      score: 85,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      duration: 45
    },
    {
      id: 2,
      type: 'study',
      title: 'Polity: Fundamental Rights',
      description: 'Study session completed',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      duration: 30
    },
    {
      id: 3,
      type: 'notes',
      title: 'Geography: Climate Change',
      description: 'Notes reviewed',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      duration: 20
    }
  ];
}

function getCurrentAffairsData() {
  return {
    questionsCount: Math.floor(Math.random() * 5) + 5, // 5-10 questions
    readTime: 5,
    topics: ['Economic Policy', 'International Relations', 'Science & Tech'],
    lastUpdated: new Date()
  };
}

function getMotivationalQuote() {
  const quotes = [
    {
      text: "The best way to predict the future is to create it.",
      author: "Peter Drucker"
    },
    {
      text: "Success is the sum of small efforts repeated day in and day out.",
      author: "Robert Collier"
    },
    {
      text: "The expert in anything was once a beginner.",
      author: "Helen Hayes"
    },
    {
      text: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson"
    }
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
}
module.exports = {
  mapKnowledgeLevel,
  mapStudyTime,
  mapPreferredTime,
  mapStressLevel,
  mapWeaknessArea,
  generatePersonalizedPlan,
  identifyStrengths,
  identifyImprovements,
  mapKnowledgeLevelForUser,
  mapStudyTimeForUser,
  mapPreferredTimeForUser,
  mapWeaknessAreaForUser,
  calculateDailyProgress,
  getRecentActivities,
  getCurrentAffairsData,
  getMotivationalQuote,
};
