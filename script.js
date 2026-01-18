/***********************
 * JOB ROLE CONFIG
 ***********************/
const JOB_ROLES = {
  "software developer": {
    technical: ["java", "python", "javascript", "react"],
    soft: ["communication", "teamwork", "problem solving"],
    experience: ["experience", "worked", "developed"]
  }
};

/***********************
 * STOPWORDS (NEGATION SAFE)
 ***********************/
const STOPWORDS = [
  "i", "am", "the", "is", "in", "with", "and", "to", "of", "a", "an"
];

/***********************
 * TEXT PREPROCESSING
 ***********************/
function preprocessText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s.!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/***********************
 * SENTENCE SPLITTING
 ***********************/
function getSentences(text) {
  return text.split(/[.!?]/).map(s => s.trim()).filter(Boolean);
}

/***********************
 * SKILL CONFIDENCE SCORING
 ***********************/
function scoreSkill(sentence, skill) {
  if (!sentence.includes(skill)) return 0;

  if (sentence.includes("not") || sentence.includes("never") || sentence.includes("no")) return -2;
  if (sentence.includes("basic") || sentence.includes("beginner")) return 0.5;
  if (sentence.includes("good")) return 1;
  if (sentence.includes("excellent") || sentence.includes("expert") || sentence.includes("strong")) return 2;

  return 1;
}

/***********************
 * CATEGORY ANALYSIS
 ***********************/
function analyzeCategory(sentences, skills) {
  let score = 0;
  sentences.forEach(sentence => {
    skills.forEach(skill => {
      score += scoreSkill(sentence, skill);
    });
  });
  return Math.max(0, score);
}

/***********************
 * MAIN ANALYSIS FUNCTION
 ***********************/
function analyzeResume(resumeText, jobRole) {
  const role = JOB_ROLES[jobRole];
  const cleanText = preprocessText(resumeText);
  const sentences = getSentences(cleanText);

  const technicalScore = analyzeCategory(sentences, role.technical);
  const softScore = analyzeCategory(sentences, role.soft);
  const experienceScore = analyzeCategory(sentences, role.experience);

  const totalScore = technicalScore + softScore + experienceScore;
  const maxScore = (role.technical.length + role.soft.length + role.experience.length) * 2;

  return {
    technicalScore,
    softScore,
    experienceScore,
    matchPercentage: Math.round((totalScore / maxScore) * 100)
  };
}

/***********************
 * UI HANDLER
 ***********************/
function analyze() {
  const resumeText = document.getElementById("resumeText").value;
  const jobRole = document.getElementById("jobRole").value;

  if (!resumeText.trim()) {
    alert("Please paste resume text");
    return;
  }

  const result = analyzeResume(resumeText, jobRole);

  document.getElementById("matchPercent").innerText = result.matchPercentage;
  document.getElementById("techScore").innerText = result.technicalScore;
  document.getElementById("softScore").innerText = result.softScore;
  document.getElementById("expScore").innerText = result.experienceScore;

  document.getElementById("result").classList.remove("hidden");
}
